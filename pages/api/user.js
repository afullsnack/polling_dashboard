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
    await User.find({}, (err, found) => {
      if (err) {
        throw new Error(err.message || err.toString());
      }
      console.log("Users", found);
      res.json({
        error: false,
        message: "Found users",
        data: found,
      });
    });
  });
