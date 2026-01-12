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

const router = Router();

router
  .route("/")
  .get(getAllSubscribers)
  .post(validate(subscriberSchema), subscribeLimiter, subscribe);

router.route("/unsubscribe/:unsubscribeToken").patch(unsubscribeLimiter, unsubscribe);

router.route("/:subscriberId").delete(deleteSubscriberLimiter, deleteSubscriber);

export default router;
