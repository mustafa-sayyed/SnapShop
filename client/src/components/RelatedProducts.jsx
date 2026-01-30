import React, { useEffect, useState } from "react";
import { useShop } from "../contexts/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProducts = React.memo(({ category, subCategory }) => {
  const { products } = useShop();
  const [relatedProducts, setRelatedProducts] = useState(null);

  useEffect(() => {
    setRelatedProducts(
      products
        .filter((p) => p.category === category)
        .filter((p) => p.subCategory === subCategory)
    );
  }, [category, subCategory]);

  return (
    relatedProducts && (
      <div className="my-24">
        <div className="text-center text-3xl py-2">
          <Title children1={"Related"} children2={"Products"} />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 mt-3">
            {relatedProducts.map((product) => (
              <ProductItem
                id={product._id}
                key={product._id}
                image={product.image}
                name={product.name}
                price={product.price}                averageRating={product.averageRating}
                totalRatings={product.totalRatings}              />
            ))}
          </div>

          {/* Scrollable Related Products */}
          {/* <div className="flex gap-4 overflow-x-auto flex-nowrap scroll-smooth scroll-snap-type-x mandatory scrollbar-thin scrollbar-thumb-rounded no-scrollbar">
            {relatedProducts.map((product) => (
              <ProductItem
                id={product._id}
                key={product._id}
                image={product.image}
                name={product.name}
                price={product.price}
                className={"w-[234px] flex-shrink-0"}
              />
            ))}
          </div> */}
        </div>
      </div>
    )
  );
});

export default RelatedProducts;
