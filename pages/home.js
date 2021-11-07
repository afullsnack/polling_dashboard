import { Card, Col, Row, Select, Spin, Statistic, Switch, Tabs } from "antd";
import "isomorphic-fetch";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import useSWR from "swr";
import withLayout from "../components/layout";
import { pdata, url } from "../lib/config";

// console.log("Polling data", data);

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
const _lgaList = pdata.map((item) => item?.LGA);

function Votes() {
  const { error, data } = useSWR(`${url}/api/votes`);

  const [totalVotes, setTotalVotes] = useState([0, 0, 0, 0, 0, 0]);
  const [totalCast, setTotalCast] = useState(0);
  const [invalid, setInvalid] = useState(0);
  const [filter, setFilter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lgaVal, setLGAVal] = useState();
  const [wardVal, setWARDVal] = useState();
  const [unitVal, setUNITVal] = useState();
  // const [newChartData, setNewChartData] = useState(chartData);

  const [_wardList, _setWardList] = useState([]);
  const [_pollingList, _setPollingList] = useState([]);

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
    // console.log("Data", vData["data"]);
    parties.forEach((val, idxx) => {
      // check the if filter is on
      var partyTotal = 0;
      if (filter) {
        if (unitVal) {
          // For if unit filter is selected

          for (var i = 0; i < vData["data"]?.length; i++) {
            var wardsTotal = 0;
            if (lgaVal === vData["data"][i]["LGA"]) {
              for (var j = 0; j < vData["data"][i]["WARDS"].length; j++) {
                var unitsTotal = 0;
                if (wardVal === vData["data"][i]["WARDS"][j]["WARD"]) {
                  vData["data"][i]["WARDS"][j]["PUs"].forEach(
                    //SUMMING OF PU TOTALS
                    (item, idx) => {
                      if (unitVal === item["UNIT"]) {
                        unitsTotal += item["TOTAL_V_COUNT"][val];
                      }
                    }
                  );
                  wardsTotal += unitsTotal;
                }
              }
              partyTotal += wardsTotal;
            }
          }
          if (partyTotal === totalVotes[idxx]) return;
          totalArray.push(partyTotal);
          setTotalVotes(totalArray);
        } else if (wardVal) {
          // For if ward filter is selected

          for (var i = 0; i < vData["data"]?.length; i++) {
            var wardsTotal = 0;
            if (lgaVal === vData["data"][i]["LGA"]) {
              for (var j = 0; j < vData["data"][i]["WARDS"].length; j++) {
                var unitsTotal = 0;
                if (wardVal === vData["data"][i]["WARDS"][j]["WARD"]) {
                  vData["data"][i]["WARDS"][j]["PUs"].forEach(
                    //SUMMING OF PU TOTALS
                    (item, idx) => {
                      unitsTotal += item["TOTAL_V_COUNT"][val];
                    }
                  );
                  wardsTotal += unitsTotal;
                }
              }
              partyTotal += wardsTotal;
            }
          }
          if (partyTotal === totalVotes[idxx]) return;
          totalArray.push(partyTotal);
          setTotalVotes(totalArray);
        } else if (lgaVal) {
          for (var i = 0; i < vData["data"]?.length; i++) {
            var wardsTotal = 0;
            if (lgaVal === vData["data"][i]["LGA"]) {
              for (var j = 0; j < vData["data"][i]["WARDS"].length; j++) {
                //WARD LOOP
                // console.log(vData["data"][i]["WARDS"][j]["PUs"]);
                var unitsTotal = 0;
                vData["data"][i]["WARDS"][j]["PUs"].forEach(
                  //SUMMING OF PU TOTALS
                  (item, idx) => {
                    unitsTotal += item["TOTAL_V_COUNT"][val];
                  }
                );
                wardsTotal += unitsTotal;
              }
              partyTotal += wardsTotal;
            }
          }
          if (partyTotal === totalVotes[idxx]) return;
          totalArray.push(partyTotal);

          setTotalVotes(totalArray);
        }
      } else {
        for (var i = 0; i < vData["data"]?.length; i++) {
          var wardsTotal = 0;
          for (var j = 0; j < vData["data"][i]["WARDS"].length; j++) {
            //WARD LOOP
            // console.log(vData["data"][i]["WARDS"][j]["PUs"]);
            var unitsTotal = 0;
            vData["data"][i]["WARDS"][j]["PUs"].forEach(
              //SUMMING OF PU TOTALS
              (item, idx) => {
                unitsTotal += item["TOTAL_V_COUNT"][val];
              }
            );
            wardsTotal += unitsTotal;
          }
          partyTotal += wardsTotal;
        }
        if (partyTotal === totalVotes[idxx]) return;
        totalArray.push(partyTotal);
        setTotalVotes(totalArray);
      }
    });

    // Filter for invalid and total cast
    if (filter) {
      if (unitVal) {
        for (var i = 0; i < vData["data"]?.length; i++) {
          var totalVoteCast1 = 0;
          var invalidVotes1 = 0;
          if (lgaVal === vData["data"][i]["LGA"]) {
            for (var j = 0; j < vData["data"][i]["WARDS"].length; j++) {
              var totalVoteCast2 = 0;
              var invalidVotes2 = 0;
              if (wardVal === vData["data"][i]["WARDS"][j]["WARD"]) {
                vData["data"][i]["WARDS"][j]["PUs"].forEach((item, idx) => {
                  if (unitVal === item["UNIT"]) {
                    totalVoteCast2 += item["TOTAL_CAST"];
                    invalidVotes2 += item["INVALID_VOTES"];
                  }
                });
                totalVoteCast1 += totalVoteCast2;
                invalidVotes1 += invalidVotes2;
              }
            }
            totalVoteCast += totalVoteCast1;
            invalidVotes += invalidVotes1;
          }
        }
      } else if (wardVal) {
        for (var i = 0; i < vData["data"]?.length; i++) {
          var totalVoteCast1 = 0;
          var invalidVotes1 = 0;
          if (lgaVal === vData["data"][i]["LGA"]) {
            for (var j = 0; j < vData["data"][i]["WARDS"].length; j++) {
              var totalVoteCast2 = 0;
              var invalidVotes2 = 0;
              if (wardVal === vData["data"][i]["WARDS"][j]["WARD"]) {
                vData["data"][i]["WARDS"][j]["PUs"].forEach((item, idx) => {
                  totalVoteCast2 += item["TOTAL_CAST"];
                  invalidVotes2 += item["INVALID_VOTES"];
                });
                totalVoteCast1 += totalVoteCast2;
                invalidVotes1 += invalidVotes2;
              }
            }
            totalVoteCast += totalVoteCast1;
            invalidVotes += invalidVotes1;
          }
        }
      } else if (lgaVal) {
        for (var i = 0; i < vData["data"]?.length; i++) {
          var totalVoteCast1 = 0;
          var invalidVotes1 = 0;
          if (lgaVal === vData["data"][i]["LGA"]) {
            for (var j = 0; j < vData["data"][i]["WARDS"].length; j++) {
              var totalVoteCast2 = 0;
              var invalidVotes2 = 0;

              vData["data"][i]["WARDS"][j]["PUs"].forEach((item, idx) => {
                totalVoteCast2 += item["TOTAL_CAST"];
                invalidVotes2 += item["INVALID_VOTES"];
              });
              totalVoteCast1 += totalVoteCast2;
              invalidVotes1 += invalidVotes2;
            }
            totalVoteCast += totalVoteCast1;
            invalidVotes += invalidVotes1;
          }
        }
      }
    } else {
      for (var i = 0; i < vData["data"]?.length; i++) {
        var totalVoteCast1 = 0;
        var invalidVotes1 = 0;
        for (var j = 0; j < vData["data"][i]["WARDS"].length; j++) {
          var totalVoteCast2 = 0;
          var invalidVotes2 = 0;
          vData["data"][i]["WARDS"][j]["PUs"].forEach((item, idx) => {
            totalVoteCast2 += item["TOTAL_CAST"];
            invalidVotes2 += item["INVALID_VOTES"];
          });
          totalVoteCast1 += totalVoteCast2;
          invalidVotes1 += invalidVotes2;
        }
        totalVoteCast += totalVoteCast1;
        invalidVotes += invalidVotes1;
      }
    }

    setLoading(false);
    if (totalVoteCast === totalCast && invalidVotes === invalid) return;

    setTotalCast(totalVoteCast);
    setInvalid(invalidVotes);
  };

  // handle polling data parsing

  useEffect(async () => {
    // after load data
    data ? await setUpData(data) : error;
    return () => {};
  }, [totalVotes, data, lgaVal, wardVal, unitVal]);

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
      <Col xs={{ span: 24 }} lg={{ span: 12 }}>
        <h1>
          Filter:{" "}
          <Switch
            size="small"
            onChange={(checked) => {
              setFilter(checked);
              if (!checked) {
                setLGAVal(null);
                setWARDVal(null);
                setUNITVal(null);
              }
            }}
          />
        </h1>
        <br />
        <Select
          disabled={!filter}
          defaultActiveFirstOption
          // defaultValue={_lgaList[0]}
          placeholder="CHOOSE LGA"
          value={lgaVal}
          onChange={(value) => {
            setLGAVal(value);
            setWARDVal(null);
            setUNITVal(null);

            pdata.forEach((item) => {
              if (item.LGA === value) {
                _setWardList(item.WARDS.map((e) => e.WARD));
              }
            });
          }}
          style={{ minWidth: 230 }}
        >
          {_lgaList?.map((lga) => (
            <Option key={lga} value={lga}>
              {lga}
            </Option>
          ))}
        </Select>
        <Select
          disabled={!filter}
          defaultActiveFirstOption
          value={wardVal}
          // defaultValue={_wardList[0]}
          placeholder="CHOOSE WARD"
          onChange={(value) => {
            setWARDVal(value);
            setUNITVal(null);

            pdata.forEach((item) => {
              if (item.LGA === lgaVal) {
                item.WARDS.forEach((e) => {
                  if (e.WARD === value) {
                    _setPollingList(e.PUs.map((e) => e));
                  }
                });
              }
            });
          }}
          style={{ minWidth: 230 }}
        >
          {_wardList?.map((ward) => (
            <Option key={ward} value={ward}>
              {ward}
            </Option>
          ))}
        </Select>
        <Select
          disabled={!filter}
          defaultActiveFirstOption
          value={unitVal}
          // defaultValue={_pollingList[0]}
          placeholder="CHOOSE UNIT"
          onChange={(value) => setUNITVal(value)}
          style={{ minWidth: 230 }}
        >
          {_pollingList?.map((unit) => (
            <Option key={unit} value={unit}>
              {unit}
            </Option>
          ))}
        </Select>
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
                  <Col key={party} xs={{ span: 24 }} lg={{ span: 8 }}>
                    <Card>
                      <Statistic
                        title={
                          <>
                            <span>TOTAL {party} VOTES</span>
                            <br />
                            <span>
                              {lgaVal ? lgaVal : null}{" "}
                              {wardVal ? ` - ${wardVal}` : null}{" "}
                              {unitVal ? ` - ${unitVal}` : null}
                            </span>
                          </>
                        }
                        value={totalVotes[i]}
                      />
                    </Card>
                  </Col>
                ))
              ) : (
                <Spin size="large" />
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
