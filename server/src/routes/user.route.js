import { Router } from "express";
import {
  loginUser,
  signupUser,
  loginAdmin,
  getCurrentUser,
  getAllUsers,
  deleteuser,
  handleGoogleLogin,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import { loginSchema, signupSchema, token } from "../schema/auth.schema.js";
import {
  googleLoginLimiter,
  loginLimiter,
  signupLimiter,
} from "../middlewares/rateLimit/auth.limiter.js";



const router = Router();

router.route("/").get(authenticate(), getCurrentUser);
router.route("/signin").post(validate(loginSchema), loginLimiter, loginUser);
router.route("/signup").post(validate(signupSchema), signupLimiter, signupUser);
router.route("/google").post(validate(token), googleLoginLimiter, handleGoogleLogin);
router.route("/admin/signin").post(validate(loginSchema), loginAdmin);
router.route("/all").get(authenticate(["admin"]), getAllUsers);
router
  .route("/:userId/admin")
  .delete(authenticate(["admin"]), deleteUserLimiter, deleteuser);

export default router;
