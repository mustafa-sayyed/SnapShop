import React, { useEffect, useState } from "react";
import { assets } from "../assets/frontend_assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useShop } from "../contexts/ShopContext";
import { useAuth } from "../contexts/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle } from "lucide-react";

function Navbar() {
  const [visible, setVisible] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();

  const { setShowSearch, getCartCount, cartItems } = useShop();
  const { authStatus, logout } = useAuth();

  useEffect(() => {
    setCartCount(getCartCount());
  }, [cartItems]);

  return (
    <div className="flex justify-between items-center py-5 font-medium ">
      <Link to={"/"}>
        <h2 className="text-3xl italic ">
          Snap<span className="text-red-500">Shop</span>
        </h2>
      </Link>

      <ul className="hidden sm:flex gap-5 text-gray-700">
        <NavLink
          to={"/"}
          className={({ isActive }) => `text-gray-600 ${isActive ? "text-red-500" : ""}`}>
          Home
        </NavLink>
        <NavLink
          to={"/collection"}
          className={({ isActive }) => `text-gray-600 ${isActive ? "text-red-500" : ""}`}>
          Collection
        </NavLink>
        <NavLink
          to={"/about"}
          className={({ isActive }) => `text-gray-600 ${isActive ? "text-red-500" : ""}`}>
          About
        </NavLink>
        <NavLink
          to={"/contact"}
          className={({ isActive }) => `text-gray-600 ${isActive ? "text-red-500" : ""}`}>
          Contact
        </NavLink>
      </ul>

      <div className="flex justify-center items-center gap-6">
        <img
          src={assets.search_icon}
          alt="search"
          className="w-5 cursor-pointer"
          onClick={() => navigate("/search")}
        />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <UserCircle className="outline-none cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {authStatus ? (
              <>
                <DropdownMenuItem>
                  <p
                    onClick={() => navigate("/profile")}
                    className="cursor-pointer hover:text-black">
                    My Profile
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <p
                    onClick={() => navigate("/orders")}
                    className="cursor-pointer hover:text-black">
                    Orders
                  </p>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <p onClick={logout} className="cursor-pointer hover:text-black">
                    Logout
                  </p>
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem>
                <Link to={"/login"} className="cursor-pointer hover:text-black">
                  Login
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} alt="cart" className="w-5 cursor-pointer min-w-5" />
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {cartCount}
          </p>
        </Link>

        <img
          src={assets.menu_icon}
          alt="menu"
          className="w-5 cursor-pointer sm:hidden"
          onClick={() => setVisible(true)}
        />
      </div>

      {/* Sidebar Menu for Mobiles */}
      <div
        className={`absolute top-0 bottom-0 right-0 overflow-hidden bg-white transition-all ${
          visible ? "w-full" : "w-0"
        } sm:hidden`}>
        <div className="flex flex-col text-gray-600 mt-4 hover:text-black ">
          <div
            className="flex items-center gap-4 p-3 cursor-pointer"
            onClick={() => setVisible(false)}>
            <img className="h-4 rotate-180 " src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            to="/"
            className={({ isActive }) =>
              `py-3 pl-6 border-b border-t mt-2 border-gray-500 ${
                isActive ? "text-red-500" : ""
              } `
            }>
            Home
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            to="/about"
            className={({ isActive }) =>
              `py-3 pl-6 border-b border-gray-500 ${isActive ? "text-red-500" : ""} `
            }>
            About
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            to="/collection"
            className={({ isActive }) =>
              `py-3 pl-6 border-b border-gray-500 ${isActive ? "text-red-500" : ""} `
            }>
            Collection
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            to="/contact"
            className={({ isActive }) =>
              `py-3 pl-6 border-b border-gray-500 ${isActive ? "text-red-500" : ""} `
            }>
            Contact
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            to="/login"
            className={({ isActive }) =>
              `py-3 pl-6 border-b border-gray-500 ${isActive ? "text-red-500" : ""} `
            }>
            Login
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
