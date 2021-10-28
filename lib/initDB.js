// import * as parsedData from "../lib/parsedData.json";
const data = require("../lib/parsedData.json");
const { default: Votes } = require("../models/Votes");

async function initDB() {
  console.log(typeof data);
  try {
    // console.log(data);
    for (const x in data) {
      var newVoteData = {};
      console.info("LGA", data[x].LGA);
      newVoteData["LGA"] = data[x].LGA;
      newVoteData["WARDS"] = [];

      for (const ward in data[x].WARDS) {
        newVoteData["WARDS"].push({
          WARD: data[x].WARDS[ward].WARD,
          PUs: data[x].WARDS[ward].PUs.map((val, i) => {
            return {
              UNIT: val,
            };
          }),
        });
      }

      // console.log("New vote data", JSON.stringify(newVoteData));

      const saveData = new Votes(newVoteData);

      await saveData.save();
    }
  } catch (err) {
    console.log(err.message || err.toString());
  }
}

export default initDB;
