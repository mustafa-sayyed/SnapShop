import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
} from "../controllers/product.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(getAllProducts)
  .post(
    authenticate(["admin"]),
    upload.fields([
      { name: "image1", maxCount: 1 },
      { name: "image2", maxCount: 1 },
      { name: "image3", maxCount: 1 },
      { name: "image4", maxCount: 1 },
    ]),
    createProduct
  );

router
  .route("/:id")
  .get(getProduct)
  .delete(authenticate(["admin"]), deleteProduct);


  
export default router;
