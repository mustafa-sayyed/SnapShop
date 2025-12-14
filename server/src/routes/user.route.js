import { Router } from "express";
import {
  loginUser,
  signupUser,
  loginAdmin,
  getCurrentUser,
} from "../controllers/user.controller.js";
import {authenticate} from "../middlewares/auth.middleware.js"

const router = Router();

router.route("/").get(authenticate(), getCurrentUser);
router.route("/signin").post(loginUser);
router.route("/signup").post(signupUser);
router.route("/admin/signin").post(loginAdmin);

export default router;
