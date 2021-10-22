import Button from "antd/lib/button";
import React from "react";
import { CSVLink } from "react-csv";
import * as XLSX from "xlsx";

export const ExportCSV = ({ jsonData, fileName }) => {
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".xlsx";

  const exportToCSV = (jsonData, fileName) => {
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.writeFile(wb, fileName, {
      bookType: "xlsx",
      type: "array",
    });
    // const data = new Blob([excelBuffer], { type: fileType });
    // FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <Button type="primary">
      <CSVLink data={jsonData} filename={fileName}>
        Export
      </CSVLink>
    </Button>
  );
  // onClick={(e) => exportToCSV(jsonData, fileName)}
};
