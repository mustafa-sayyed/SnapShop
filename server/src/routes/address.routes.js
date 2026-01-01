import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createAddress,
  deleteAddress,
  getAllAddress,
  updateAddress,
} from "../controllers/address.controller.js";
import validate from "../middlewares/validation.middleware.js";
import addressSchema from "../schema/address.schema.js";
const router = express.Router();

router.post("/", authenticate(), validate(addressSchema), createAddress);
router.delete("/:addressId", authenticate(), deleteAddress);
router.patch(
  "/:addressId",
  authenticate(),
  validate(addressSchema.partial()),
  updateAddress
);
router.get("/", authenticate(), getAllAddress);

export default router;
