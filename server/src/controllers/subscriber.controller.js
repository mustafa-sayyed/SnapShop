import { sendSubscribeEmail } from "../emails/subscriberEmail.js";
import { Subscriber } from "../models/subscribe.model.js";

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    const isEmailExist = await Subscriber.findOne({ email });
    
    if (isEmailExist) {
      return res
      .status(200)
      .json({ success: true, message: "Already subscribed to email" });
    }
    
    await Subscriber.create({
      email,
      status: "active",
      subscribedAt: new Date(),
    });
    
    await sendSubscribeEmail(email);

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

    const { email } = req.body;

    const subscriber = await Subscriber.findOne({ email });

    if (!subscriber) {
      return res.status(400).json({ success: false, message: "You aren't subscribed" });
    }

    if (unsubscribeToken === subscriber.unsubscribeToken) {
      subscriber.unsubscribedAt = new Date();
      subscriber.status = "unsubscribed";
      subscriber.save();

      return res
        .status(200)
        .json({ success: true, message: "Unsubscribed successfully" });
    }

    res.status(400).json({ success: false, message: "Invalid token for unsubscribe" });
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
    const page = req.query.page || 0;
    const limit = req.query.limit || 10;
    const totalSubscribers = await Subscriber.countDocuments();
    const totalPages = Math.floor(totalSubscribers / limit) - 1;

    const subscribers = await Subscriber.find({})
      .skip(page * limit)
      .limit(limit);

    res.status(200).json({ success: true, subscribers, totalPages, limit, page });
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

    const isSubscriber = await Subscriber.findOneAndDelete({ email });

    if (!isSubscriber) {
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
