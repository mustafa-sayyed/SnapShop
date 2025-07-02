import React, { useEffect, useState } from "react";
import { useShop } from "../contexts/ShopContext";
import { assets } from "../assets/frontend_assets";
import { useLocation } from "react-router-dom";

function SearchBar() {
  const { search, showSearch, setShowSearch, setSearch } = useShop();
  const [visible, setVisible] = useState(false);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("collection") && showSearch) {
      setVisible(true);
    } else {
      setVisible(false);
      setSearch("");
    }
  }, [location, showSearch]);

  return (
    showSearch &&
    visible && (
      <div className="border-b border-b-gray-300 border-t bg-gray-50 text-center">
        <div className="inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-2 rounded-full w-3/4 sm:w-1/2 ">
          <input
            type="text"
            className="flex-1 outline-none bg-inherit text-sm"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <img src={assets.search_icon} alt="search" className="w-4" />
        </div>

        <img
          src={assets.cross_icon}
          alt="close"
          className="inline w-3 cursor-pointer"
          onClick={() => setShowSearch(false)}
        />
      </div>
    )
  );
}

export default SearchBar;
