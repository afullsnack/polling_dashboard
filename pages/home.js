import {
  Card,
  Col,
  Radio,
  Row,
  Select,
  Spin,
  Statistic,
  Switch,
  Tabs
} from "antd";
import "isomorphic-fetch";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import useSWR from "swr";
import withLayout from "../components/layout";
import { url } from "../lib/config";

const { TabPane } = Tabs;
const { Option } = Select;
const radioOptions = [
  {
    label: "LGA",
    value: "lga",
  },
  {
    label: "WARD",
    value: "ward",
  },
  {
    label: "UNIT",
    value: "unit",
  },
];

function Votes() {
  const { error, data } = useSWR(`${url}/api/votes`);

  const [totalVotes, setTotalVotes] = useState([0, 0, 0, 0, 0, 0]);
  const [totalCast, setTotalCast] = useState(0);
  const [invalid, setInvalid] = useState(0);
  const [filterBy, setFilterBy] = useState("lga");
  const [filter, setFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [newChartData, setNewChartData] = useState(chartData);
  const parties = ["PDP", "APGA", "APC", "YPP", "ZLP", "LP"];
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
    var totalVoteCast = 0;
    var invalidVotes = 0;
    // const resultSheet = [];
    // const incidentReport = [];
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
          vData["data"][i]["WARDS"][j]["PUs"].forEach(
            //SUMMING OF PU TOTALS
            (item, idx) => {
              // console.log(array[idx]);
              // if(current["TOTAL_V_COUNT"][val] <= 0){ continue;}
              unitsTotal += item["TOTAL_V_COUNT"][val];
              totalVoteCast += item["TOTAL_CAST"];
              invalidVotes += item["INVALID_VOTES"];
            }
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

    if (totalVoteCast === totalCast || invalidVotes === invalid) return;
    setTotalVotes(totalArray);
    setTotalCast(totalVoteCast);
    setInvalid(invalidVotes);
    setLoading(false);
    // setResultSheets(resultSheet);
    // setIncidentReports(incidentReport);
  };

  const filterByChange = (e) => setFilterBy(e.target.value);
  // handle polling data parsing

  useEffect(async () => {
    // after load data
    data ? await setUpData(data) : error;
    return () => {};
  }, [totalVotes, data]);

  return (
    <Row gutter={[16, 16]} style={{ width: "100%", margin: 0, padding: 0 }}>
      <Col xs={{ span: 24 }} lg={{ span: 12 }}>
        <span style={{ marginRight: 20 }}>Total Votes Cast: {totalCast}</span>
        <span>Total Invalid Votes: {invalid}</span>
        {/* <Button onClick={() => setTotalVotes([1, 2, 3, 4, 5, 6])}>
          Change Data
        </Button>
        <Button onClick={() => setTotalVotes([3, 1, 2, 4, 7, 5])}>
          Change Data again
        </Button> */}
      </Col>
      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
        <h1>
          Filter by:{" "}
          <Switch size="small" onChange={(checked) => setFilter(checked)} />
        </h1>
        <Radio.Group
          options={radioOptions}
          disabled={!filter}
          onChange={filterByChange}
          value={filterBy}
          size="small"
          optionType="button"
        />
      </Col>
      <Col xs={{ span: 24 }} lg={{ span: 6 }}>
        <h1>Select {filterBy.toUpperCase()}:</h1>
        {filterBy == "unit" ? (
          <>
            <Select
              disabled={!filter}
              defaultActiveFirstOption
              defaultValue="Test"
            >
              <Option value="Test">Test</Option>
            </Select>
            <Select
              disabled={!filter}
              defaultActiveFirstOption
              defaultValue="Test"
            >
              <Option value="Test">Test</Option>
            </Select>
            <Select
              disabled={!filter}
              defaultActiveFirstOption
              defaultValue="Test"
            >
              <Option value="Test">Test</Option>
            </Select>
          </>
        ) : filterBy == "ward" ? (
          <>
            <Select
              disabled={!filter}
              defaultActiveFirstOption
              defaultValue="Test"
            >
              <Option value="Test">Test</Option>
            </Select>
            <Select
              disabled={!filter}
              defaultActiveFirstOption
              defaultValue="Test"
            >
              <Option value="Test">Test</Option>
            </Select>
          </>
        ) : (
          <Select
            disabled={!filter}
            defaultActiveFirstOption
            defaultValue="Test"
          >
            <Option value="Test">Test</Option>
          </Select>
        )}
      </Col>
      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
        <Tabs defaultActiveKey="1" onChange={(key) => console.log(key)}>
          <TabPane tab="Results" key="1">
            <Row
              gutter={[16, 16]}
              style={{ width: "100%", margin: 0, padding: 0 }}
            >
              {loading == false ? (
                parties.map((party, i) => (
                  <Col xs={{ span: 24 }} lg={{ span: 8 }}>
                    <Card>
                      <Statistic
                        title={"TOTAL " + party + " VOTES"}
                        value={totalVotes[i]}
                      />
                    </Card>
                  </Col>
                ))
              ) : (
                <>
                  <Spin size="large" />
                  <br />
                  {data ? (
                    <span>Data received...processing result data</span>
                  ) : (
                    <span>Loading data...</span>
                  )}
                </>
              )}
            </Row>
          </TabPane>
          <TabPane tab="Chart" key="2">
            <Row
              gutter={[8, 8]}
              style={{ width: "100%", margin: 0, padding: 0 }}
            >
              <Bar data={chartData} options={options} />
            </Row>
          </TabPane>
        </Tabs>
        {/* {!data ? "Loading..." : setUpData(data) || error} */}
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
