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
import { Spinner } from "@/components/ui/spinner";

function PlaceOrder() {
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const { getCartData } = useShop();
  const { userData } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const { deliveryFee, getCartAmount, setCartItems } = useShop();
  const navigate = useNavigate();
  const POLL_INTERVAL = 3000;
  const MAX_RETRIES = 20;

  const pollOrderStatus = async (orderId, pollAttempts = 0) => {
    try {
      if (pollAttempts >= MAX_RETRIES) {
        setIsVerifyingPayment(false);
        toast.info("Payment verification is taking longer than expected. Please check your orders page.");
        navigate("/orders");
        return;
      }

      const response = await axios.get(`${backendUrl}/orders/verify/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        const paymentStatus = response.data.paymentStatus;
        
        if (paymentStatus === "completed") {
          setIsVerifyingPayment(false);
          toast.success("Payment Successful! Your order has been placed.");
          setCartItems({});
          navigate("/orders");
          return;
        } else if (paymentStatus === "failed") {
          setIsVerifyingPayment(false);
          toast.error("Payment Failed! Please try placing the order again.");
          navigate("/orders");
          return;
        } else {
          setTimeout(() => pollOrderStatus(orderId, pollAttempts + 1), POLL_INTERVAL);
        }
      }
    } catch (error) {
      console.log(error);
      setIsVerifyingPayment(false);
      toast.error("Error verifying payment. Please check your orders page.");
      navigate("/orders");
    }
  };

  const handleRazorpayPaymentVerification = (orderId) => async (response) => {
    try {
      setIsVerifyingPayment(true);
      
      const verifyResponse = await axios.post(
        `${backendUrl}/orders/razorpay/verify`,
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (verifyResponse.data.success) {
        setIsVerifyingPayment(false);
        toast.success("Payment Successful! Your order has been placed.");
        setCartItems({});
        navigate("/orders");
      }
    } catch (error) {
      console.log('Error while verifying payment:', error);
      await pollOrderStatus(orderId);
    }
  };

  const initPay = (order) => {
    console.log(order);
    
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "SnapShop",
      description: `Pay ${order.amount / 100} of your order`,
      order_id: order.id,
      notes: { orderId: order.notes.orderId },
      handler: handleRazorpayPaymentVerification(order.notes.orderId),
      prefill: {
        name: userData?.defaultAddress?.name || "",
        email: userData?.defaultAddress?.email || "",
        contact: userData?.defaultAddress?.phone || "",
      },
      modal: {
        ondismiss: function () {
          toast.error("Payment Failed, You closed the payment window.", {
            position: "top-right",
            autoClose: 5000,
            style: {
              border: "1px solid #ccc",
              padding: "15px",
            },
          });
        },
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();

    razorpay.on("payment.failed", function (response) {
      toast.error("Payment Failed. Please try again.", {
        style: { zIndex: 9999 },
      });
      razorpay.close();
    });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsPaymentProcessing(true);

    const address = userData?.defaultAddress;

    if (!address) {
      return toast.error("Please, Add an Address.");
    }

    const orderItems = await getCartData();

    async function handleCashOnDelivery() {
      try {
        setIsPaymentProcessing(true);
        const response = await axios.post(
          `${backendUrl}/orders`,
          {
            address: address,
            items: orderItems,
            amount: getCartAmount() + deliveryFee,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
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
      } finally {
        setIsPaymentProcessing(false);
      }
    }

    async function handleRazorpay() {
      try {
        setIsPaymentProcessing(true);
        const razorpayResponse = await axios.post(
          `${backendUrl}/orders/razorpay`,
          {
            address: address,
            items: orderItems,
            amount: getCartAmount() + deliveryFee,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
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
      } finally {
        setIsPaymentProcessing(false);
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

  const handlePaymentOptionClick = (method) => {
    if (!isPaymentProcessing || !isVerifyingPayment) {
      setPaymentMethod(method);
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
            {userData?.defaultAddress ?
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
            : <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                <p className="text-gray-500">No Default Address Found</p>
              </div>
            }
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
                onClick={() => handlePaymentOptionClick("razorpay")}
              >
                <p
                  className={`w-4 h-4 border-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${paymentMethod === "razorpay" ? "border-green-500" : "border-gray-400"}`}
                >
                  {paymentMethod === "razorpay" && (
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </p>
                <img src={assets.razorpay_logo} alt="Razorpay" className="h-4" />
              </div>

              <div
                className="flex gap-3 border items-center p-2 px-3 cursor-pointer rounded-md border-gray-400"
                onClick={() => handlePaymentOptionClick("cod")}
              >
                <p
                  className={`w-4 h-4 border-2 rounded-full transition-all duration-200 cursor-pointer flex items-center justify-center ${paymentMethod === "cod" ? "border-green-500" : "border-gray-400"}`}
                >
                  {paymentMethod === "cod" && (
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  )}
                </p>
                <p className="text-gray-500 text-sm font-medium">Cash on Delivery</p>
              </div>
            </div>

            <div className="w-full mt-8 text-end">
              {getCartAmount() <= 0 ?
                <Button
                  className="px-16 py-6 rounded-md cursor-pointer"
                  onClick={() => navigate("/collection")}
                  type="button"
                >
                  Add Items in Cart to Place Order
                </Button>
              : <Button
                  type="submit"
                  className=" px-16 py-6 rounded-md cursor-pointer"
                  disabled={isPaymentProcessing || isVerifyingPayment}
                >
                  {isPaymentProcessing ?
                    <div className="flex items-center gap-2">
                      <Spinner />
                      <span>Processing Payment...</span>
                    </div>
                  : isVerifyingPayment ?
                    <div className="flex items-center gap-2">
                      <Spinner />
                      <span>Verifying Payment...</span>
                    </div>
                  : "Place Order"}
                </Button>
              }
            </div>
          </div>
        </div>
      </form>
    </Container>
  );
}

export default PlaceOrder;
