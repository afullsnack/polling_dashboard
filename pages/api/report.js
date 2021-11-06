import handler from "../../lib/handler";
import Votes from "../../models/Votes";

export default handler
  .post(async (req, res) => {
    try {
      const { report, unit, image_data } = req.body;

      //Update the unit vote count with data received from client
      console.log(report, unit);
      const votes = await Votes.updateOne(
        {
          "WARDS.PUs.UNIT": unit,
        },
        {
          $set: {
            "WARDS.$.PUs.$[i].REPORT": report,
            "WARDS.$.PUs.$[i].REPORT_TIME": new Date.now().toString(),
            "WARDS.$.PUs.$[i].REPORT_IMG": {
              url: image_data.image,
              lat: image_data.latitude,
              lng: image_data.longitude,
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
        "WARDS.PUs.UNIT",
        "WARDS.PUs.REPORT_IMG",
        "WARDS.PUs.REPORT_TIME",
      ]);
      console.log("Return data", doc, typeof doc);
      doc
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
      res.status(200).json({
        error: true,
        message: "Polling unit not provided",
        data: null,
      });
    }
  });
