import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    googleId: {
      type: String,
      required: false,
    },
    authProvider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    cartData: {
      type: Object,
      default: {},
    },
    defaultAddress: {
      type: Object,
      default: null,
    },
  },
  { timestamps: true, minimize: false }
);

export const User = mongoose.model("User", userSchema);
