import { Navbar, ProductItem } from "@/components";
import { Input } from "@/components/ui/input";
import { useShop } from "@/contexts/ShopContext";
import React from "react";

function Search() {
  const { products } = useShop();

  return (
    <div className="min-h-screen w-full">
      <div className="w-full max-w-5xl m-auto mt-10">
        <Input
          type="text"
          placeholder="Search what you want..."
          className="border-2 p-5 text-lg"
        />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-14">
          {products.map((product) => (
            <ProductItem
              key={product._id}
              id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Search;
