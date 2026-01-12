import crypto from "node:crypto";
import { sendSubscribeEmail } from "../emails/subscriber.email.js";
import { Subscriber } from "../models/subscribe.model.js";

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await Subscriber.findOne({ email });

    if (subscriber && subscriber.status === "unsubscribed") {
      return res.status(200).json({
        success: true,
        message: "Subscription activated successfully",
      });
    }

    if (subscriber) {
      return res
        .status(200)
        .json({ success: true, message: "Already subscribed to email" });
    }

    const unsubscribeToken = crypto.randomUUID();

    await Subscriber.create({
      email,
      status: "active",
      subscribedAt: new Date(),
      unsubscribeToken,
    });

    await sendSubscribeEmail(email, unsubscribeToken);

    res.status(201).json({ success: true, message: "Subscribed to email successfully" });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", errorStack });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const unsubscribeToken = req.params.unsubscribeToken;

    const subscriber = await Subscriber.findOne({ unsubscribeToken, status: "active" });

    if (!subscriber) {
      return res
        .status(400)
        .json({ success: false, message: "You aren't subscribed to our Email" });
    }

    subscriber.unsubscribedAt = new Date();
    subscriber.status = "unsubscribed";
    await subscriber.save();

    res.status(200).json({ success: true, message: "Unsubscribed successfully" });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", errorStack });
  }
};

const getAllSubscribers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";
    const filter = search ? { email: { $regex: search, $options: "i" } } : {};
    const totalSubscribers = await Subscriber.countDocuments(filter);
    const totalPages = Math.ceil(totalSubscribers / limit);

    const subscribers = await Subscriber.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ subscribedAt: -1 });

    res
      .status(200)
      .json({ success: true, subscribers, totalPages, limit, page, totalSubscribers });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", errorStack });
  }
};

const deleteSubscriber = async (req, res) => {
  try {
    const subscriberId = req.params.subscriberId;

    const deletedSubscriber = await Subscriber.findOneAndDelete({ _id: subscriberId });

    if (!deletedSubscriber) {
      return res.status(404).json({ success: false, message: "Subscriber not found" });
    }

    res.status(200).json({ success: true, message: "Subscriber deleted successfully" });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV === "development" ? error : undefined;
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", errorStack });
  }
};

export { subscribe, unsubscribe, getAllSubscribers, deleteSubscriber };
