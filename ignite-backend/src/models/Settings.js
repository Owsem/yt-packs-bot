import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    socialMedia: {
      tiktok: { type: String, default: "" },
      telegram: { type: String, default: "" },
      pinterest: { type: String, default: "" },
      reddit: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);
