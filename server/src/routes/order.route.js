import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getAllOrders,
  getUserOrders,
  placeOrder,
  placeOrderRazorpay,
  updateStatus,
  verifyOrderStatus,
  verifyRazorpay,
} from "../controllers/order.controller.js";

const router = express.Router();

// User Routes
router.post("/", authenticate(), placeOrder);
router.get("/myorders", authenticate(), getUserOrders);
router.post("/razorpay", authenticate(), placeOrderRazorpay)
router.post("/razorpay/verify", authenticate(), verifyRazorpay)
router.get("/verify/:orderId", authenticate(), verifyOrderStatus);


// Admin Routes
router.get("/", authenticate(["admin"]), getAllOrders);
router.patch("/:id/status", authenticate(["admin"]), updateStatus);



export default router;
