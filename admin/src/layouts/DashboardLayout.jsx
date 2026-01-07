import { DashboardSidebar } from "@/components";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/userContext";
import { DownloadCloudIcon, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function DashboardLayout() {
  const { authStatus } = useAuth();
  const [theme, setTheme] = useState(
    () => localStorage.getItem("snapshopAdminTheme") ?? "light"
  );
  const navigate = useNavigate();

  function toggleTheme() {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
      localStorage.setItem("snapshopAdminTheme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
      localStorage.setItem("snapshopAdminTheme", "light");
    }
  }

  useEffect(() => {
    if (!authStatus) {
      navigate("/login");
    }

    const savedTheme = localStorage.getItem("snapshopAdminTheme");

    if (savedTheme && savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <>
      <DashboardSidebar />

      <SidebarInset>
        <header className="flex p-6 justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>

          <Button variant="outline" className="cursor-pointer" onClick={() => toggleTheme()}>
            Toggle Theme {theme === "dark" ? <Moon /> : <Sun />}
          </Button>
        </header>
        <div className="sm:px-12 px-6 py-5">
          <Outlet />
        </div>
      </SidebarInset>
    </>
  );
}

export default DashboardLayout;
