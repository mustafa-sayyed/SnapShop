import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/frontend_assets";
import { useShop } from "../contexts/ShopContext";
import { Container, RelatedProducts, StarRating } from "../components";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";
import axios from "axios";

function Product() {
  const { productId } = useParams();
  const { products, currency, addToCart } = useShop();
  const [product, setProduct] = useState(null);
  const [currentImg, setCurrentImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [size, setSize] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [ratings, setRatings] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    if (products.length) {
      try {
        setLoading(false);
        const currentProduct = products.find((p) => p._id === productId);
        setProduct(currentProduct);
        setCurrentImg(currentProduct.image[0]);
        setSize(currentProduct.sizes[0]);

        fetchRatings(productId);
      } catch (error) {
        console.log("Error in Product: ", error);
        setLoading(false);
        setError("Product Not Found");
      }
    }
  }, [products, productId]);

  const fetchRatings = async (productId) => {
    try {
      const response = await axios.get(`${backendUrl}/products/${productId}/ratings`);
      if (response.data.success) {
        setRatings(response.data.ratings || []);
      }
    } catch (error) {
      console.log("Error fetching ratings:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[85vh] flex items-center justify-center ">
        <div className="animate-spin inline-block size-12 border-5 border-current border-t-transparent text-red-600 rounded-full">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-[85vh] flex items-center justify-center ">
        <div className="text-3xl text-red-600">{error}</div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      if (size) {
        await addToCart(product._id, size);
      } else {
        toast("Select the size first.", {
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
      const message = error?.response?.data?.message || "Internal Server Error";
      toast.error(message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      // Logic for Buy Now
    } catch (error) {
      console.log(error);
      const message = error?.response?.data?.message || "Internal Server Error";
      toast.error(message);
    } finally {
      setIsBuyingNow(false);
    }
  };

  return (
    <Container>
      {product && (
        <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
          <div className="flex gap-12 flex-col sm:flex-row">
            {/* Product Images */}
            <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3 ">
              <div className="flex sm:flex-col overflow-x-auto sm:overflow-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full no-scrollbar">
                {product.image.map((img, index) => (
                  <img
                    src={img}
                    key={index}
                    className="w-[24%] sm:w-full sm:mb-3 shrink-0 cursor-pointer"
                    onClick={() => setCurrentImg(img)}
                  />
                ))}
              </div>
              <div className="w-full sm:w-[80%]">
                <img src={currentImg} alt="productImage" className="w-full h-auto" />
              </div>
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h1 className="font-medium text-2xl mt-2">{product.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <StarRating rating={product.averageRating || 0} />
                <p className="text-gray-600">
                  ({product.totalRatings || 0}{" "}
                  {product.totalRatings === 1 ? "review" : "reviews"})
                </p>
              </div>
              <p className="font-medium text-2xl mt-5">
                {currency}
                {product.price}
              </p>
              <p className="mt-5 text-gray-500 md:w-4/5">{product.description}</p>
              <div className="flex flex-col gap-4 my-8">
                <p>Select Size: </p>
                <div className="flex gap-2">
                  {product.sizes.map((item, index) => (
                    <button
                      onClick={() => setSize(item)}
                      key={index}
                      className={`bg-gray-100 px-4 py-2 cursor-pointer rounded-md ${
                        size === item ? "border-2 border-gray-400" : ""
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 w-fit">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="cursor-pointer py-6 px-10"
                >
                  {isAddingToCart ?
                    <div className="flex items-center gap-2">
                      <Spinner />
                      Adding...
                    </div>
                  : "Add to Cart"}
                </Button>
              </div>
              <hr className="mt-8 sm:w-4/5" />
              <div className="text-sm mt-5 flex flex-col gap-1 text-gray-500">
                <p>100% Original Product.</p>
                <p>Cash on Delivery is available on this Product.</p>
                <p>Secure Payment through Razorpay.</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="mt-20">
            <div className="flex">
              <button
                className={`border text-sm px-5 py-3 border-gray-700 font-semibold`}
               
              >
                Reviews ({product.totalRatings || 0})
              </button>
            </div>

            {<div className="border-gray-300 border p-6">
                {ratings.length > 0 ?
                  <div className="space-y-4">
                    {/* Rating Summary */}
                    <div className="pb-4 border-b">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold">
                            Average Rating: {product.averageRating || 0}
                          </div>
                          <div className="flex items-center gap-2">
                            <StarRating rating={product.averageRating || 0} size="sm" />
                            <span className="text-sm text-gray-600">
                              ({product.totalRatings}{" "}
                              {product.totalRatings === 1 ? "review" : "reviews"})
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {ratings.map((rating, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{rating.userName}</h4>
                                <span className="text-xs text-gray-500">
                                  {new Date(rating.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )}
                                </span>
                              </div>
                              <StarRating rating={rating.rating} size="sm" />
                              {rating.review && (
                                <p className="mt-2 text-sm text-gray-700">
                                  {rating.review}
                                </p>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                : <div className="text-center py-8">
                    <p className="text-gray-500">
                      No reviews yet. Be the first to review this product!
                    </p>
                  </div>
                }
              </div>
            }
          </div>

          <div>
            <RelatedProducts
              category={product.category}
              subCategory={product.subCategory}
            />
          </div>
        </div>
      )}
    </Container>
  );
}

export default Product;
