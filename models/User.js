import mongoose from "mongoose";
import { connectDB } from "../lib/db";
let User;
try {
  connectDB();
  const UserSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Please add first name"] },
    phone: {
      type: String,
      required: [true, "Please add a valid phone number"],
    },
    email: {
      type: String,
      required: [true, "Please add a valid email account"],
    },
  });
  User = mongoose.models.User || mongoose.model("User", UserSchema);
} catch (err) {
  console.log(err.message || err.toString());
}

export default User;
