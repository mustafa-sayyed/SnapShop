import { v2 as cloudinary } from "cloudinary";
import { Product } from "../models/product.model.js";
import { Orders } from "../models/order.model.js";

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
      }),
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
      }),
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
    const limit = Number(req.query.limit) || 50;
    const search = req.query.search || "";
    const filter = search ? { name: { $regex: search, $options: "i" } } : {};
    const totalProducts = await Product.countDocuments(filter);

    if (page < 0) {
      return res.status(400).json({
        success: false,
        message: "Page number must be greater than or equal to 0",
      });
    }

    const products = await Product.find(filter)
      .lean()
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      products,
      page,
      limit,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit) - 1,
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

const getBestSellerProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 10;
    const totalBestSellerProducts = await Product.countDocuments({ bestSeller: true });

    const products = await Product.find({ bestSeller: true })
      .lean()
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
      totalBestSellerProducts,
      limit,
      page,
      totalPages: Math.ceil(totalBestSellerProducts / limit) - 1,
    });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res.status(500).json({ message: `Internal Server error`, errorStack });
  }
};

const getLatestProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 10;
    const totalProducts = await Product.countDocuments();

    const products = await Product.find()
      .lean()
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
      totalProducts,
      limit,
      page,
      totalPages: Math.ceil(totalProducts / limit) - 1,
    });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res.status(500).json({ message: `Internal Server error`, errorStack });
  }
};

const addRating = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, orderId, rating, review } = req.body;

    const order = await Orders.findOne({
      _id: orderId,
      userId: userId,
      status: "delivered",
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found or not delivered yet",
      });
    }

    const productInOrder = order.items.find((item) => item._id.toString() === productId);

    if (!productInOrder) {
      return res.status(400).json({
        success: false,
        message: "Product not found in this order",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingRating = product.ratings.find(
      (r) => r.userId === userId && r.orderId === orderId,
    );

    if (existingRating) {
      existingRating.rating = rating;
      existingRating.review = review || "";
      existingRating.createdAt = new Date();
    } else {
      product.ratings.push({
        userId,
        orderId,
        userName: req.user.name,
        rating,
        review: review || "",
      });
    }

    const totalRatings = product.ratings.length;
    const sumRatings = product.ratings.reduce((sum, r) => sum + r.rating, 0);
    product.averageRating = totalRatings > 0 ? (sumRatings / totalRatings).toFixed(1) : 0;
    product.totalRatings = totalRatings;

    await product.save();

    res.status(200).json({
      success: true,
      message:
        existingRating ? "Rating updated successfully" : "Rating added successfully",
      averageRating: product.averageRating,
      totalRatings: product.totalRatings,
    });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      errorStack,
    });
  }
};

const getProductRatings = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 10;

    const product = await Product.findById(productId).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const ratings = product.ratings
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(page * limit, (page + 1) * limit);

    res.status(200).json({
      success: true,
      ratings,
      averageRating: product.averageRating,
      totalRatings: product.totalRatings,
      page,
      limit,
      totalPages: Math.ceil(product.ratings.length / limit),
    });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res.status(500).json({
      success: false,
      message: "Internal Server error",
      errorStack,
    });
  }
};

export {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  getBestSellerProducts,
  getLatestProducts,
  addRating,
  getProductRatings,
};
