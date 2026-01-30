import React from "react";
import { Link } from "react-router-dom";
import { useShop } from "../contexts/ShopContext";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import { StarRating } from "./StarRating";

function ProductItem({ id, image, price, name, className = "", isNew = false, isBestSeller = false, averageRating = 0, totalRatings = 0 }) {
  const { currency } = useShop();

  return (
    <Link to={`/product/${id}`} className={`group text-gray-700 cursor-pointer block ${className}`}>
      <div className="relative overflow-hidden rounded-lg bg-gray-100 aspect-[3/4]">
        <img 
          src={image[0]} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
          alt={name} 
        />
        
        {(isNew || isBestSeller) && (
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {isNew && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                New
              </span>
            )}
            {isBestSeller && (
              <span className="px-2.5 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                Hot
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors">
          {name}
        </h3>
        {(averageRating > 0 || totalRatings > 0) && (
          <div className="flex items-center gap-2">
            <StarRating rating={averageRating} size="sm" />
            {totalRatings > 0 && (
              <span className="text-xs text-gray-500">({totalRatings})</span>
            )}
          </div>
        )}
        <p className="text-base font-bold text-gray-900">
          <span className="text-sm font-normal text-gray-500 mr-0.5">{currency}</span>
          {price.toLocaleString()}
        </p>
      </div>
    </Link>
  );
}

export default ProductItem;
