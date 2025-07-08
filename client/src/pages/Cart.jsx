import React, { useEffect, useState } from "react";
import { useShop } from "../contexts/ShopContext";
import { CartTotal, Title } from "../components";
import { assets } from "../assets/frontend_assets";
import { useNavigate } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa6";

function Cart() {
  const { products, currency, cartItems, updateCart } = useShop();
  const [cartData, setCartData] = useState([]);

  const navigate = useNavigate();

  const handleQuantityChange = (e, id, size) => {
    const qty = Number(e.target.value);

    if (!qty) {
      return null;
    }

    updateCart(id, size, qty);
  };

  useEffect(() => {
    let cartProducts = [];

    for (const product in cartItems) {
      for (const size in cartItems[product]) {
        if (cartItems[product][size]) {
          cartProducts.push({
            _id: product,
            size: size,
            quantity: cartItems[product][size],
          });
        }
      }
    }

    setCartData(cartProducts);
  }, [cartItems]);

  return (
    <>
      {cartData.length ? (
        <div className="border-t pt-14">
          <div className="text-2xl mb-3">
            <Title children1={"Your"} children2={"Cart"} />
          </div>

          <div>
            {cartData.map((item, index) => {
              const productData = products.find((p) => p._id === item._id);

              return (
                <div
                  key={index}
                  className="py-4 border-t border-b border-gray-400 text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4">
                  <div className="flex items-start gap-6">
                    <img
                      src={productData.image[0]}
                      alt="productImage"
                      className="w-16 sm:w-20"
                    />
                    <div>
                      <p className="text-sm sm:text-lg font-medium">{productData.name}</p>
                      <div className="flex items-center gap-5 mt-2">
                        <p>
                          {currency}
                          {productData.price}
                        </p>
                        <p className="px-2 sm:px-3 sm:py-1 border border-gray-300 bg-gray-50">
                          {item.size}
                        </p>
                      </div>
                    </div>
                  </div>

                  <input
                    type="number"
                    min={1}
                    defaultValue={item.quantity}
                    onChange={(e) => handleQuantityChange(e, item._id, item.size)}
                    className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 outline-none rounded-md"
                  />
                  <img
                    src={assets.bin_icon}
                    className="w-4 sm:w-5 mr-4 cursor-pointer"
                    alt="deleteProduct"
                    onClick={() => updateCart(item._id, item.size, 0)}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-end my-20">
            <div className="w-full sm:w-[450px]">
              <CartTotal />
              <div className="flex text-end float-end">
                <button
                  onClick={() => navigate("/place-order")}
                  className="bg-black text-white px-8 py-3 my-8 rounded-md cursor-pointer active:bg-gray-900">
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[90vh] flex items-center justify-center sm:flex-col">
          <div className="flex flex-col gap-8 items-center justify-center sm:flex-row">
            <div>
              <FaCartPlus className="w-20 h-20" />
            </div>  
            <div className="flex flex-col gap-4">
              <p className="text-3xl">Your Cart is Empty!!</p>
              <button className="btn btn-neutral" onClick={() => navigate("/collection")}>Continue Shopping</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Cart;
