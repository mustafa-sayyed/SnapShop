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
  const [selectedAddress, setSelectedAddress] = useState(
    userData?.defaultAddress ?? null
  );
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const { products, cartItems, deliveryFee, getCartAmount, setCartItems } = useShop();
  const navigate = useNavigate();

  const handleRazorpayPaymentVerification = async (response) => {
    try {
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
        setCartItems({});
        navigate("/orders");
      }
    } catch (error) {
      console.log(error);
      if (error?.response?.data?.errors) {
        Object.values(error.response.data.errors).forEach((err) => {
          toast.error(err[0]);
        });
        return;
      }
      const messsage = error?.response?.data?.message || "Payment Verification Failed";
      toast.error(messsage);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Order Payment",
      description: "pay for your order",
      order_id: order.id,
      receipt: order.receipt,
      handler: handleRazorpayPaymentVerification,
      prefill: {
        name: userData?.defaultAddress?.name || "",
        email: userData?.defaultAddress?.email || "",
        contact: userData?.defaultAddress?.phone || "",
      }
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();

    razorpay.on("payment.failed", function (response) {
      toast.error("Payment Failed. Please try again.");
      console.log(response);
      
      razorpay.close();
    });
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

    async function handleCashOnDelivery() {
      try {
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
      } catch (error) {
        console.log(error);
        const messsage = error?.response?.data?.message || "Internal Server Error";
        toast.error(messsage);
      }
    }

    async function handleRazorpay() {
      try {
        const razorpayResponse = await axios.post(
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

        if (razorpayResponse.data.success) {
          initPay(razorpayResponse.data.order);
        } else {
          toast.error(razorpayResponse.data.message);
        }
      } catch (error) {
        console.log(error);
        const messsage = error?.response?.data?.message || "Internal Server Error";
        toast.error(messsage);
      }
    }

    switch (paymentMethod) {
      case "cod":
        handleCashOnDelivery();
        break;
      case "razorpay":
        handleRazorpay();
        break;
    }
  };

  return (
    <Container>
      <form
        onSubmit={handleCheckout}
        className="flex flex-col sm:flex-row gap-4 justify-between pt-5 sm:pt-14 min-h-[90vh] border-t"
      >
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
                <p className="text-gray-500">No Default Address Found</p>
              </div>
            )}
          </div>
        </div>

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
                <img src={assets.razorpay_logo} alt="Razorpay" className="h-4 mx-4" />
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
