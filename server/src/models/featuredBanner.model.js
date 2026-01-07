import mongoose from "mongoose";

const featuredBannerSchema = new mongoose.Schema(
  {
    bannerImage: {
      type: String,
      required: true,
    },
    bannerTitle: {
      type: String,
      required: false,
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
