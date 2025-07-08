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
      enum: ["pending", "delivered", "shipped", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    payment: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

export const Orders = mongoose.model("Orders", orderSchema);

// const orderSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     items: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//         required: true,
//       },
//     ],
//     totalPrice: {
//       type: Number,
//       required: true,
//     },
//     address: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Address",
//     },
//     status: {
//       type: String,
//       enum: ["pending", "delivered", "shipped", "cancelled"],
//     },
//     paymentMethod: {
//       type: String,
//       required: true,
//     },
//     payment: {
//         type: Boolean,
//         required: true,
//         default: false,
//     }
//   },
//   { timestamps: true }
// );
