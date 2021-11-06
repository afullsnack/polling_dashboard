import { EnvironmentOutlined } from "@ant-design/icons";
import { Card, Col, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import useSWR from "swr";
import withLayout from "../components/layout";
import { url } from "../lib/config";
import { ExportCSV } from "../lib/exportToFile";

function Report() {
  const { error, data } = useSWR(`${url}/api/votes`);
  const [incidentReports, setIncidentReports] = useState([]);
  const [loading, setLoading] = useState(true);
  // Get and setup data
  const setUpData = (vData) => {
    const incidentReport = [];
    for (var i = 0; i < vData["data"].length; i++) {
      //LGA LOOP
      // console.log(vData["data"][i]["LGA"]);

      for (var j = 0; j < vData["data"][i]["WARDS"].length; j++) {
        //WARD LOOP
        // console.log(vData["data"][i]["WARDS"][j]["PUs"]);

        vData["data"][i]["WARDS"][j]["PUs"].forEach((item, idx) => {
          if (item["REPORT"] !== "" && item["REPORT_IMG"] !== undefined) {
            incidentReport.push({
              report: item["REPORT"],
              place: {
                unit: item["UNIT"],
                ward: vData["data"][i]["WARDS"][j]["WARD"],
                lga: vData["data"][i]["LGA"],
              },
              imageData: item["REPORT_IMG"],
            });
          }
        });
      }
    }
    setIncidentReports(incidentReport);
    setLoading(false);
  };

  useEffect(async () => {
    // after load data
    data ? await setUpData(data) : error;
    return () => {};
  }, [data]);

  return (
    <Row gutter={[16, 16]} style={{ width: "100%", margin: 0, padding: 0 }}>
      <Col span={24}>
        <Card>
          <ExportCSV jsonData={incidentReports} fileName="Incident reports" />
        </Card>
      </Col>
      {loading == false ? (
        [...new Set(incidentReports)].map((report, i) => (
          <Col xs={{ span: 24 }} lg={{ span: 8 }}>
            <Card
              cover={
                report?.imageData?.url != "" ? (
                  <img
                    src={"data:image/jpeg;base64," + report?.imageData?.url}
                    width="inherit"
                  />
                ) : null
              }
              style={{ height: "100%" }}
            >
              <h3>{report?.report}</h3>
              <br />
              <span>
                <EnvironmentOutlined
                  style={{ marginRight: 10, color: "#1890ff" }}
                />
                {report?.place?.unit}, {report?.place?.ward},{" "}
                {report?.place?.lga}
              </span>
              <br />
              <h4>LATITUDE: {report?.imageData?.lat}</h4>
              <h4>LONGITUDE: {report?.imageData?.lng}</h4>
            </Card>
          </Col>
        ))
      ) : (
        <center>
          <Spin size="large" />
        </center>
      )}
    </Row>
  );
}

export default withLayout(Report);

// {[...new Set(resultSheets)].map((sheet, i) => {
//   // var buff = new Buffer.from(sheet.url, 'base64');
//   return (
//     <Col xs={{ span: 24 }} lg={{ span: 6 }}>
//       <Card
//         cover={
//           <img
//             src={"data:image/png;base64," + sheet.url}
//             height="inherit"
//           />
//         }
//       >
//         <h4>{sheet?.place}</h4>
//         <span>Latitude: {sheet?.lat}</span>
//         <br />
//         <span>Longitude: {sheet?.lng}</span>
//       </Card>
//     </Col>
//   );
// })}
