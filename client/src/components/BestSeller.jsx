import React, { useEffect, useState } from "react";
import { Title, ProductItem } from "./";
import { useShop } from "../contexts/ShopContext";

function BestSeller() {
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const { products } = useShop();

  useEffect(() => {
    setBestSellerProducts(
      products.filter((product) => product.bestSeller === true).slice(0, 5)
    );
    
  }, [products]);

  return (
    <div className="my-10">
      <div className="py-8 text-center text-3xl">
        <Title children1={"Best"} children2={"Sellers"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt dolorum ipsa
          inventore!
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {bestSellerProducts &&
          bestSellerProducts.map((product) => (
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
  );
}

export default BestSeller;
