import { Container, ProductItem } from "@/components";
import { Input } from "@/components/ui/input";
import { useShop } from "@/contexts/ShopContext";
import React, { useEffect, useMemo, useState } from "react";

function Search() {
  const { products } = useShop();
  const [searchResults, setSearchResults] = useState([]);
  const [searchString, setsearchString] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setSearching(true);
    if (searchString == "") {
      setSearchResults([]);
    }

    if (searchString == "" || !products || !products.length) {
      return;
    }

    setSearchResults([]);
    let result = [];
    let patteren = new RegExp(searchString, "gi");

    for (const product of products) {
      const productName = product.name;

      if (patteren.test(productName)) {
        result.push(product);
      }
    }

    setSearchResults(result);
    setSearching(false);
  }, [searchString, products]);

  return (
    <Container>
      <div className="min-h-screen w-full">
        <div className="w-full max-w-5xl m-auto mt-10">
          <Input
            type="text"
            placeholder="Search what you want..."
            className="border-2 p-5 text-lg"
            onChange={(e) => setsearchString(e.target.value)}
          />

          {products && !searchString ? (
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
          ) : searchString && searchResults.length ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-14">
              {searchResults.map((product) => (
                <ProductItem
                  key={product._id}
                  id={product._id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                />
              ))}
            </div>
          ) : searchString && searching ? (
            <div className="w-full min-h-screen flex items-center justify-center ">
              <div className="animate-spin inline-block size-12 border-5 border-current border-t-transparent rounded-full">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="w-full text-xl text-red-500 text-center min-h-screen mt-10 ">
              No Products is Found
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

export default Search;
