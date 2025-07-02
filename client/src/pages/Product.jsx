import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/frontend_assets";
import { useShop } from "../contexts/ShopContext";
import { RelatedProducts } from "../components";
import { ToastContainer, toast } from "react-toastify";

function Product() {
  const { productId } = useParams();
  const { products, currency, addToCart } = useShop();
  const [product, setProduct] = useState(null);
  const [currentImg, setCurrentImg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [size, setSize] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      try {
        setLoading(false);
        const currentProduct = products.find((p) => p._id === productId);
        setProduct(currentProduct);
        setCurrentImg(currentProduct.image[0]);
      } catch (error) {
        setError("Product Not Found");
      }
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center ">
        <div className="animate-spin inline-block size-12 border-5 border-current border-t-transparent text-red-600 rounded-full">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center ">
        <div className="text-3xl text-red-600">{error}</div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (size) {
      addToCart(product._id, size);
    } else {
      toast("Select the size first.", {
        type: "error",
      });
    }
  };

  return (
    product && (
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
            <div className="flex items-center gap-1 mt-2">
              <img src={assets.star_icon} alt="" className="w-4" />
              <img src={assets.star_icon} alt="" className="w-4" />
              <img src={assets.star_icon} alt="" className="w-4" />
              <img src={assets.star_icon} alt="" className="w-4" />
              <img src={assets.star_dull_icon} alt="" className="w-4" />
              <p className="pl-2">(122)</p>
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
                      size === item ? "border-2" : ""
                    }`}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4 w-fit">
              <button
                onClick={handleAddToCart}
                className="bg-black text-white px-8 py-3 text-sm active:bg-gray-900 rounded-lg cursor-pointer ">
                Add to Cart
              </button>
              <button className="bg-red-500 text-white px-8 py-3 text-sm active:bg-red-400 rounded-lg cursor-pointer">
                Buy Now
              </button>
            </div>
            <hr className="mt-8 sm:w-4/5" />
            <div className="text-sm mt-5 flex flex-col gap-1 text-gray-500">
              <p>100% Original Product.</p>
              <p>Cash on Delivery is available on this Product.</p>
              <p>Easy Retrun and Exchange policy within 7 Days.</p>
            </div>
          </div>
        </div>

        {/* Description and Reviews Section */}
        <div className="mt-20">
          <div className="flex">
            <b className="border border-gray-300 text-sm px-5 py-3">Description</b>
            <p className="border border-gray-300 text-sm px-5 py-3">Reviews (122)</p>
          </div>
          <div className="flex flex-col gap-4 border-gray-300 text-sm border p-6">
            <p>
              An e-commerce website is an online platform that facilitates the buying and
              selling of products or services over the internet. It serves as a virtual
              marketplace where businesses and individuals can showcase their products,
              interact with customers, and conduct transactions without the need for a
              physical presence. E-commerce websites have gained immense popularity due to
              their convenience, accessibility, and the global reach they offer.
            </p>
            <p>
              E-commerce websites typically display products or services along with
              detailed descriptions, images, prices, and any available variations (e.g.,
              sizes, colors). Each product usually has its own dedicated page with
              relevant information.
            </p>
          </div>
        </div>

        <div>
          <RelatedProducts
            category={product.category}
            subCategory={product.subCategory}
          />
        </div>
      </div>
    )
  );
}

export default Product;
