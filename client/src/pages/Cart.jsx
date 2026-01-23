import React, { useEffect, useState, useCallback } from "react";
import { useShop } from "../contexts/ShopContext";
import { CartTotal, Container, Title } from "../components";
import { useNavigate } from "react-router-dom";
import { FaCartPlus } from "react-icons/fa6";
import { useAuth } from "@/contexts/UserContext";
import { Spinner } from "@/components/ui/spinner";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function Cart() {
  const { currency, cartItems, updateCart, getCartData, getCartDetailsFromLocal, products } = useShop();
  const [cartProductDetails, setCartProductDetails] = useState([]);
  const { authStatus } = useAuth();
  const [isCartLoading, setIsCartLoading] = useState(true);

  const navigate = useNavigate();

  const loadCartDetails = useCallback(async () => {
    setIsCartLoading(true);
    
    if (authStatus) {
      // Authenticated user - fetch from backend
      const data = await getCartData();
      setCartProductDetails(data || []);
    } else {
      // Non-authenticated user - get from local storage
      const localCartDetails = getCartDetailsFromLocal();
      setCartProductDetails(localCartDetails);
    }
    
    setIsCartLoading(false);
  }, [authStatus, getCartData, getCartDetailsFromLocal]);

  useEffect(() => {
    loadCartDetails();
  }, [cartItems, authStatus, products, loadCartDetails]);

  if (isCartLoading) {
    return (
      <div className="h-[70vh] flex items-center justify-center gap-2">
        <Spinner />
        <p>Loading Cart...</p>
      </div>
    );
  }

  return (
    <Container>
      {cartProductDetails.length ? (
        <div className="border-t pt-14">
          <div className="text-2xl mb-3">
            <Title children1={"Your"} children2={"Cart"} />
          </div>

          <div>
            {cartProductDetails.map((item, index) => {
              return (
                <div
                  key={index}
                  className="py-4 border-t border-b border-gray-400 text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
                >
                  <div className="flex items-start gap-6">
                    <img
                      src={item.image[0]}
                      alt="productImage"
                      className="w-16 sm:w-20"
                    />
                    <div>
                      <p className="text-sm sm:text-lg font-medium">{item.name}</p>
                      <div className="flex items-center gap-5 mt-2">
                        <p>
                          {currency}
                          {item.price}
                        </p>
                        <p className="px-2 sm:px-3 sm:py-1 border border-gray-300 bg-gray-50">
                          {item.size}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-fit items-center border border-gray-300 rounded-md">
                    <Button
                      variant="ghost"
                      onClick={() =>
                        item.quantity > 1 &&
                        updateCart(item._id, item.size, item.quantity - 1)
                      }
                      className="px-2 sm:px-3 py-1 text-lg font-medium hover:bg-gray-100 rounded-l-md cursor-pointer"
                    >
                      <Minus />
                    </Button>
                    <span className="px-2 sm:px-4 py-1 border-x border-gray-300">
                      {item.quantity}
                    </span>
                    <Button
                    variant="ghost"
                      onClick={() => updateCart(item._id, item.size, item.quantity + 1)}
                      className="px-2 sm:px-3 py-1 text-lg font-medium hover:bg-gray-100 rounded-r-md cursor-pointer"
                    >
                      <Plus />
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="ml-auto cursor-pointer"
                    onClick={() => updateCart(item._id, item.size, 0)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end my-20">
            <div className="w-full sm:w-[450px]">
              <CartTotal />
              <div className="flex text-end float-end">
                {authStatus ? (
                  <button
                    onClick={() => navigate("/place-order")}
                    className="bg-black text-white px-8 py-3 my-8 rounded-md cursor-pointer active:bg-gray-900"
                  >
                    Proceed to Checkout
                  </button>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-black text-white px-8 py-3 my-8 rounded-md cursor-pointer active:bg-gray-900"
                  >
                    Login to Checkout
                  </button>
                )}
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
              <button className="btn btn-neutral" onClick={() => navigate("/collection")}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default Cart;
