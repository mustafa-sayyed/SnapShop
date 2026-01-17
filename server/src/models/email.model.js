import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  recipientCount: {
    type: Number,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "sent", "failed"],
    default: "pending",
  },
  audience: {
    type: String,
    enum: ["all", "subscribers", "unsubscribers"],
    required: true,
  }
}, {timestamps: true});

export const Email = mongoose.model("Email", emailSchema);