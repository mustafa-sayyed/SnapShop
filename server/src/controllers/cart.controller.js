import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;
    const userId = req.user._id;
    const cartData = req.user.cartData;

    if (cartData[productId]) {
      if (cartData[productId][size]) {
        cartData[productId][size] += quantity;
      } else {
        cartData[productId][size] = quantity;
      }
    } else {
      cartData[productId] = {};
      cartData[productId][size] = quantity;
    }

    await User.findByIdAndUpdate(userId, { cartData });

    res.status(200).json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", errorStack });
  }
};

const updateCart = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;

    const userId = req.user._id;
    const cartData = req.user.cartData || {};

    // Initialize product entry if it doesn't exist
    if (!cartData[productId]) {
      cartData[productId] = {};
    }

    if (quantity <= 0) {
      // Delete the size entry when quantity is 0 or less
      delete cartData[productId][size];
      
      // If no sizes left for this product, delete the product entry
      if (Object.keys(cartData[productId]).length === 0) {
        delete cartData[productId];
      }
    } else {
      cartData[productId][size] = quantity;
    }

    await User.findByIdAndUpdate(userId, { cartData });

    res.status(200).json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", errorStack });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("cartData").lean();
    
    if (!user.cartData || Object.keys(user.cartData).length === 0) {
      return res.status(200).json({ success: true, cartData: [] });
    }

    const cartData = [];
    
    for (const [productId, sizes] of Object.entries(user.cartData)) {
      const product = await Product.findById(productId).lean();
      if (product) {
        // Loop through ALL sizes for this product
        for (const size in sizes) {
          if (sizes[size] > 0) {
            cartData.push({
              ...product,
              size,
              quantity: sizes[size],
            });
          }
        }
      }
    }

    res.status(200).json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", errorStack });
  }
};

export { addToCart, getCart, updateCart };
