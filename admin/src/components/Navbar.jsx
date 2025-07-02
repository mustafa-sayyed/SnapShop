import React from "react";
import { assets } from "../assets";
import { useAuth } from "../context/userContext";

function Navbar() {
  const { logout } = useAuth();

  return (
    <div className="flex items-center justify-between px-[4%] py-2 ">
      <img src={assets.logo} alt="logo" className="w-[max(10%,80px)]" />
      <button
        className="bg-gray-700 text-white px-5 py-2 sm:px-7 rounded-full text-xs sm:text-sm cursor-pointer"
        onClick={logout}>
        logout
      </button>
    </div>
  );
}

export default Navbar;
