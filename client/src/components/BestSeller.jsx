import React from "react";
import { ProductItem } from "./";
import { useShop } from "../contexts/ShopContext";
import { Flame, TrendingUp } from "lucide-react";

function BestSeller() {
  const { bestSellerProducts } = useShop();

  return (
    <section className="py-16 md:py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-4">
          <Flame className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-red-600">Trending Now</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Best Sellers
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 text-base">
          Explore our top-selling products that customers love.
        </p>
      </div>

      {bestSellerProducts.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8">
          {bestSellerProducts.map((product) => (
            <ProductItem
              key={product._id}
              id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              isBestSeller={true}
              averageRating={product.averageRating}
              totalRatings={product.totalRatings}
            />
          ))}
        </div>
      ) : (
        <div className="h-72 flex flex-col items-center justify-center w-full gap-4">
          <TrendingUp className="w-12 h-12 text-gray-300" />
          <p className="text-center text-gray-500">
            No best seller products available yet.
          </p>
        </div>
      )}
    </section>
  );
}

export default BestSeller;
