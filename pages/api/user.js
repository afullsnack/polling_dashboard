import User from "../../models/User";

export default async (req, res) => {
  switch (req.method) {
    case "POST":
      try {
        const { name, email, phone } = req.body;

        const newUser = User({
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
        res.sendStatus(405).json({
          error: true,
          message: "An error occurred trying to save user",
          data: e.message || e.toString(),
        });
      }
      break;
    case "GET":
      // get all the users for the dashboard
      try {
        const { email } = req.query;
        console.log("Email", email);
        const users = email
          ? await User.findOne({ email })
          : await User.find({});

        res.json({
          error: users ? false : true,
          message: users
            ? "Found users"
            : "No users found, something went wrong",
          data: users || null,
        });
      } catch (e) {
        console.log(e);
        res.json({
          error: true,
          message: "An error occurred trying to get users",
          data: e.message || e.toString(),
        });
      }
      break;
    default:
      res.json({
        error: true,
        message: `Method ${req.method} not allowed`,
        data: null,
      });
      break;
  }
};
