import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import {
  getDashboardStats,
  getRevenueTrends,
  getOrderStats,
  getCategoryDistribution,
  getTopProducts,
  getRecentOrders,
  getUserGrowth,
  getPaymentMethodStats,
} from "../controllers/dashboard.controller.js";

const dashboardRouter = Router();

// All routes require admin authentication
dashboardRouter.use(authenticate(["admin"]));

// Routes for Stats Card
dashboardRouter.get("/stats", getDashboardStats);

// Routes for Charts 
dashboardRouter.get("/revenue-trends", getRevenueTrends);
dashboardRouter.get("/order-stats", getOrderStats);
dashboardRouter.get("/category-distribution", getCategoryDistribution);
dashboardRouter.get("/top-products", getTopProducts);
dashboardRouter.get("/recent-orders", getRecentOrders);
dashboardRouter.get("/user-growth", getUserGrowth);
dashboardRouter.get("/payment-stats", getPaymentMethodStats);

export default dashboardRouter;
