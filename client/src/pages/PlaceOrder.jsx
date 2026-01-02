import React, { useState } from "react";
import { CartTotal, Container, Title } from "../components";
import { assets } from "../assets/frontend_assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useShop } from "../contexts/ShopContext";
import { useAuth } from "../contexts/UserContext";
import { Phone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

function PlaceOrder() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const { userData } = useAuth();
  const [selectedAddress, setSelectedAddress] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const { products, cartItems, deliveryFee, getCartAmount, setCartItems } = useShop();
  const navigate = useNavigate();

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "pay for your order",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        const { data } = await axios.post(
          `${backendUrl}/orders/razorpay/verify`,
          {
            razorpay_order_id: response.razorpay_order_id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (data.success) {
          toast.success(data.message);
          setCartItems({});
          navigate("/orders");
        } else {
          toast.error(data.message);
        }
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!selectedAddress) {
      return toast.error("Please, Select an Address.");
    }

    const orderItems = [];

    for (const product in cartItems) {
      for (const item in cartItems[product]) {
        if (cartItems[product][item] > 0) {
          const productInfo = structuredClone(products.find((p) => p._id === product));

          if (productInfo) {
            productInfo.size = item;
            productInfo.quantity = cartItems[product][item];
            orderItems.push(productInfo);
          }
        }
      }
    }

    try {
      switch (paymentMethod) {
        case "cod":
          const response = await axios.post(
            `${backendUrl}/orders`,
            {
              address: selectedAddress,
              items: orderItems,
              amount: getCartAmount() + deliveryFee,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data.success) {
            toast.success(response.data.message);
            setCartItems({});
            navigate("/orders");
          }

          break;
        case "razorpay":
          const responseRazorpay = await axios.post(
            `${backendUrl}/orders/razorpay`,
            {
              address: selectedAddress,
              items: orderItems,
              amount: getCartAmount() + deliveryFee,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (responseRazorpay.data.success) {
            initPay(responseRazorpay.data.order);
          } else {
            console.log(error);
            toast.error(responseRazorpay.data.message);
          }

          break;
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(`Server Error: ${error.message}`);
      }
    }
  };

  return (
    <Container>
      <form
        onSubmit={handleCheckout}
        className="flex flex-col sm:flex-row gap-4 justify-between pt-5 sm:pt-14 min-h-[90vh] border-t"
      >
        {/* left Side */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 ">
            <Button
              className="cursor-pointer w-auto"
              type="button"
              onClick={() => navigate("/profile?add=true")}
            >
              <Plus /> Add Address
            </Button>
            <Button
              className="cursor-pointer w-auto"
              type="button"
              onClick={() => navigate("/profile?change=true")}
            >
              Change Default Address
            </Button>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Default Address:</h2>
            {userData?.defaultAddress ? (
              <div className="card border px-4 sm:px-6 py-5 rounded-lg bg-slate-50 max-w-md">
                <div className="space-y-2 text-sm sm:text-base">
                  <p className="font-semibold text-gray-900">
                    {userData.defaultAddress.name}
                  </p>
                  <p>{userData.defaultAddress.email}</p>
                  <p>{userData.defaultAddress.address}</p>
                  <p>
                    {userData.defaultAddress.city}, {userData.defaultAddress.state} -{" "}
                    {userData.defaultAddress.pincode}
                  </p>
                  <p>{userData.defaultAddress.country}</p>
                  <p className="flex items-center gap-2">
                    <Phone size={20} />
                    {userData.defaultAddress.phone}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                <p className="text-gray-500">No default address set</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="mt-8">
          <div className="mt-8 min-w-80">
            <CartTotal />
          </div>

          <div className="mt-12">
            <div className="text-xl">
              <Title children1={"Payment"} children2={"Method"} />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div
                className="flex gap-3 border items-center p-2 px-3 cursor-pointer rounded-md border-gray-400"
                onClick={() => setPaymentMethod("razorpay")}
              >
                <p
                  className={`w-4 h-4 border-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center 
              ${paymentMethod === "razorpay" ? "border-green-500" : "border-gray-400"}`}
                >
                  {paymentMethod === "razorpay" && (
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </p>
                <img src={assets.razorpay_logo} alt="Strpe" className="h-4 mx-4" />
              </div>

              <div
                className="flex gap-3 border items-center p-2 px-3 cursor-pointer rounded-md border-gray-400"
                onClick={() => setPaymentMethod("cod")}
              >
                <p
                  className={`w-4 h-4 border-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center 
              ${paymentMethod === "cod" ? "border-green-500" : "border-gray-400"}`}
                >
                  {paymentMethod === "cod" && (
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </p>
                <p className="text-gray-500 text-sm font-medium mx-4">Cash on Delivery</p>
              </div>
            </div>

            <div className="w-full mt-8 text-end">
              <button
                type="submit"
                className="bg-black text-white px-16 py-3 rounded-md cursor-pointer active:bg-gray-900"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </form>
    </Container>
  );
}

export default PlaceOrder;
