import { Address } from "../models/address.model.js";
import { User } from "../models/user.model.js";

const getDefaultAddress = async (userId) => {
  try {
    return await Address.findOne({ userId, isDefault: true });
  } catch (error) {
    console.log(`Error occurred while getting default address: ${error}`);
  }
};

const setaUserDefaultAddress = async (address, userId) => {
  try {
    await User.findByIdAndUpdate(userId, { defaultAddress: address });
  } catch (error) {
    console.log(error);
  }
};

const createAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, address, phone, pincode, country, state, city, isDefault } =
      req.body;

    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const newAddress = await Address.create({
      userId,
      name,
      email,
      address,
      pincode,
      country,
      state,
      city,
      phone,
      isDefault,
    });


    if (isDefault) {
      await setaUserDefaultAddress(newAddress, userId);
      return res.status(201).json({
        success: true,
        message: "address created successfully",
        address: newAddress,
      });
    }

    const defaultAddress = await getDefaultAddress(userId);

    res.status(201).json({
      success: true,
      message: "address created successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const addressId = req.params.addressId;
    const { name, email, address, phone, pincode, country, state, city, isDefault } =
      req.body;

    const addressUpdateData = {};
    if (name) addressUpdateData.name = name;
    if (email) addressUpdateData.email = email;
    if (address) addressUpdateData.address = address;
    if (phone) addressUpdateData.phone = phone;
    if (pincode) addressUpdateData.pincode = pincode;
    if (country) addressUpdateData.country = country;
    if (state) addressUpdateData.state = state;
    if (city) addressUpdateData.city = city;
    if (isDefault) addressUpdateData.isDefault = isDefault;

    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      {
        $set: addressUpdateData,
      },
      { new: true }
    );


    if (isDefault) {
      await setaUserDefaultAddress(updatedAddress, userId);
      return res.status(200).json({
        success: true,
        message: "address updated successfully",
        address: updatedAddress,
      });
    }

    const newDefaultAddress = await getDefaultAddress(userId);

    res.status(200).json({
      success: true,
      message: "address updated successfully",
      address: newDefaultAddress,
    });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", errorStack });
  }
};

const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.addressId;
    const address = await Address.findByIdAndDelete(addressId);

    if (!address) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    const defaultAddress = await getDefaultAddress(req.user._id);

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
      address: defaultAddress,
    });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", errorStack });
  }
};

const getAllAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const allAddresses = await Address.find({ userId });

    if (!allAddresses) {
      return res.status(404).json({ success: false, message: "Address not found" });
    }

    res.status(200).json({ success: true, addresses: allAddresses });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res
      .status(500)
      .json({ success: false, message: "Internal Server Error", errorStack });
  }
};

export { createAddress, updateAddress, deleteAddress, getAllAddress };
