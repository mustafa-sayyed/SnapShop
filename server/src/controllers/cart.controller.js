import { User } from "../models/user.model.js";

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size, quantity = 1 } = req.body;

    const user = await User.findById(userId);
    const cartData = user.cartData;

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
    res.status(403).json({ success: false, message: error.message });
    console.log(error.message);
  }
};

const updateCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, size, quantity } = req.body;

    const user = await User.findById(userId);

    const cartData = user.cartData;
    cartData[productId][size] = quantity;

    await User.findByIdAndUpdate(userId, { cartData });

    res.status(200).json({ success: true, message: "Updates the Cart" });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
    console.log(error.message);
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);

    if (Object.entries(user.cartData)) {
      res.status(200).json({ success: true, cartData: user.cartData });
    } else {
      res.status(404).json({ success: true, message: "Your Cart is Empty" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, getCart, updateCart };
