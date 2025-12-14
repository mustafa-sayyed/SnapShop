import { v2 as cloudinary } from "cloudinary";
import { Product } from "../models/product.model.js";

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestSeller } =
      req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    let imagesUrl = await Promise.all(
      images.map(async (img) => {
        const result = await cloudinary.uploader.upload(img.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    ).catch((err) => {
      console.log(err);
      return null;
    });

    if (!imagesUrl) {
      return res.status(500).json({ message: "Error occured while adding Product" });
    }

    await Product.create({
      name,
      description,
      price: Number(price),
      image: imagesUrl,
      category,
      subCategory,
      sizes: JSON.parse(sizes),
      bestSeller: bestSeller === "true" ? true : false,
    });

    res.status(201).json({ success: true, message: "Product added successfully" });
  } catch (error) {
    res.status(500).json({ message: `Internal Server error: ${error.message}` });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findById({ _id: id });

    if (!product) {
      return res.status(400).json({ success: false, message: "Product not found" });
    }

    const result = await Promise.allSettled(
      product.image.map(async (imgUrl) => {
        const publicId = imgUrl.split("/").at(-1).split(".").at(0);
        console.log(imgUrl, publicId);
        const deleted = await cloudinary.uploader.destroy(publicId, {
          resource_type: "image",
        });
        console.log(deleted);
      })
    ).catch((err) => {
      console.error(err);
      return null;
    });

    if (!result) {
      return res.status(500).json({ message: "Error occured while deleting Product" });
    }

    await Product.findByIdAndDelete({ _id: id });

    res.status(200).json({ success: true, product, message: "Product deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Internal Server error: ${error.message}` });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();
    return res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ message: `Internal Server error: ${error.message}` });
  }
};

const getProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const product = await Product.findOne({ _id: id });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: `Internal Server error: ${error.message}` });
  }
};

export { createProduct, deleteProduct, getAllProducts, getProduct };
