import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ["active", "unsubscribed"],
    default: "active",
  },
  subscribedAt: {
    type: Date,
    required: true,
  },
  unsubscribedAt: Date,
  unsubscribeToken: String,
});


export const Subscriber = mongoose.model("subscriber", subscriberSchema)