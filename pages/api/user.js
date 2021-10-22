import handler from "../../lib/handler";
import User from "../../models/User";

export default handler
  .post(async (req, res) => {
    try {
      const { name, email, phone } = req.body;

      const newUser = new User({
        name,
        email,
        phone,
      });

      await newUser.save();
      res.status(201).json({
        error: false,
        message: "Created successfully",
        data: newUser,
      });
    } catch (e) {
      console.log(e);
      throw new Error(e.message || e.toString());
    }
  })
  .get(async (req, res) => {
    // get all the users for the dashboard
    User.find({}, (err, found) => {
      console.log("Users", err || found);
      res.json({
        error: found ? false : true,
        message: found ? "Found users" : "No users found, something went wrong",
        data: found || err,
      });
    });
  });
