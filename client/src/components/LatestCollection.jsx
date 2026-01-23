import React, { useEffect, useState } from "react";
import { ProductItem } from "./";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import axios from "axios";
import { Spinner } from "./ui/spinner";

function LatestCollection() {
  const [latestProducts, setLatestProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/products/latest`
        );
        if (response.data.success) {
          setLatestProducts(response.data.products);
        }
      } catch (error) {
        console.log(error);
        const message =
          error?.response?.data?.message || "Error while fetching latest products";
        console.log(message);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <section className="py-16 md:py-20">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 bg-red-100 px-4 py-2 rounded-full mb-4">
          <Sparkles className="w-4 h-4 text-red-500" />
          <span className="text-sm font-medium text-red-600">Just Arrived</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Latest Collection
        </h2>
        <p className="max-w-2xl mx-auto text-gray-600 text-base">
          Discover our newest arrivals featuring the latest trends in fashion.
        </p>
      </div>

      {latestProducts.length ? (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8">
            {latestProducts.map((product) => (
              <ProductItem
                key={product._id}
                id={product._id}
                image={product.image}
                name={product.name}
                price={product.price}
                isNew={true}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/collection"
              className="inline-flex items-center gap-2 bg-red-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors duration-200 group"
            >
              View All Collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </>
      ) : isLoadingProducts ? (
        <div className="flex items-center justify-center gap-3 py-20">
          <Spinner className="w-6 h-6" />
          <span className="text-gray-600 font-medium">Loading latest products...</span>
        </div>
      ) : (
        <div className="h-72 flex flex-col items-center justify-center w-full gap-4">
          <Sparkles className="w-12 h-12 text-gray-300" />
          <p className="text-center text-gray-500">
            No products available yet.
          </p>
        </div>
      )}
    </section>
  );
}

export default LatestCollection;
