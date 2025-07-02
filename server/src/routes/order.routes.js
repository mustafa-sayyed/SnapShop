import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getAllOrders,
  getUserOrders,
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  updateStatus,
} from "../controllers/order.controller.js";

const router = express.Router();

// User Routes
router.post("/", authenticate(), placeOrder);
router.get("/myorders", authenticate(), getUserOrders);

// Payment Routes
router.post("/webhook/stripe", placeOrderStripe);
router.post("/webhook/razorpay", placeOrderRazorpay);

// Admin Routes
router.get("/", authenticate(["admin"]), getAllOrders);
router.patch("/:id/status", authenticate(["admin"]), updateStatus);



export default router;
