"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  Activity,
  DollarSign,
  Home,
  LinkIcon,
  LogOut,
  Mail,
  MailCheck,
  MailPlus,
  Package2,
  Percent,
  PieChart,
  Settings,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  TagIcon,
  TrendingUp,
  Users,
} from "lucide-react";
import { Logo } from "@/components/sidebar/logo";
import DashboardNavigation from "@/components/sidebar/DashboardNavigation";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useAuth } from "@/context/userContext";
import { useState } from "react";
import { toast } from "react-toastify";

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
    icon: <Tag className="size-4" />,
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
    ],
  },
  {
    id: "customers",
    title: "Customers",
    icon: <Users className="size-4" />,
    link: "customers",
  },
  {
    id: "email-subscribers",
    title: "Email Subscribers",
    icon: <Mail className="size-4" />,
    link: "subscribers",
  },
  {
    id: "send-email",
    title: "Send Email",
    icon: <MailPlus className="size-4" />,
    link: "send-email",
  },
  {
    id: "email-history",
    title: "Email History",
    icon: <MailCheck className="size-4" />,
    link: "email-history",
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
        title: "Sales Analytics",
        link: "#",
        icon: <TrendingUp className="size-4" />,
      },
    ],
  },
  {
    id: "settings",
    title: "Settings",
    icon: <Settings className="size-4" />,
    link: "#",
  },
];

function DashboardSidebar() {
  const { state } = useSidebar();
  const {logout} = useAuth();
  const isCollapsed = state === "collapsed";
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  

  const handleLogout = () => {
    toast.success("Logged out successfully");
    logout();
    setIsLogoutDialogOpen(false);
  }

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader
        className={cn(
          "flex md:pt-3.5",
          isCollapsed
            ? "flex-row items-center justify-between gap-y-4 md:flex-col md:items-start md:justify-start"
            : "flex-row items-center justify-between"
        )}
      >
        <Link to="#" className="flex items-center gap-2">
          <Logo className="h-8 w-8" />
          {!isCollapsed && (
            <span className="font-semibold text-black dark:text-white">SnapShop</span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent className="gap-4 px-2 py-4">
        <DashboardNavigation routes={dashboardRoutes} />
      </SidebarContent>
      <SidebarFooter className="px-2">
        <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <DialogTrigger asChild>
            <SidebarMenuButton
              tooltip={"Logout"}
              className="cursor-pointer flex justify-center items-center gap-3"
            >
              {!isCollapsed && (
                <span className=" text-black dark:text-white">Logout</span>
              )}
              <LogOut size={20} />
            </SidebarMenuButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to logout?</DialogTitle>
              <DialogDescription>
                Confirming will log you out of your account.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose><Button variant="outline" className="cursor-pointer" >Cancel</Button></DialogClose>
              <Button variant="destructive" className="cursor-pointer" onClick={handleLogout} >Logout</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}

export default DashboardSidebar;
