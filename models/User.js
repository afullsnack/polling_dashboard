import mongoose from "mongoose";
import { connectDB } from "../lib/db";
import { toJSONPlugin, toObjectPlugin, updatedOnHook } from "./plugins";

const { Schema } = mongoose;
connectDB();
const userSchema = new Schema(
  {
    name: { type: String, required: [true, "Please add first name"] },
    phone: {
      type: String,
      required: [true, "Please add a valid phone number"],
    },
    email: {
      type: String,
      required: [true, "Please add a valid email account"],
    },
  },
  { toObject: toObjectPlugin }
);

toJSONPlugin(userSchema);
updatedOnHook(userSchema);

export default mongoose.models.User || mongoose.model("User", userSchema);
