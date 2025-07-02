import jwt from "jsonwebtoken";

// const authenticateAdmin = (req, res, next) => {
//   const token = req.headers["authorization"]?.replace("Bearer", "")?.trim();

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }

//   const user = jwt.verify(token, process.env.JWT_SECRET);

//   if (!user) {
//     return res.status(401).json({ success: false, message: "Unauthorized" });
//   }

//   if (!user.role?.includes("admin")) {
//     return res.status(401).json({ success: false, message: "Unauthorized" });
//   }

//   req.user = user;
//   next();
// };

// const authenticateUser = (req, res, next) => {
//   const token = req.headers["authorization"]?.replace("Bearer", "")?.trim();

//   if (!token) {
//     return res.status(401).json({ success: false, message: "Unauthorized" });
//   }

//   const user = jwt.verify(token, process.env.JWT_SECRET);

//   if (!user) {
//     return res.status(401).json({ success: false, message: "Unauthorized" });
//   }

//   req.user = user;
//   next();
// };

const authenticate = (role = []) => (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "")?.trim();

  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  let user;
  try {
    user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
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
