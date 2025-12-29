import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createAddress,
  deleteAddress,
  updateAddress,
} from "../controllers/address.controller.js";
import validate from "../middlewares/validation.middleware.js";
import addressSchema from "../schema/address.schema.js";
const router = express.Router();

router.post("/", authenticate(), validate(addressSchema), createAddress);
router.delete("/", authenticate(), deleteAddress);
router.patch("/", authenticate(), validate(addressSchema.partial()), updateAddress);

export default router;
