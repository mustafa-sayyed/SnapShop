"use client";;
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Activity,
  DollarSign,
  Home,
  LinkIcon,
  LogOut,
  Package2,
  Percent,
  PieChart,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";
import { Logo } from "@/components/sidebar/logo";
import DashboardNavigation from "@/components/sidebar/DashboardNavigation";
import { Link } from "react-router-dom";


const dashboardRoutes = [
  {
    id: "home",
    title: "Home",
    icon: <Home className="size-4" />,
    link: "home",
  },
  {
    id: "Manage Featured Banners",
    title: "Manage Featured Banners",
    icon: <Home className="size-4" />,
    link: "banners",
  },
  {
    id: "products",
    title: "Products",
    icon: <Package2 className="size-4" />,
    link: "#",
    subs: [
      {
        title: "Add Product",
        link: "add",
        icon: <Package2 className="size-4" />,
      },
      {
        title: "All Products",
        link: "list",
        icon: <Package2 className="size-4" />,
      },
      {
        title: "Checkout Links",
        link: "#",
        icon: <LinkIcon className="size-4" />,
      },
      {
        title: "Discounts",
        link: "#",
        icon: <Percent className="size-4" />,
      },
    ],
  },
  {
    id: "usage-billing",
    title: "Usage Billing",
    icon: <PieChart className="size-4" />,
    link: "#",
    subs: [
      {
        title: "Meters",
        link: "#",
        icon: <PieChart className="size-4" />,
      },
      {
        title: "Events",
        link: "#",
        icon: <Activity className="size-4" />,
      },
    ],
  },
  {
    id: "benefits",
    title: "Benefits",
    icon: <Sparkles className="size-4" />,
    link: "#",
  },
  {
    id: "customers",
    title: "Customers",
    icon: <Users className="size-4" />,
    link: "#",
  },
  {
    id: "sales",
    title: "Sales",
    icon: <ShoppingBag className="size-4" />,
    link: "#",
    subs: [
      {
        title: "Orders",
        link: "orders",
        icon: <ShoppingBag className="size-4" />,
      },
      {
        title: "Subscriptions",
        link: "#",
        icon: <Infinity className="size-4" />,
      },
    ],
  },
  {
    id: "storefront",
    title: "Storefront",
    icon: <Store className="size-4" />,
    link: "#",
  },
  {
    id: "analytics",
    title: "Analytics",
    icon: <TrendingUp className="size-4" />,
    link: "#",
  },
  {
    id: "finance",
    title: "Finance",
    icon: <DollarSign className="size-4" />,
    link: "#",
    subs: [
      { title: "Incoming", link: "#" },
      { title: "Outgoing", link: "#" },
      { title: "Payout Account", link: "#" },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: <Settings className="size-4" />,
    link: "#",
    subs: [
      { title: "General", link: "#" },
      { title: "Webhooks", link: "#" },
      { title: "Custom Fields", link: "#" },
    ],
  },
];



export function DashboardSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader
        className={cn("flex md:pt-3.5", isCollapsed
          ? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start"
          : "flex-row items-center justify-between")}>
        <Link to="#" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          {!isCollapsed && (
            <span className="font-semibold text-black dark:text-white">
              SnapShop
            </span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-4 px-2 py-4">
        <DashboardNavigation routes={dashboardRoutes} />
      </SidebarContent>
      <SidebarFooter className="px-2">
        <div>
          <span>Logout</span>
          <LogOut />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
