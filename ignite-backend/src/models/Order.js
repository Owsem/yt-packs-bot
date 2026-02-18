import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    theme: { type: mongoose.Schema.Types.ObjectId, ref: "Theme", required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed"
    }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
