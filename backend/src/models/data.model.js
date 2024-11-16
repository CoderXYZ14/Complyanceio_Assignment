import mongoose, { Schema } from "mongoose";

const dataSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
      createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
  },
  { timestamps: true }
);

export const Data = mongoose.model("Data", dataSchema);
