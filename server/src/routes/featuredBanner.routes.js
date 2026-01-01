import express from "express";
import {
  createFeaturedBanner,
  deleteFeaturedBanner,
  getAllActiveBanners,
  getAllBanners,
  toggleActiveFeaturedBanner,
} from "../controllers/featuredBanner.controller.js";
import validate from "../middlewares/validation.middleware.js";
import featuredBannerSchema from "../schema/featuredBanner.schema.js";
import upload from "../middlewares/multer.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .post(
    upload.single("bannerImage"),
    validate(featuredBannerSchema),
    authenticate(["admin"]),
    createFeaturedBanner
  );
router.route("/").get(getAllBanners);
router.route("/active").get(getAllActiveBanners);
router
  .route("/:bannerId/toggle")
  .patch(authenticate(["admin"]), toggleActiveFeaturedBanner);
router.route("/:bannerId").delete(authenticate(["admin"]), deleteFeaturedBanner);

export default router;
