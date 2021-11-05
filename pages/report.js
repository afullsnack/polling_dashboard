import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import useSWR from "swr";
import withLayout from "../components/layout";
import { url } from "../lib/config";

function Report() {
  const { error, data } = useSWR(`${url}/api/votes`);
  const [incidentReports, setIncidentReports] = useState([]);

  // Get and setup data
  const setUpData = (vData) => {
    const incidentReport = [];
    vData["data"];
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
              place: item["UNIT"],
              imageData: item["REPORT_IMG"],
            });
          }
        });
      }
    }
    setIncidentReports(incidentReport);
    console.log("Incidents", incidentReport);
  };

  useEffect(async () => {
    // after load data
    data ? await setUpData(data) : error;
    return () => {};
  }, [data]);

  return (
    <Row gutter={[16, 16]} style={{ width: "100%", margin: 0, padding: 0 }}>
      {[...new Set(incidentReports)].map((report, i) => (
        <Col xs={{ span: 24 }} lg={{ span: 8 }}>
          <Card
            title={report?.place}
            cover={
              <img
                src={"data:image/jpeg;base64," + report?.imageData?.url}
                width="inherit"
                height="100%"
              />
            }
            style={{ height: "100%" }}
          >
            <h3>{report?.report}</h3>
            <br />
            <h4>LATITUDE: {report?.imageData?.lat}</h4>
            <h4>LONGITUDE: {report?.imageData?.lng}</h4>
          </Card>
        </Col>
      ))}
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
