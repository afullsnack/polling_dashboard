import handler from "../../lib/handler";
// import initDB from "../../lib/initDB";
import Votes from "../../models/Votes";

export default handler
  .put(async (req, res) => {
    try {
      const { lga, ward, unit, vote_count, image_data } = req.body;

      //Update the unit vote count with data received from client
      const votes = await Votes.updateOne(
        {
          // LGA: lga,
          // "WARDS.WARD": ward,
          "WARDS.PUs.UNIT": unit,
        },
        {
          $set: {
            "WARDS.$.PUs.$[i].TOTAL_V_COUNT.PDP": vote_count?.PDP,
            "WARDS.$.PUs.$[i].TOTAL_V_COUNT.YPP": vote_count?.YPP,
            "WARDS.$.PUs.$[i].TOTAL_V_COUNT.APC": vote_count?.APC,
            "WARDS.$.PUs.$[i].TOTAL_V_COUNT.APGA": vote_count?.APGA,
            "WARDS.$.PUs.$[i].TOTAL_V_COUNT.ZLP": vote_count?.ZLP,
            "WARDS.$.PUs.$[i].TOTAL_V_COUNT.LP": vote_count?.LP,
            "WARDS.$.PUs.$[i].TOTAL_CAST": vote_count?.TOTAL_CAST,
            "WARDS.$.PUs.$[i].INVALID_VOTES": vote_count?.INVALID_VOTES,
            "WARDS.$.PUs.$[i].IMAGE_DATA": {
              url: image_data?.image,
              lat: image_data?.latitude,
              lng: image_data?.longitude,
            },
          },
        },
        {
          arrayFilters: [
            {
              "i.UNIT": unit,
            },
          ],
        }
      );
      if (votes.acknowledged && votes.modifiedCount >= 1) {
        res.status(200).json({
          error: false,
          message: "Votes updated successfully",
          data: null,
        });
        return;
      }
      res.status(401).json({
        error: true,
        message: "Something went wrong trying to update votes",
        data: null,
      });
    } catch (e) {
      console.log(e);
      throw new Error(e.message || e.toString());
    }
  })
  .get(async (req, res) => {
    // get all the users for the dashboard

    console.log("Params or Query Data", req.query, req.params);
    const { place, type } = req.query;

    if (place || type) {
      console.log("Query", place, type);
      const votes = await Votes.findOne(
        type == "LGA"
          ? {
              LGA: place || null,
              // "WARDS.PUs.TOTAL_V_COUNT.PDP": { $gte: 0 },
            }
          : type == "WARD"
          ? {
              "WARDS.WARD": place || null,
              // "WARDS.PUs.TOTAL_V_COUNT.PDP": { $gte: 0 },
            }
          : {
              "WARDS.PUs.UNIT": place || null,
              // "WARDS.PUs.TOTAL_V_COUNT.PDP": { $gte: 0 },
            }
      );
      console.log("Return data", votes);
      votes
        ? res.status(200).json({
            error: false,
            message: "Data found",
            data: votes,
          })
        : res.status(200).json({
            error: true,
            message: "Data not found",
            data: null,
          });
    } else {
      const votes = await Votes.find({}, ["LGA", "WARDS"]);
      votes
        ? res.status(200).json({
            error: false,
            message: "Data found",
            data: votes,
          })
        : res.status(200).json({
            error: true,
            message: "Data not found",
            data: null,
          });
    }
  });
// .post(async (req, res) => {
//   await initDB();
//   res.status(200).send("All went well");
// });
