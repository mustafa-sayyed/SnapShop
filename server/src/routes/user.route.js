import { Router } from "express";
import {
  loginUser,
  signupUser,
  loginAdmin,
  getCurrentUser,
  getAllUsers,
  deleteUser,
  handleGoogleLogin,
  forgotPassword,
  validateResetToken,
  resetPassword,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import {
  forgotPasswordSchema,
  googleLoginSchema,
  loginSchema,
  resetPasswordSchema,
  resetTokenSchema,
  signupSchema,
} from "../schema/auth.schema.js";
import {
  deleteUserLimiter,
  forgotPasswordLimiter,
  googleLoginLimiter,
  loginLimiter,
  resetPasswordLimiter,
  signupLimiter,
} from "../middlewares/rateLimit/auth.limiter.js";

const router = Router();

// User Auth Routes
router.route("/").get(authenticate(), getCurrentUser);
router.route("/signin").post(loginLimiter, validate(loginSchema), loginUser);
router.route("/signup").post(signupLimiter, validate(signupSchema), signupUser);
router.route("/google").post(googleLoginLimiter, validate(googleLoginSchema), handleGoogleLogin);

// Password Reset Routes
router
  .route("/forgot-password")
  .post(forgotPasswordLimiter, validate(forgotPasswordSchema), forgotPassword);
router.route("/validate-reset-token").post(validate(resetTokenSchema), validateResetToken);
router
  .route("/reset-password")
  .post(resetPasswordLimiter, validate(resetPasswordSchema), resetPassword);

// Admin Auth Routes
router.route("/admin/signin").post(validate(loginSchema), loginAdmin);
router.route("/all").get(authenticate(["admin"]), getAllUsers);
router
  .route("/:userId/admin")
  .delete(deleteUserLimiter, authenticate(["admin"]), deleteUser);

export default router;
