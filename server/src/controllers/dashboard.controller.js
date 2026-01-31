import { Orders } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Subscriber } from "../models/subscribe.model.js";

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const now = new Date();
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Parallel execution of all stat queries
    const [
      totalUsers,
      newUsersLast24h,
      totalOrders,
      ordersLast24h,
      totalProducts,
      activeSubscribers,
      revenueStats,
      pendingOrders,
      deliveredOrders,
    ] = await Promise.all([
      // Total users count
      User.countDocuments({ role: "user" }),

      // New users in last 24 hours
      User.countDocuments({
        role: "user",
        createdAt: { $gte: last24Hours },
      }),

      // Total orders
      Orders.countDocuments(),

      // Orders in last 24 hours
      Orders.countDocuments({ createdAt: { $gte: last24Hours } }),

      // Total products
      Product.countDocuments(),

      // Active subscribers
      Subscriber.countDocuments({ status: "active" }),

      // Revenue aggregation
      Orders.aggregate([
        {
          $match: {
            paymentStatus: "completed",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
            totalItemsSold: { $sum: { $size: "$items" } },
          },
        },
      ]),

      // Pending orders count
      Orders.countDocuments({ status: "pending" }),

      // Delivered orders count
      Orders.countDocuments({ status: "delivered" }),
    ]);

    // Calculate revenue from last 24 hours
    const revenueLast24h = await Orders.aggregate([
      {
        $match: {
          paymentStatus: "completed",
          createdAt: { $gte: last24Hours },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          newLast24h: newUsersLast24h,
        },
        orders: {
          total: totalOrders,
          last24h: ordersLast24h,
          pending: pendingOrders,
          delivered: deliveredOrders,
        },
        products: {
          total: totalProducts,
        },
        subscribers: {
          active: activeSubscribers,
        },
        revenue: {
          total: revenueStats[0]?.totalRevenue || 0,
          last24h: revenueLast24h[0]?.revenue || 0,
          totalItemsSold: revenueStats[0]?.totalItemsSold || 0,
        },
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
    });
  }
};

// Get revenue trends for last 12 months
export const getRevenueTrends = async (req, res) => {
  try {
    const now = new Date();
    const twelveMonthsAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 11,
      1
    );

    const revenueTrends = await Orders.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          paymentStatus: "completed",
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
          orders: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          month: "$_id.month",
          revenue: 1,
          orders: 1,
        },
      },
    ]);

    // Fill in missing months with zero values
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const filledData = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const existing = revenueTrends.find(
        (item) => item.year === year && item.month === month
      );

      filledData.push({
        month: months[month - 1],
        year,
        revenue: existing?.revenue || 0,
        orders: existing?.orders || 0,
      });
    }

    res.status(200).json({
      success: true,
      data: filledData,
    });
  } catch (error) {
    console.error("Revenue trends error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch revenue trends",
    });
  }
};

// Get order statistics by status
export const getOrderStats = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Daily order stats for last 7 days
    const dailyOrders = await Orders.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.date",
          statuses: {
            $push: {
              status: "$_id.status",
              count: "$count",
            },
          },
          total: { $sum: "$count" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Transform data for chart
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const chartData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = days[date.getDay()];

      const existing = dailyOrders.find((item) => item._id === dateStr);

      const dayData = {
        day: dayName,
        date: dateStr,
        pending: 0,
        delivered: 0,
        cancelled: 0,
        failed: 0,
        total: existing?.total || 0,
      };

      if (existing) {
        existing.statuses.forEach((s) => {
          dayData[s.status] = s.count;
        });
      }

      chartData.push(dayData);
    }

    res.status(200).json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    console.error("Order stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order stats",
    });
  }
};

// Get product category distribution
export const getCategoryDistribution = async (req, res) => {
  try {
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    // Generate colors for each category
    const colors = [
      "#2563eb", "#7c3aed", "#db2777", "#ea580c", "#16a34a",
      "#0891b2", "#4f46e5", "#c026d3", "#f59e0b", "#10b981",
    ];

    const dataWithColors = categoryStats.map((item, index) => ({
      ...item,
      fill: colors[index % colors.length],
    }));

    res.status(200).json({
      success: true,
      data: dataWithColors,
    });
  } catch (error) {
    console.error("Category distribution error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch category distribution",
    });
  }
};

// Get top selling products
export const getTopProducts = async (req, res) => {
  try {
    const topProducts = await Orders.aggregate([
      {
        $match: {
          paymentStatus: "completed",
        },
      },
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items._id",
          name: { $first: "$items.name" },
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $limit: 10,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          totalSold: 1,
          totalRevenue: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: topProducts,
    });
  } catch (error) {
    console.error("Top products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top products",
    });
  }
};

// Get recent orders
export const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Orders.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "name email")
      .populate("address")
      .select("totalPrice status paymentMethod paymentStatus createdAt items");

    res.status(200).json({
      success: true,
      data: recentOrders,
    });
  } catch (error) {
    console.error("Recent orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent orders",
    });
  }
};

// Get user growth trends
export const getUserGrowth = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const userGrowth = await User.aggregate([
      {
        $match: {
          role: "user",
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    const filledData = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const existing = userGrowth.find(
        (item) => item._id.year === year && item._id.month === month
      );

      filledData.push({
        month: months[month - 1],
        year,
        users: existing?.count || 0,
      });
    }

    res.status(200).json({
      success: true,
      data: filledData,
    });
  } catch (error) {
    console.error("User growth error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user growth",
    });
  }
};

// Get payment method distribution
export const getPaymentMethodStats = async (req, res) => {
  try {
    const paymentStats = await Orders.aggregate([
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalPrice" },
        },
      },
      {
        $project: {
          _id: 0,
          method: "$_id",
          count: 1,
          totalAmount: 1,
        },
      },
    ]);

    const colors = {
      COD: "#ea580c",
      Razorpay: "#2563eb",
    };

    const dataWithColors = paymentStats.map((item) => ({
      ...item,
      fill: colors[item.method] || "#6b7280",
    }));

    res.status(200).json({
      success: true,
      data: dataWithColors,
    });
  } catch (error) {
    console.error("Payment method stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment method stats",
    });
  }
};
