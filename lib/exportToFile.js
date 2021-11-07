import Button from "antd/lib/button";
import FileSaver from "file-saver";
import React from "react";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";

export const ExportCSV = ({ jsonData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (jsonData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(JSON.stringify(jsonData));
    const wb = { Sheets: { data: ws }, SheetNames: ["reports"] };
    const excelBuffer = XLSX.writeFile(wb, fileName, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const headers = [
    { label: "REPORT", key: "report" },
    { label: "LGA", key: "lga" },
    { label: "WARD", key: "ward" },
    { label: "POLLING UNIT", key: "unit" },
  ];

  let data = [];
  jsonData.forEach((item) => {
    data.push({
      report: item?.report,
      lga: item?.place?.lga,
      ward: item?.place?.ward,
      unit: item?.place?.unit,
      timestamp: item?.timestamp,
    });
  });
  return (
    <Button type="primary">
      <CSVLink data={data} filename={fileName}>
        Export Reports
      </CSVLink>
    </Button>
  );
  // onClick={(e) => exportToCSV(jsonData, fileName)}
};
