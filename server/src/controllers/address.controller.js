import mongoose from "mongoose";
import { Address } from "../models/address.model.js";

const createAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, email, address, phone, pincode, country, state, city } =
      req.body;

    await Address.create({
      userId,
      firstName,
      lastName,
      email,
      address,
      pincode,
      country,
      state,
      city,
      phone,
    });

    const userAddress = await Address.find({ userId });

    res.status(201).json({ success: true, address: userAddress });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const updateAddress = async (req, res) => {
  
}

const deleteAddress = async (req, res) => {

}


export { createAddress, updateAddress, deleteAddress };
