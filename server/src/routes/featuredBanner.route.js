import express from "express";
import {
  createFeaturedBanner,
  deleteFeaturedBanner,
  getAllActiveBanners,
  getAllBanners,
  toggleFeaturedBanner,
} from "../controllers/featuredBanner.controller.js";
import validate from "../middlewares/validation.middleware.js";
import featuredBannerSchema from "../schema/featuredBanner.schema.js";
import upload from "../middlewares/multer.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import demoGuard from "../middlewares/demoGuard.middleware.js";
import {
  addFeaturedBannerLimiter,
  deleteFeaturedBannerLimiter,
  toggleFeaturedBannerLimiter,
} from "../middlewares/rateLimit/featuredBanner.limiter.js";

const router = express.Router();

router
  .route("/")
  .post(
    addFeaturedBannerLimiter,
    upload.single("bannerImage"),
    validate(featuredBannerSchema),
    authenticate(["admin", "demo_admin"]),
    demoGuard,
    createFeaturedBanner
  );
  
router.route("/").get(getAllBanners);
router.route("/active").get(getAllActiveBanners);

router
  .route("/:bannerId/toggle")
  .patch(toggleFeaturedBannerLimiter, authenticate(["admin", "demo_admin"]), demoGuard, toggleFeaturedBanner);

router
  .route("/:bannerId")
  .delete(deleteFeaturedBannerLimiter, authenticate(["admin", "demo_admin"]), demoGuard, deleteFeaturedBanner);

  
export default router;
