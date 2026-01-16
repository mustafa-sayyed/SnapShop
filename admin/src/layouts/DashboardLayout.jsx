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
import { useTheme } from "@/context/themeContext";
import { useAuth } from "@/context/userContext";
import { DownloadCloudIcon, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function DashboardLayout() {
  const { authStatus } = useAuth();
  const {toggle, theme} = useTheme();
  const navigate = useNavigate();


  useEffect(() => {
    if (!authStatus) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <DashboardSidebar />

      <SidebarInset className="overflow-hidden" >
        <header className="flex p-6 justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>

          <Button variant="outline" className="cursor-pointer" onClick={() => toggle()}>
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
