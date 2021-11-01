import handler from "../../lib/handler";
import Votes from "../../models/Votes";

export default handler.put(async (req, res) => {
  try {
    const { unit, img, lat, lng } = req.body;

    //Update the unit vote count with data received from client
    const votes = await Votes.updateOne(
      {
        "WARDS.PUs.UNIT": unit,
      },
      {
        $push: {
          "WARDS.$.PUs.$[i].RESULT_IMG": { url: img, lat: lat, lng: lng },
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
        message: "Result image saved successfully",
        data: null,
      });
      return;
    }
    res.status(200).json({
      error: true,
      message: "Something went wrong trying to save result report",
      data: null,
    });
  } catch (e) {
    console.log(e);
    throw new Error(e.message || e.toString());
  }
});
