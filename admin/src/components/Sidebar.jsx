import React from "react";
import { assets } from "../assets";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <div className="w-[18%] min-h-screen border-r-[1px] border-gray-600">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-base">
        <NavLink
          to={"/add"}
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-600 border-r-0 px-3 py-2 rounded-l-sm ${isActive ? "bg-red-100 border-red-600" : ""}`
          }>
          <img src={assets.add_icon} alt="addLogo" className="w-5 h-5" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>

        <NavLink
          to={"/list"}
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-600 border-r-0 px-3 py-2 rounded-l-sm ${isActive ? "bg-red-100 border-red-600" : ""}`
          }>
          <img src={assets.order_icon} alt="addLogo" className="w-5 h-5" />
          <p className="hidden md:block">List Items</p>
        </NavLink>

        <NavLink
          to={"/orders"}
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-600 border-r-0 px-3 py-2 rounded-l-sm ${isActive ? "bg-red-100 border-red-600" : ""}`
          }>
          <img src={assets.order_icon} alt="addLogo" className="w-5 h-5" />
          <p className="hidden md:block">Order Items</p>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
