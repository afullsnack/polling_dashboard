const XLSX = require("xlsx");
const fs = require("fs");
const parse = require("csv-parse");

function parseFile() {
  const workbook = XLSX.readFile("../public/polling_data.xlsx");
  var jsonBuilder = [];
  // console.log(workbook);
  for (const sheetName of workbook.SheetNames) {
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // console.log(JSON.stringify(data));
    for (const info in data) {
      if (jsonBuilder.length != 0) {
        var lastLGAIdx = jsonBuilder.length - 1;
        if (
          jsonBuilder[lastLGAIdx]["LGA"] == data[info]["LGA"].trim() &&
          jsonBuilder[lastLGAIdx]["WARDS"].length != 0
        ) {
          // this lga exists and wards is not empty
          var lastWARDIdx = jsonBuilder[lastLGAIdx]["WARDS"].length - 1;
          if (
            jsonBuilder[lastLGAIdx]["WARDS"][lastWARDIdx]["WARD"] ==
              data[info]["WARD"].trim() &&
            jsonBuilder[lastLGAIdx]["WARDS"][lastWARDIdx]["PUs"].length != 0
          ) {
            // ward exists and PUs is not empty
            jsonBuilder[lastLGAIdx]["WARDS"][lastWARDIdx]["PUs"].push(
              data[info]["POLLINGU"].trim()
            );
          } else {
            jsonBuilder[lastLGAIdx]["WARDS"].push({
              WARD: data[info]["WARD"].trim(),
              PUs: [data[info]["POLLINGU"].trim()],
            });
          }
        } else {
          // if LGA does not exits and wards is empty
          jsonBuilder.push({
            LGA: data[info]["LGA"].trim(),
            WARDS: [
              {
                WARD: data[info]["WARD"].trim(),
                PUs: [data[info]["POLLINGU"].trim()],
              },
            ],
          });
        }
      } else {
        // jsonBuilder is empty and needs to be initialized
        jsonBuilder.push({
          LGA: data[info]["LGA"].trim(),
          WARDS: [
            {
              WARD: data[info]["WARD"].trim(),
              PUs: [data[info]["POLLINGU"].trim()],
            },
          ],
        });
      }
    } // end of data loop
  }
  writeToJson(jsonBuilder);
}

function writeToJson(data) {
  fs.writeFileSync("./parsedData.json", JSON.stringify(data), {
    encoding: "utf-8",
  });
}
parseFile();
