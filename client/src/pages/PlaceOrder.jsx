import React, { useState } from "react";
import { CartTotal, Title } from "../components";
import { assets } from "../assets/frontend_assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useShop } from "../contexts/ShopContext";

function PlaceOrder() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
    phone: "",
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const { products, cartItems, deliveryFee, getCartAmount, setCartItems } = useShop();
  const navigate = useNavigate();

  const updateFormData = (name, value) => {
    const data = { ...formData };
    data[name] = value;
    setFormData(data);
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
    for (const keys in formData) {
      if (!formData[keys]) return toast.error("All Delivery Information is required.");
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
              address: formData,
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
              address: formData,
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
    <form
      onSubmit={handleCheckout}
      className="flex flex-col sm:flex-row gap-4 justify-between pt-5 sm:pt-14 min-h-[80vh] border-t">
      {/* left Side */}
      <div
        onSubmit={handleCheckout}
        className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title children1={"Delivery"} children2={"Information"} />
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="First Name"
            className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
            onChange={(e) => updateFormData("firstName", e.target.value)}
            value={formData.firstName}
          />
          <input
            type="text"
            placeholder="Last Name"
            className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
            onChange={(e) => updateFormData("lastName", e.target.value)}
            value={formData.lastName}
          />
        </div>
        <input
          type="email"
          placeholder="Email Address"
          className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
          onChange={(e) => updateFormData("email", e.target.value)}
          value={formData.email}
        />
        <input
          type="text"
          placeholder="Street"
          className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
          onChange={(e) => updateFormData("street", e.target.value)}
          value={formData.street}
        />
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Country"
            className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
            onChange={(e) => updateFormData("country", e.target.value)}
            value={formData.country}
          />
          <input
            type="text"
            placeholder="State"
            className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
            onChange={(e) => updateFormData("state", e.target.value)}
            value={formData.state}
          />
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="City"
            className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
            onChange={(e) => updateFormData("city", e.target.value)}
            value={formData.city}
          />
          <input
            type="number"
            placeholder="Zip Code"
            className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
            onChange={(e) => updateFormData("pincode", e.target.value)}
            value={formData.pincode}
          />
        </div>
        <input
          type="number"
          placeholder="Phone no"
          className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
          onChange={(e) => updateFormData("phone", e.target.value)}
          value={formData.phone}
        />
      </div>

      {/* Right Side */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title children1={"Payment"} children2={"Method"} />
          <div className="flex flex-col sm:flex-row gap-3">
            <div
              className="flex gap-3 border items-center p-2 px-3 cursor-pointer rounded-md border-gray-400"
              onClick={() => setPaymentMethod("stripe")}>
              <p
                className={`w-4 h-4 border-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center 
              ${paymentMethod === "stripe" ? "border-green-500" : "border-gray-400"}`}>
                {paymentMethod === "stripe" && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </p>
              <img src={assets.stripe_logo} alt="Strpe" className="h-4 mx-4" />
            </div>

            <div
              className="flex gap-3 border items-center p-2 px-3 cursor-pointer rounded-md border-gray-400"
              onClick={() => setPaymentMethod("razorpay")}>
              <p
                className={`w-4 h-4 border-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center 
              ${paymentMethod === "razorpay" ? "border-green-500" : "border-gray-400"}`}>
                {paymentMethod === "razorpay" && (
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                )}
              </p>
              <img src={assets.razorpay_logo} alt="Strpe" className="h-4 mx-4" />
            </div>

            <div
              className="flex gap-3 border items-center p-2 px-3 cursor-pointer rounded-md border-gray-400"
              onClick={() => setPaymentMethod("cod")}>
              <p
                className={`w-4 h-4 border-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center 
              ${paymentMethod === "cod" ? "border-green-500" : "border-gray-400"}`}>
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
              className="bg-black text-white px-16 py-3 rounded-md cursor-pointer active:bg-gray-900">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export default PlaceOrder;
