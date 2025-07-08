import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { addAddress } from "../controllers/address.controller.js";

const router = express.Router();

router.post("/", authenticate(), addAddress);

export default router;
