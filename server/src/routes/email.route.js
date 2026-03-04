import express from "express";
import { emailCampaignLimiter } from "../middlewares/rateLimit/email.limiter.js";
import validate from "../middlewares/validation.middleware.js";
import { emailSchema } from "../schema/email.schema.js";
import {
  deleteEmailById,
  getAllEmails,
  sendEmail,
} from "../controllers/email.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import demoGuard from "../middlewares/demoGuard.middleware.js";

const router = express.Router();

router.route("/").get(authenticate(["admin", "demo_admin"]), getAllEmails);
router.route("/:emailId").delete(authenticate(["admin", "demo_admin"]), demoGuard, deleteEmailById);
router
  .route("/campaign")
  .post(emailCampaignLimiter, authenticate(["admin", "demo_admin"]), demoGuard, validate(emailSchema), sendEmail);

export default router;
