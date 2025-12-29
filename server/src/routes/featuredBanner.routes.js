import express from "express";
import {
  createFeaturedBanner,
  deleteFeaturedBanner,
  toggleActiveFeaturedBanner,
} from "../controllers/featuredBanner.controller";
import validate from "../middlewares/validation.middleware";
import featuredBannerSchema from "../schema/featuredBanner.schema";

const router = express.Router();

router.route("/").post(validate(featuredBannerSchema), createFeaturedBanner);
router.route("/toggle").patch(toggleActiveFeaturedBanner);
router.route("/").delete(deleteFeaturedBanner);

export default router;
