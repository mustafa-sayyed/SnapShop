import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendWelcomeEmail } from "../emails/welcomeEmail.js";

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

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
      user,
    });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res.status(500).json({
      message: `Internal Server error`,
      errorStack,
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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

    await sendWelcomeEmail(email, name);

    return res.status(201).json({
      token,
      success: true,
      message: "Account created successfully",
      user,
    });
  } catch (error) {
    console.log("Error in Creating Account: ", error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res.status(500).json({
      message: `Internal Server error`,
      errorStack,
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
    console.log(err);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res.status(500).json({
      message: `Internal Server error`,
      errorStack,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res.status(500).json({
      message: `Internal Server error`,
      errorStack,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const filter = search
      ? { name: { $regex: search, $options: "i" }, role: "user" }
      : { role: "user" };
    const totalUsers = await User.countDocuments(filter);

    const users = await User.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
      totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res.status(500).json({
      message: `Internal Server error`,
      errorStack,
    });
  }
};

const deleteuser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    const errorStack = process.env.NODE_ENV == "development" ? error : undefined;
    res.status(500).json({
      message: `Internal Server error`,
      errorStack,
    });
  }
};

export { loginUser, signupUser, loginAdmin, getCurrentUser, getAllUsers, deleteuser };
