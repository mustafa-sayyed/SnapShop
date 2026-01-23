import React, { useEffect, useMemo, useState } from "react";
import { useShop } from "../contexts/ShopContext";
import { assets } from "../assets/frontend_assets";
import { Container, ProductItem, Title } from "../components";

function Collection() {
  const { products } = useShop();
  const [loading, setLoading] = useState(false);

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
    <Container>
      <div className="flex pt-10 border-t">
        <div className="flex-1">
          <div className="flex justify-center text-base sm:text-2xl m-4">
            <Title children1={"All"} children2={"Collection"} />
          </div>

          {products.length ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 gap-y-6">
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
          ) : (
            <div className=" w-full text-xl text-red-500 text-center min-h-screen mt-10 ">
              No Products is Found
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

export default Collection;
