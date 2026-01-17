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

const router = express.Router();

router.route("/").get(authenticate(["admin"]), getAllEmails);
router.route("/:emailId").delete(authenticate(["admin"]), deleteEmailById);
router
  .route("/campaign")
  .post(emailCampaignLimiter, authenticate(["admin"]), validate(emailSchema), sendEmail);

export default router;
