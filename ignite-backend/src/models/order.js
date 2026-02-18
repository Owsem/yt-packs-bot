import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    theme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theme",
      required: true,
    },
    status: {
      type: String,
      default: "completed",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

