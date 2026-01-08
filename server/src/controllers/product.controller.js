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
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res.status(500).json({ message: `Internal Server error`, errorStack });
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
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res.status(500).json({ message: `Internal Server error`, errorStack });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const filter = search ? { name: { $regex: search, $options: "i" } } : {};
    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .lean()
      .skip(page * limit)
      .limit(limit);

    return res.status(200).json({
      success: true,
      products,
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
    });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res.status(500).json({ message: `Internal Server error`, errorStack });
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
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res.status(500).json({ message: `Internal Server error`, errorStack });
  }
};

export { createProduct, deleteProduct, getAllProducts, getProduct };
