import express from "express";
import { emailCampaignLimiter } from "../middlewares/rateLimit/email.limiter.js";
import validate from "../middlewares/validation.middleware.js";
import { emailSchema } from "../schema/email.schema.js";
import { deleteEmailById, getAllEmails, sendEmail } from "../controllers/email.controller.js";

const router = express.Router();

router.route("/").get(getAllEmails);
router.route("/:emailId").delete(deleteEmailById);
router.route("/campaign").post(emailCampaignLimiter, validate(emailSchema), sendEmail);

export default router;
