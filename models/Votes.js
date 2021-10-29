import mongoose from "mongoose";
import { connectDB } from "../lib/db";
import { toJSONPlugin, toObjectPlugin, updatedOnHook } from "./plugins";

const { Schema } = mongoose;

connectDB();
const voteSchema = new Schema(
  {
    LGA: { type: String, default: "", required: true },
    WARDS: [
      {
        _id: false,
        WARD: { type: String, default: "", required: true },
        PUs: [
          {
            _id: false,
            UNIT: { type: String, default: "", required: true },
            TOTAL_V_COUNT: {
              PDP: { type: Number, default: 0, required: true },
              YPP: { type: Number, default: 0, required: true },
              APC: { type: Number, default: 0, required: true },
              APGA: { type: Number, default: 0, required: true },
              ZLP: { type: Number, default: 0, required: true },
              LP: { type: Number, default: 0, required: true },
            },
          },
        ],
      },
    ],
  },
  { toObject: toObjectPlugin }
);

toJSONPlugin(voteSchema);
updatedOnHook(voteSchema);

export default mongoose.models.Vote || mongoose.model("Vote", voteSchema);
