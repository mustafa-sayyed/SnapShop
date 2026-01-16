import express from "express";
import { sendEmailLimiter } from "../middlewares/rateLimit/emails.limiter";
import validate from "../middlewares/validation.middleware";
import { emailSchema } from "../schema/emails.schema";
import { deleteEmailById, getAllEmails, sendEmail } from "../controllers/emails.controller";

const router = express.Router();

router.route("/").get(getAllEmails);
router.route("/:emailId").delete(deleteEmailById);
router.route("/send").post(sendEmailLimiter, validate(emailSchema), sendEmail);

export default router;
