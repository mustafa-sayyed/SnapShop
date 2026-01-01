import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const authenticate = (role = []) => async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "")?.trim();

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  let user;
  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
    user = await User.findById(decodedUser.id);
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (role.length && !role.includes(user.role)) {
    return res
      .status(403)
      .json({ success: false, message: "Forbidden: Insufficient role" });
  }


  req.user = user;

  next();
};

export { authenticate };
