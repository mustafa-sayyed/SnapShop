import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({}, { timestamps: true });

export const Address = mongoose.model("Address", addressSchema);
