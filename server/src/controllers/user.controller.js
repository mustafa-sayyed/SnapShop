import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import validator from "validator";
import bcrypt from "bcrypt";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exists",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(404).json({
        success: false,
        message: "Password does not match",
      });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    return res.status(200).json({
      token,
      success: true,
      message: "Login successfull",
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return res.status(500).json({
      message: `Internal Server error: ${error.message}`,
    });
  }
};

const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Enter a strong password",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    return res.status(201).json({
      token,
      success: true,
      message: "Account created successfully",
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.log("Error in Creating Account: ", error);
    return res.status(500).json({
      message: `Internal Server error: ${error.message}`,
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User with this email does not exists" });
    }

    if (!(email === adminEmail && password === adminPassword)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials for Admin login" });
    }

    const token = jwt.sign({ id: user._id, role: "admin" }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      token,
      message: "Admin Login Successfull",
      user: { name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server error: ${error.message}` });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const id = req.user.id;

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    res.status(200).json({
      success: true,
      user: { name: user.name, email: user.email, role: user.role, cartData: user.cartData },
    });
  } catch (error) {
    res.status(500).json({ message: `Internal Server error: ${error.message}` });
  }
};



export { loginUser, signupUser, loginAdmin, getCurrentUser };
