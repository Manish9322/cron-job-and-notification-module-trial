import mongoose from "mongoose";

const randomStringSchema = new mongoose.Schema(
  {
    value: {
      type: String,
      required: true,
      trim: true,
    },
    source: {
      type: String,
      enum: ["cron", "manual"],
      default: "cron",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const RandomString =
  mongoose.models.RandomString ||
  mongoose.model("RandomString", randomStringSchema);

export default RandomString;
