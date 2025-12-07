import React, { use } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../contexts/ShopContext";

function ProductItem({ id, image, price, name, className="" }) {
  const { currency } = useShop();

  return (
    <Link to={`/product/${id}`} className={`text-gray-700 cursor-pointer ${className}`}>
      <div className="overflow-hidden">
        <img src={image[0]} className="hover:scale-110 transition ease-in-out " alt="" />
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium">
        <span className="text-base mr-0.5">{currency}</span>
        {price}
      </p>
    </Link>
  );
}

export default ProductItem;
