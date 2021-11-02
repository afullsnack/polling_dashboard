import { Card, Col, Row, Tabs } from "antd";
import "isomorphic-fetch";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import useSWR from "swr";
import withLayout from "../components/layout";
import { url } from "../lib/config";

const { TabPane } = Tabs;

function Votes() {
  const { error, data } = useSWR(`${url}/api/votes`);
  const [resultSheets, setResultSheets] = useState([]);
  const [incidentReports, setIncidentReports] = useState([]);

  const [totalVotes, setTotalVotes] = useState([0, 0, 0, 0, 0, 0]);
  // const [newChartData, setNewChartData] = useState(chartData);
  const parties = ["PDP", "YPP", "APC", "APGA", "ZLP", "LP"];
  const chartData = {
    labels: parties,
    datasets: [
      {
        // label: "Dont show",
        data: totalVotes,

        backgroundColor: [
          "#cd0000",
          "#eb7d44",
          "#70AA5B",
          "#CAF0FD",
          "#134D85",
          "#D1CB5C",
        ],
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    animation: true,
    tooltips: {
      callbacks: {
        label: function (tooltipItem) {
          return tooltipItem.yLabel;
        },
      },
    },
  };

  const setUpData = (vData) => {
    const totalArray = [];
    const resultSheet = [];
    const incidentReport = [];
    vData["data"];
    parties.forEach((val, idxx) => {
      var partyTotal = 0;
      for (var i = 0; i < vData["data"].length; i++) {
        //LGA LOOP
        // console.log(vData["data"][i]["LGA"]);
        var wardsTotal = 0;
        for (var j = 0; j < vData["data"][i]["WARDS"].length; j++) {
          //WARD LOOP
          // console.log(vData["data"][i]["WARDS"][j]["PUs"]);
          var unitsTotal = 0;
          unitsTotal = vData["data"][i]["WARDS"][j]["PUs"].reduce(
            //SUMMING OF PU TOTALS
            (final, current, idx, array) => {
              // console.log(val, current, idx);
              // if(current["TOTAL_V_COUNT"][val] <= 0){ continue;}
              final += current["TOTAL_V_COUNT"][val];
              array[idx]["REPORT"] !== ""
                ? incidentReport.push({
                    report: array[idx]["REPORT"],
                    place: array[idx]["UNIT"],
                  })
                : null;
              array[idx]["RESULT_IMG"]
                ? resultSheet.push({
                    place: array[idx]["UNIT"],
                    url: array[idx]["RESULT_IMG"]["url"],
                    lat: array[idx]["RESULT_IMG"]["lat"],
                    lng: array[idx]["RESULT_IMG"]["lng"],
                  })
                : null;
              return final;
            },
            0
          );
          wardsTotal += unitsTotal;
          // console.log(val, "UNIT TOTAL:", unitsTotal);
        }
        partyTotal += wardsTotal;
        // console.log(val, "WARD TOTAL:", wardsTotal);
      }
      // console.log(val, "LGA TOTAL:", partyTotal);
      totalArray.push(partyTotal);
    });
    setTotalVotes(totalArray);
    setResultSheets(resultSheet);
    setIncidentReports(incidentReport);
  };

  useEffect(async () => {
    // after load data
    data ? await setUpData(data) : error;
    return () => {};
  }, [totalVotes, data]);

  return (
    <Row gutter={[16, 16]} style={{ width: "100%", margin: 0, padding: 0 }}>
      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
        Total Vote Counts{" "}
        {/* <Button onClick={() => setTotalVotes([1, 2, 3, 4, 5, 6])}>
          Change Data
        </Button>
        <Button onClick={() => setTotalVotes([3, 1, 2, 4, 7, 5])}>
          Change Data again
        </Button> */}
      </Col>
      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
        <Tabs defaultActiveKey="1" onChange={(key) => console.log(key)}>
          <TabPane tab="Chart" key="1">
            <Bar data={chartData} options={options} />
          </TabPane>
          <TabPane tab="Result Sheet" key="2">
            <Row
              gutter={[8, 8]}
              style={{ width: "100%", margin: 0, padding: 0 }}
            >
              {resultSheets.map((sheet, i) => (
                <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                  <Card cover={<img src={sheet?.url} height="inherit" />}>
                    <h4>{sheet?.place}</h4>
                    <span>Latitude: {sheet?.lat}</span>
                    <span>Longitude: {sheet?.lng}</span>
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>
        </Tabs>
        {/* {!data ? "Loading..." : setUpData(data) || error} */}
      </Col>
      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
        <Card title="Incident Reports">
          {incidentReports.map((report, i) => (
            <Card.Grid style={{ width: "33%", textAlign: "left" }}>
              <h4>{report?.place}</h4>
              <span>{report?.report}</span>
            </Card.Grid>
          ))}
        </Card>
      </Col>
    </Row>
  );
}

export async function getServerSideProps(ctx) {
  // const { data, error, message } = await fetch(`${url}/api/user`, {
  //   method: "GET",
  // })
  //   .then((res) => res.json())
  //   .catch((err) => console.log(err.message || err.toString()));
  // if (error) {
  //   return {
  //     props: {},
  //   };
  // }
  // // var users = JSON.stringify(data);
  // console.log("users", data, message, error);
  return {
    props: {
      // users: data,
    },
  };
}
export default withLayout(Votes);
