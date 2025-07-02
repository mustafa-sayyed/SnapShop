import { Orders } from "../models/order.model.js";
import { User } from "../models/user.model.js";

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    const order = await Orders.create({
      userId,
      items,
      address,
      payment: false,
      paymentMethod: "COD",
      totalPrice: amount,
      status: "pending",
    });

    await User.findByIdAndUpdate(userId, { cartData: {} });

    res.status(200).json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: `Server Error: ${error.message}` });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Orders.find({});
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: `Server Error: ${error.message}` });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const id = req.user.id;
    const orders = await Orders.find({ userId: id }).lean();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: `Server Error: ${error.message}` });
  }
};

const updateStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const order = await Orders.findByIdAndUpdate(orderId, { status });    
    res.status(200).json({ success: true, message: "Status updates successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: `Server Error: ${error.message}` });
  }
};

const placeOrderStripe = async (req, res) => {};

const placeOrderRazorpay = async (req, res) => {};

export {
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  updateStatus,
  getUserOrders,
  getAllOrders,
};
