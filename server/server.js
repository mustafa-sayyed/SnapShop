import "dotenv/config";
import connectDB from "./src/db/index.js";
import connectCloudinary from "./src/utils/cloudinary.js";
import express from "express";
import cors from "cors";
import userRouter from "./src/routes/user.route.js";
import productRouter from "./src/routes/product.route.js";
import cartRouter from "./src/routes/cart.route.js";
import orderRouter from "./src/routes/order.route.js";
import addressRouter from "./src/routes/address.route.js";
import emailRouter from "./src/routes/email.route.js";
import featuredBannerRouter from "./src/routes/featuredBanner.route.js";
import seedAdmin from "./src/utils/seedAdmin.js";
import subscriberRouter from "./src/routes/subscriber.route.js";
import globalRateLimiter from "./src/middlewares/globalRatelimit.middleware.js";
import webhookRouter from "./src/routes/webhook.route.js";
import { compressAllImages } from "./src/utils/optimzeImages.js";

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
app.use(globalRateLimiter);

// Settign this because this Server is deployed on Azure Container Apps which uses Ingress as Load Balancer and Reverse Proxy
app.set("trust proxy", 1);

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
// compressAllImages();

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/featured-banners", featuredBannerRouter);
app.use("/api/v1/subscribers", subscriberRouter);
app.use("/api/v1/emails", emailRouter);
app.use("/api/v1/webhook", webhookRouter);

// Health API
app.get("/health", (req, res) => {
  res.json({ Message: "This is Backend of SnapShop is working fine..." });
});

app.get("/debug-ip", (req, res) => {
  res.json({
    ip: req.ip,
    forwardedFor: req.headers["x-forwarded-for"],
  });
});
