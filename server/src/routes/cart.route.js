import express from "express";
import { addToCart, getCart, updateCart } from "../controllers/cart.controller.js";
import {authenticate} from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate(), getCart);
router.post("/", authenticate(), addToCart);
router.patch("/", authenticate(), updateCart);

export default router;
