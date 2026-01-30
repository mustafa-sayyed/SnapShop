import crypto from "crypto";
import { handleRazorpayEvents } from "../utils/handleRazorpayEvents.js";

const razorpayWebhookController = async (req, res) => {
  try {

    const signature = req.headers["x-razorpay-signature"];
    const body = JSON.stringify(req.body);

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).send("Invalid signature");
    }

    const event = req.body;
    handleRazorpayEvents(event);
    
    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res.status(500).json({
      message: "Internal Server Error",
      errorStack,
    });
  }
};

export { razorpayWebhookController };
