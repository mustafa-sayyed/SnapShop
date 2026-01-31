import IndexBarChart from "@/components/charts/BarCharts";
import IndexLineChart from "@/components/charts/LineChart";
import IndexPieChart from "@/components/charts/PieChart";
import IndexAreaChart from "@/components/charts/AreaChart";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Users,
  ShoppingCart,
  Package,
  IndianRupee,
  TrendingUp,
  Clock,
  CheckCircle,
  Mail,
} from "lucide-react";
import { currency } from "@/App";
import { Spinner } from "@/components/ui/spinner";

function Home() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);
  const [userGrowth, setUserGrowth] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  const token = localStorage.getItem("token");

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${token}` };
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      // Fetch all dashboard data in parallel
      const [
        statsRes,
        revenueRes,
        orderStatsRes,
        categoryRes,
        userGrowthRes,
        topProductsRes,
        recentOrdersRes,
      ] = await Promise.all([
        axios.get(`${baseUrl}/dashboard/stats`, { headers }),
        axios.get(`${baseUrl}/dashboard/revenue-trends`, { headers }),
        axios.get(`${baseUrl}/dashboard/order-stats`, { headers }),
        axios.get(`${baseUrl}/dashboard/category-distribution`, { headers }),
        axios.get(`${baseUrl}/dashboard/user-growth`, { headers }),
        axios.get(`${baseUrl}/dashboard/top-products`, { headers }),
        axios.get(`${baseUrl}/dashboard/recent-orders`, { headers }),
      ]);

      setStats(statsRes.data.data);
      setRevenueTrends(revenueRes.data.data);
      setOrderStats(orderStatsRes.data.data);
      setCategoryDistribution(categoryRes.data.data);
      setUserGrowth(userGrowthRes.data.data);
      setTopProducts(topProductsRes.data.data);
      setRecentOrders(recentOrdersRes.data.data);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatCurrency = (value) => {
    if (value >= 100000) {
      return `${currency}${(value / 100000).toFixed(1)}L`;
    } else if (value >= 1000) {
      return `${currency}${(value / 1000).toFixed(1)}K`;
    }
    return `${currency}${value}`;
  };

  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  };

  // Chart configs
  const revenueChartConfig = {
    revenue: {
      label: "Revenue",
      color: "#2563eb",
    },
    orders: {
      label: "Orders",
      color: "#22c55e",
    },
  };

  const orderStatsConfig = {
    pending: {
      label: "Pending",
      color: "#f59e0b",
    },
    delivered: {
      label: "Delivered",
      color: "#22c55e",
    },
    cancelled: {
      label: "Cancelled",
      color: "#ef4444",
    },
  };

  const userGrowthConfig = {
    users: {
      label: "New Users",
      color: "#8b5cf6",
    },
  };

  const StatCard = ({
    title,
    value,
    icon: Icon,
    subValue,
    subLabel,
    color = "text-primary",
  }) => (
    <div className="border bg-accent/30 rounded-xl px-6 py-6 hover:bg-accent/40 transition-colors">
      <div className="flex items-center justify-between">
        <div className="text-base font-light text-muted-foreground">{title}</div>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div className="text-4xl sm:text-5xl font-medium py-2">{value}</div>
      {subValue !== undefined && (
        <div className="text-sm text-muted-foreground">
          <span className="text-green-500 font-medium">+{subValue}</span> {subLabel}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-100">
        <Spinner className="size-12" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      {/* Stats Cards */}
      <div className="grid auto-rows-min gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={formatNumber(stats?.users?.total || 0)}
          icon={Users}
          subValue={stats?.users?.newLast24h || 0}
          subLabel="in last 24h"
          color="text-blue-500"
        />
        <StatCard
          title="Total Orders"
          value={formatNumber(stats?.orders?.total || 0)}
          icon={ShoppingCart}
          subValue={stats?.orders?.last24h || 0}
          subLabel="in last 24h"
          color="text-green-500"
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.revenue?.total || 0)}
          icon={IndianRupee}
          subValue={formatCurrency(stats?.revenue?.last24h || 0).replace(currency, "")}
          subLabel="in last 24h"
          color="text-yellow-500"
        />
        <StatCard
          title="Total Products"
          value={formatNumber(stats?.products?.total || 0)}
          icon={Package}
          color="text-purple-500"
        />
      </div>

      <div className="grid auto-rows-min gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Pending Orders"
          value={formatNumber(stats?.orders?.pending || 0)}
          icon={Clock}
          color="text-orange-500"
        />
        <StatCard
          title="Delivered Orders"
          value={formatNumber(stats?.orders?.delivered || 0)}
          icon={CheckCircle}
          color="text-green-500"
        />
        <StatCard
          title="Items Sold"
          value={formatNumber(stats?.revenue?.totalItemsSold || 0)}
          icon={TrendingUp}
          color="text-cyan-500"
        />
        <StatCard
          title="Active Subscribers"
          value={formatNumber(stats?.subscribers?.active || 0)}
          icon={Mail}
          color="text-pink-500"
        />
      </div>

      {/* Revenue & Orders Chart */}
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
        <div className="border w-full min-h-60 px-4 py-6 sm:p-6 rounded-xl">
          <IndexLineChart
            data={revenueTrends}
            config={revenueChartConfig}
            xAxisKey="month"
            lines={["revenue"]}
            title="Revenue Trends (Last 12 Months)"
            formatYAxis={formatCurrency}
          />
        </div>
        <div className="border w-full min-h-60 px-4 py-6 sm:p-6 rounded-xl">
          <IndexBarChart
            data={orderStats}
            config={orderStatsConfig}
            xAxisKey="day"
            bars={["pending", "delivered", "cancelled"]}
            title="Order Status (Last 7 Days)"
          />
        </div>
      </div>

      {/* Category & User Growth */}
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
        <div className="border w-full min-h-60 px-4 py-6 sm:p-6 rounded-xl">
          <IndexPieChart
            data={categoryDistribution}
            dataKey="count"
            nameKey="category"
            title="Products by Category"
          />
        </div>
        <div className="border w-full min-h-60 px-4 py-6 sm:p-6 rounded-xl">
          <IndexAreaChart
            data={userGrowth}
            config={userGrowthConfig}
            xAxisKey="month"
            areas={["users"]}
            title="User Growth (Last 6 Months)"
          />
        </div>
      </div>

      {/* Top Products & Recent Orders */}
      <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">

        <div className="border rounded-xl px-4 py-6 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {topProducts.length > 0 ?
              topProducts.slice(0, 5).map((product, index) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium line-clamp-1">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.totalSold} sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      {formatCurrency(product.totalRevenue)}
                    </p>
                  </div>
                </div>
              ))
            : <p className="text-muted-foreground text-center py-4">No products data</p>}
          </div>
        </div>

        <div className="border rounded-xl px-4 py-6 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.length > 0 ?
              recentOrders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-3 bg-accent/30 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        order.status === "delivered" ? "bg-green-500"
                        : order.status === "pending" ? "bg-yellow-500"
                        : order.status === "cancelled" ? "bg-red-500"
                        : "bg-gray-500"
                      }`}
                    />
                    <div>
                      <p className="font-medium">
                        {order.userId?.name || "Unknown User"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.items?.length} item(s) • {order.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(order.totalPrice)}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
            : <p className="text-muted-foreground text-center py-4">No recent orders</p>}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
