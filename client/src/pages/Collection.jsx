import React, { useEffect, useMemo, useState } from "react";
import { useShop } from "../contexts/ShopContext";
import { assets } from "../assets/frontend_assets";
import { ProductItem, Title } from "../components";

function Collection() {
  const { products, search, showSearch } = useShop();
  const [showFilter, setShowFilter] = useState(false);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [loading, setLoading] = useState(true);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const filteredProducts = useMemo(() => {
    setLoading(false);

    let productsCopy = products.slice();

    if (category.length) {
      productsCopy = productsCopy.filter((item) => category.includes(item.category));
    }

    if (subCategory.length) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    switch (sortType) {
      case "low-high":
        productsCopy.sort((a, b) => a.price - b.price);
        break;
      case "high-low":
        productsCopy.sort((a, b) => b.price - a.price);
        break;
      case "relevant":
      default:
        break;
    }

    if (search) {
      productsCopy = productsCopy.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return productsCopy;
  }, [sortType, category, subCategory, products, search, showSearch]);

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center ">
        <div className="animate-spin inline-block size-12 border-5 border-current border-t-transparent text-red-600 rounded-full">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          className="my-2 flex items-center cursor-pointer gap-2 text-xl"
          onChange={() => setShowFilter((prev) => !prev)}>
          FILTERS
          <img
            src={assets.dropdown_icon}
            alt="dropdown"
            className={`h-3 sm:hidden transition-transform ${
              showFilter ? "rotate-90" : ""
            }`}
          />
        </p>
        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 sm:block ${
            showFilter ? "" : "hidden"
          }`}>
          <p className="mb-3 font-medium text-sm">Categories</p>
          <div className="flex flex-col text-sm text-gray-700 font-light gap-2">
            <p className="flex gap-2 cursor-pointer">
              <input type="checkbox" id="men" value="Men" onChange={toggleCategory} />
              <label className="cursor-pointer" htmlFor="men">
                Men
              </label>
            </p>
            <p className="flex gap-2 cursor-pointer">
              <input type="checkbox" id="women" value="Women" onChange={toggleCategory} />
              <label className="cursor-pointer" htmlFor="women">
                Women
              </label>
            </p>
            <p className="flex gap-2 cursor-pointer">
              <input type="checkbox" id="kids" value="Kids" onChange={toggleCategory} />
              <label className="cursor-pointer" htmlFor="kids">
                Kids
              </label>
            </p>
          </div>
        </div>

        {/* Type Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-6 sm:block ${
            showFilter ? "" : "hidden"
          }`}>
          <p className="mb-3 font-medium text-sm">Sub Categories</p>
          <div className="flex flex-col text-sm text-gray-700 font-light gap-2">
            <p className="flex gap-2 cursor-pointer">
              <input
                type="checkbox"
                id="topwear"
                value="Topwear"
                onChange={toggleSubCategory}
              />
              <label className="cursor-pointer" htmlFor="topwear">
                Top wear
              </label>
            </p>
            <p className="flex gap-2 cursor-pointer">
              <input
                type="checkbox"
                id="bottomwear"
                value="Bottomwear"
                onChange={toggleSubCategory}
              />
              <label className="cursor-pointer" htmlFor="bottomwear">
                Bottom wear
              </label>
            </p>
            <p className="flex gap-2 cursor-pointer">
              <input
                type="checkbox"
                id="Winterwear"
                value="Winterwear"
                onChange={toggleSubCategory}
              />
              <label className="cursor-pointer" htmlFor="Winterwear">
                Winter wear
              </label>
            </p>
          </div>
        </div>
        <select
          onChange={(e) => setSortType(e.target.value)}
          className="outline-none border border-gray-300 px-4 py-2 rounded-sm text-base">
          <option value="relevant">Sort By: Relevant</option>
          <option value="high-low">Sort By: High to Low</option>
          <option value="low-high">Sort by: Low to High</option>
        </select>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-center text-base sm:text-2xl m-4">
          <Title children1={"All"} children2={"Collection"} />
        </div>

        {filteredProducts.length ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 gap-y-6">
            {filteredProducts.map((product) => (
              <ProductItem
                key={product._id}
                id={product._id}
                image={product.image}
                name={product.name}
                price={product.price}
              />
            ))}
          </div>
        ): null}

        {!!filteredProducts.length && category.length && subCategory.length && (
          <div className=" w-full text-xl text-red-500 text-center ">
            No Products related to this Search or Filter is Found
          </div>
        )}

        {!filteredProducts.length && (
          <div className="w-full h-[80vh] flex items-center justify-center ">
            <div className="animate-spin inline-block size-12 border-5 border-current border-t-transparent text-red-600 rounded-full">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Collection;
