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
    var incidents;
    vData["data"];
    parties.forEach((val, idxx) => {
      for (var i = 0; i < vData["data"].length; i++) {
        //LGA LOOP
        // console.log(vData["data"][i]["LGA"]);

        for (var j = 0; j < vData["data"][i]["WARDS"].length; j++) {
          //WARD LOOP
          // console.log(vData["data"][i]["WARDS"][j]["PUs"]);

          incidents = vData["data"][i]["WARDS"][j]["PUs"].reduce(
            //SUMMING OF PU TOTALS
            (final, current, idx, array) => {
              if (current["REPORT"] != "" || current["REPORT"] != null) {
                final["REPORT"] = current["REPORT"];
                if (
                  current["REPORT_IMG"] != undefined ||
                  current["REPORT_IMG"] != null
                ) {
                  final["REPORT_IMG"] = current["REPORT_IMG"];
                }
              }
              return final;
            },
            {}
          );
        }
      }
    });
    // setIncidentReports(incidentReport);
    console.log("Incidents", incidents);
  };

  useEffect(async () => {
    // after load data
    data ? await setUpData(data) : error;
    return () => {};
  }, [data]);

  return (
    <Row gutter={[16, 16]} style={{ width: "100%", margin: 0, padding: 0 }}>
      <Col xs={{ span: 24 }} lg={{ span: 24 }}>
        <Card title="Incident Reports">
          {[...new Set(incidentReports)].map((report, i) => (
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
