import mongoose from "mongoose";

const featuredBannerSchema = new mongoose.Schema(
  {
    bannerImage: {
      type: String,
      required: true,
    },
    bannerTitle: {
      type: String,
      required: true,
    },
    bannerLink: {
      type: String,
      required: true,
      default: "",
    },
    isActive: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export const featuredBanner = mongoose.model("featuedBanner", featuredBannerSchema);
