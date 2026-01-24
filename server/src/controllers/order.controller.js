import mongoose from "mongoose";
import { Orders } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import razorpay from "razorpay";
import { sendOrderPlaceEmail } from "../emails/orderPlace.email.js";

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
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

    const emailData = {
      email: req.user.email,
      name: req.user.name,
      orderDetails: {
        name: items.map((item) => item.name).join(", "),
        price: amount,
        quantity: items.reduce((total, item) => total + item.quantity, 0),
      },
    };

    await sendOrderPlaceEmail(emailData);

    res.status(200).json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: `Server Error: ${error.message}` });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 0;
    const limit = Number(req.query.limit) || 10;
    const totalOrders = await Orders.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);

    if (page < 0) {
      return res.status(400).json({
        success: false,
        message: "Page number must be greater than or equal to 0",
      });
    }

    const orders = await Orders.find({}, {}, { populate: "address" })
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders, totalPages, limit, page, totalOrders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: `Internal Server Error` });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const id = req.user._id;
    const orders = await Orders.find({ userId: id }).lean();
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: `Internal Server Error` });
  }
};

const updateStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;
    const order = await Orders.findByIdAndUpdate(orderId, { status });
    res.status(200).json({ success: true, message: "Status updates successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: `Internal Server Error` });
  }
};

const placeOrderRazorpay = async (req, res) => {
  try {
    const userId = req.user._id;
    const { address, items, amount } = req.body;

    const newOrder = await Orders.create({
      userId,
      items,
      totalPrice: amount,
      address,
      payment: false,
      paymentMethod: "Razorpay",
      status: "pending",
    });

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: newOrder._id,
    };

    razorpayInstance.orders.create(options, (error, order) => {
      if (error) {
        return res.status(401).json({ success: false, message: error });
      }

      console.log(`Razorpay Order: `, order, error);
      

      res.status(200).json({ success: true, order });
    });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res
      .status(500)
      .json({ success: false, message: "Internal server error", errorStack });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const userId = req.user._id;
    const { razorpay_order_id } = req.body;

    const payment = await razorpayInstance.orders.fetch(razorpay_order_id);

    console.log(`Razorpat Payment Verification: ${payment}`);
    

    if (payment.status === "paid") {
      await Orders.findByIdAndUpdate(payment.receipt, { payment: true });
      await User.findByIdAndUpdate(userId, { cartData: {} });
      return res.status(200).json({ success: true, message: "Payment Successfull" });
    } else {
      await Orders.findByIdAndUpdate(payment.receipt, { status: "failed" });
      await User.findByIdAndUpdate(userId, { cartData: {} });
      return res.status(400).json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res.status(500).json({ success: false, message: "Internal Server Error", errorStack });
  }
};

export {
  placeOrder,
  placeOrderRazorpay,
  updateStatus,
  getUserOrders,
  getAllOrders,
  verifyRazorpay,
};
