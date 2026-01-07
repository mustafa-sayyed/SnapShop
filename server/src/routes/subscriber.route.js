import { Router } from "express";
import {
  deleteSubscriber,
  getAllSubscribers,
  subscribe,
  unsubscribe,
} from "../controllers/subscriber.controller.js";
import validate from "../middlewares/validation.middleware.js";
import subscriberSchema from "../schema/subscriber.schema.js";

const router = Router();

router
  .route("/")
  .get(getAllSubscribers)
  .post(validate(subscriberSchema), subscribe)
  .patch(validate(subscriberSchema), unsubscribe)
  .delete(validate(subscriberSchema), deleteSubscriber);

export default router;
