import mongoose from "mongoose";

const themeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    price: { type: Number, required: true },
    fileUrl: { type: String, required: true }, // where the pack is hosted
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Theme = mongoose.model("Theme", themeSchema);
export default Theme;
