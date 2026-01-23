import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getBestSellerProducts,
  getLatestProducts,
  getProduct,
} from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  addProductLimiter,
  deleteProductLimiter,
} from "../middlewares/rateLimit/product.limiter.js";

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    addProductLimiter,
    authenticate(["admin"]),
    upload.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
      { name: "image4", maxCount: 1 },
    ]),
    createProduct
  );

router.route("/best-sellers").get(getBestSellerProducts);
router.route("/latest").get(getLatestProducts);

router
  .route("/:id")
  .get(getProduct)
  .delete(deleteProductLimiter, authenticate(["admin"]), deleteProduct);



export default router;
