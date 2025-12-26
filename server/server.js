import "dotenv/config";
import connectDB from "./src/db/index.js";
import connectCloudinary from "./src/utils/cloudinary.js";
import express from "express";
import cors from "cors";
import userRouter from "./src/routes/user.route.js";
import productRouter from "./src/routes/product.route.js";
import cartRouter from "./src/routes/cart.routes.js";
import orderRouter from "./src/routes/order.routes.js";
import addressRouter from "./src/routes/address.routes.js";
import seedAdmin from "./src/utils/seedAdmin.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: [`${process.env.USER_FRONTEND_URL}`, `${process.env.ADMIN_FRONTEND_URL}`],
    credentials: true,
  })
);

console.log(`${process.env.USER_FRONTEND_URL}`, `${process.env.ADMIN_FRONTEND_URL}`);
// Database connection
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log(`Server Error: ${error}`);
    });
    app.listen(PORT, () => {
      console.log(`Server is listening on PORT: ${PORT}`);
    });
    seedAdmin();
  })
  .catch((error) => {
    console.log(`DB Connection Failed: ${error}`);
  });

// Cloudinary Connection
connectCloudinary();

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/address", addressRouter);

// Health API
app.get("/health", (req, res) => {
  res.json({ Message: "This is Backend of SnapShop is working fine..." });
});
