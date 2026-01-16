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
  userCount: {
    type: Number,
    required: true,
  },
  sentAt: {
    type: Date,
    default: Date.now,
  },
  audience: {
    type: String,
    enum: ["all", "subscribers", "unsubsscribed"],
    required: true,
  }
}, {timestamps: true});

export const Email = mongoose.model("Email", emailSchema);