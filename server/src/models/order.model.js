import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "delivered", "cancelled", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Razorpay"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    paymentDetails: {
      type: Object,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export const Orders = mongoose.model("Orders", orderSchema);