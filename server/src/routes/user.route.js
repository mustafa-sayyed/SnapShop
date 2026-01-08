import { Router } from "express";
import {
  loginUser,
  signupUser,
  loginAdmin,
  getCurrentUser,
  getAllUsers,
  deleteuser,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validation.middleware.js";
import { loginSchema, signupSchema } from "../schema/auth.schema.js";

const router = Router();

router.route("/").get(authenticate(), getCurrentUser);
router.route("/signin").post(validate(loginSchema), loginUser);
router.route("/signup").post(validate(signupSchema), signupUser);
router.route("/admin/signin").post(validate(loginSchema), loginAdmin);
router.route("/all").get(authenticate(["admin"]), getAllUsers);
router.route("/:userId/admin").delete(authenticate(["admin"]), deleteuser)


export default router;
