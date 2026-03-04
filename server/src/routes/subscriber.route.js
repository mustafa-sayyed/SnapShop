import { Router } from "express";
import {
  deleteSubscriber,
  getAllSubscribers,
  subscribe,
  unsubscribe,
} from "../controllers/subscriber.controller.js";
import validate from "../middlewares/validation.middleware.js";
import subscriberSchema from "../schema/subscriber.schema.js";
import {
  deleteSubscriberLimiter,
  subscribeLimiter,
  unsubscribeLimiter,
} from "../middlewares/rateLimit/subscribe.limiter.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import demoGuard from "../middlewares/demoGuard.middleware.js";

const router = Router();

router
  .route("/")
  .get(getAllSubscribers)
  .post(subscribeLimiter, validate(subscriberSchema), subscribe);

router.route("/unsubscribe/:unsubscribeToken").patch(unsubscribeLimiter, unsubscribe);

router.route("/:subscriberId").delete(deleteSubscriberLimiter, authenticate(["admin", "demo_admin"]), demoGuard, deleteSubscriber);

export default router;
