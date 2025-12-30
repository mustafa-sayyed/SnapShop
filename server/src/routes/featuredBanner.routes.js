import express from "express";
import {
  createFeaturedBanner,
  deleteFeaturedBanner,
  getAllBanners,
  toggleActiveFeaturedBanner,
} from "../controllers/featuredBanner.controller.js";
import validate from "../middlewares/validation.middleware.js";
import featuredBannerSchema from "../schema/featuredBanner.schema.js";
import upload from "../middlewares/multer.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(
    upload.single("bannerImage"),
    validate(featuredBannerSchema),
    createFeaturedBanner
  );
router.route("/").get(getAllBanners);
router.route("/:bannerId/toggle").patch(toggleActiveFeaturedBanner);
router.route("/:bannerId").delete(deleteFeaturedBanner);

export default router;
