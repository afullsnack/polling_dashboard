import handler from "../../lib/handler";
import initDB from "../../lib/initDB";
import Votes from "../../models/Votes";

export default handler
  .put(async (req, res) => {
    try {
      const { report, unit } = req.body;

      //Update the unit vote count with data received from client
      console.log(report, unit);
      const votes = await Votes.updateOne(
        {
          "WARDS.PUs.UNIT": unit,
        },
        {
          $set: {
            "WARDS.$.PUs.$[i].REPORT": report,
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
      console.log(votes);
      if (votes.acknowledged && votes.modifiedCount >= 1) {
        res.status(200).json({
          error: false,
          message: "Incident report updated successfully",
          data: null,
        });
        return;
      }
      res.status(200).json({
        error: true,
        message: "Something went wrong trying to update incident report",
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
    const { unit } = req.query;

    if (unit) {
      console.log("Unit for report", unit);
      const doc = await Votes.findOne({ "WARDS.PUs.UNIT": unit }, [
        "WARDS.PUs.REPORT",
      ]);
      console.log("Return data", doc);
      votes
        ? res.status(200).json({
            error: false,
            message: "Report found",
            data: doc,
          })
        : res.status(200).json({
            error: true,
            message: "Report not found",
            data: null,
          });
    } else {
      res.status(401).json({
        error: true,
        message: "Polling unit not provided",
        data: null,
      });
    }
  })
  .post(async (req, res) => {
    initDB();
  });
