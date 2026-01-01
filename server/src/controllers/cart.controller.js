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
    const cartData = req.user.cartData;

    cartData[productId][size] = quantity;

    await User.findByIdAndUpdate(userId, { cartData });

    res.status(200).json({ success: true, message: "Updates the Cart" });
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

    const user = req.user;

    if (Object.entries(user.cartData)) {
      res.status(200).json({ success: true, cartData: user.cartData });
    } else {
      res.status(404).json({ success: true, message: "Your Cart is Empty" });
    }
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", errorStack });
  }
};

export { addToCart, getCart, updateCart };
