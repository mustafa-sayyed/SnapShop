import "dotenv/config";
import connectDB from "./src/db/index.js";
import connectCloudinary from "./src/utils/cloudinary.js";
import express from "express";
import cors from "cors";
import userRouter from "./src/routes/user.route.js";
import productRouter from "./src/routes/product.route.js";
import cartRouter from "./src/routes/cart.routes.js"
import orderRouter from "./src/routes/order.routes.js"
import addressRouter from "./src/routes/address.routes.js"
import seedAdmin from "./src/utils/seedAdmin.js";
import seedProducts from "./src/utils/seedProduct.js";


const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Database connection
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log(`Server Error: ${error}`);
    }),
      app.listen(PORT, () => {
        console.log(`Server is listening on http://localhost:${PORT}`);
      });
    seedAdmin();
  })
  .catch((error) => {
    console.log(`DB Connection Failed: ${error}`);
  });

// Cloudinary Connection
connectCloudinary();

// Seeding Products
// seedProducts();


app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/address", addressRouter);

// APIs
app.get("/", (req, res) => {
  res.json({ Message: "This is Backend of Ecommerce" });
});
