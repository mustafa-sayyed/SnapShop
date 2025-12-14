import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  createAddress,
  deleteAddress,
  updateAddress,
} from "../controllers/address.controller.js";

const router = express.Router();

router.post("/", authenticate(), createAddress);
router.delete("/", authenticate(), deleteAddress);
router.patch("/", authenticate(), updateAddress);

export default router;
