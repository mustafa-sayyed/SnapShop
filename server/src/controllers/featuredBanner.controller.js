import { featuredBanner } from "../models/featuredBanner.model.js";
import { v2 as cloudinary } from "cloudinary";

const createFeaturedBanner = async (req, res, next) => {
  try {
    const { bannerTitle, isActive } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Banner image is required" });
    }

    const uploadResult = await cloudinary.uploader.upload(req.file.path);

    const banner = await featuredBanner.create({
      bannerImage: uploadResult.secure_url,
      bannerTitle,
      isActive,
    });

    res
      .status(201)
      .json({ success: true, message: "Featured banner creaated succefully", banner });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res.status(500).json({
      success: false,
      message: `Internal Server error`,
      errorStack,
    });
  }
};

const toggleFeaturedBanner = async (req, res, next) => {
  try {
    const _id = req.params.bannerId;
    const banner = await featuredBanner.findById(_id);
    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.status(200).json({
      success: true,
      message: `Banner ${banner.isActive ? "activated" : "deactivated"} successfully`,
      banner,
    });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res.status(500).json({
      success: false,
      message: `Internal Server error`,
      errorStack,
    });
  }
};

const deleteFeaturedBanner = async (req, res, next) => {
  try {
    const _id = req.params.bannerId;

    const banner = await featuredBanner.findByIdAndDelete(_id);

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    res.status(200).json({ success: true, message: "Banner deleted successfully" });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res.status(500).json({
      success: false,
      message: `Internal Server error`,
      errorStack,
    });
  }
};

const getAllBanners = async (req, res, next) => {
  try {
    // Use - if there is large no. of Banners
    // const page = Number(req.query.page) || 0;
    // const limit = Number(req.query.limit) || 5;
    // console.log(await featuredBanner.countDocuments());
    // const totalPages = Math.floor((await featuredBanner.countDocuments()) / limit);

    // if (page < 0 || page > totalPages) {
    //   res.status(200).json({
    //     success: false,
    //     message: `Banners not Found, pages must be within 0 or ${totalPages}`,
    //   });
    // }

    const banners = await featuredBanner.find({});

    res.status(200).json({
      success: true,
      message: "Banners fetched",
      banners,
    });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res.status(500).json({
      success: false,
      message: `Internal Server error`,
      errorStack,
    });
  }
};

const getAllActiveBanners = async (req, res, next) => {
  try {
    const activeBanners = await featuredBanner.find({ isActive: true });

    res.status(200).json({ success: true, banners: activeBanners });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res.status(500).json({
      success: false,
      message: `Internal Server error`,
      errorStack,
    });
  }
};

export {
  createFeaturedBanner,
  toggleFeaturedBanner,
  deleteFeaturedBanner,
  getAllBanners,
  getAllActiveBanners
};
