import handler from "../../lib/handler";
import Votes from "../../models/Votes";

export default handler
  .put(async (req, res) => {
    //Update the unit vote count with data received from client
    try {
      const { lga, ward, unit, vote_count } = req.body;

      const votes = await Votes.updateOne(
        {
          LGA: lga,
          "WARDS.WARD": ward,
          "WARDS.PUs.UNIT": unit,
        },
        {
          $set: {
            "WARDS.$.PUs.$[i].TOTAL_V_COUNT.PDP": vote_count.PDP,
            "WARDS.$.PUs.$[i].TOTAL_V_COUNT.YPP": vote_count.YPP,
            "WARDS.$.PUs.$[i].TOTAL_V_COUNT.APC": vote_count.APC,
            "WARDS.$.PUs.$[i].TOTAL_V_COUNT.APGA": vote_count.APGA,
            "WARDS.$.PUs.$[i].TOTAL_V_COUNT.ZLP": vote_count.ZLP,
            "WARDS.$.PUs.$[i].TOTAL_V_COUNT.LP": vote_count.LP,
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
    // initDB();
    console.log("Params or Query Data", req.query, req.params);
    const { lga, ward, unit } = req.query;

    if (lga || ward || unit) {
      console.log("Query", lga, ward, unit);
      const votes = await Votes.findOne({
        LGA: lga,
        "WARDS.WARD": ward,
        "WARDS.PUs.UNIT": unit,
      });
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
      const votes = await Votes.find({});
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

    // res.status(200).json({
    //   error: false,
    //   message: "DB Populated successfully",
    //   data: null,
    // });
  });
