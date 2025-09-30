import mongoose from "mongoose";

const SiteSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    phone: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Site || mongoose.model("Site", SiteSchema);
