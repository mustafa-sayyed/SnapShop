import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getBestSellerProducts,
  getLatestProducts,
  getProduct,
  addRating,
  getProductRatings,
} from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import demoGuard from "../middlewares/demoGuard.middleware.js";
import {
  addProductLimiter,
  deleteProductLimiter,
} from "../middlewares/rateLimit/product.limiter.js";
import validate from "../middlewares/validation.middleware.js";
import { addRatingSchema } from "../schema/rating.schema.js";

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    addProductLimiter,
    authenticate(["admin", "demo_admin"]),
    demoGuard,
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
  .delete(deleteProductLimiter, authenticate(["admin", "demo_admin"]), demoGuard, deleteProduct);


// Products Ratings Routes  
router.route("/rating").post(validate(addRatingSchema), authenticate(["user", "admin"]), addRating);
router.route("/:productId/ratings").get(getProductRatings);



export default router;
