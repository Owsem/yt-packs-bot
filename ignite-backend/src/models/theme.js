import mongoose from "mongoose";

const themeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    files: [
      {
        type: String, // URLs to your hosted assets
      }
    ],
    category: {
      type: String,
      default: "general",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Theme", themeSchema);

