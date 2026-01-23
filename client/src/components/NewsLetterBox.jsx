import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import { Spinner } from "./ui/spinner";
import { Mail, Sparkles, ArrowRight, Check } from "lucide-react";

function NewsLetterBox() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setIsSubscribing(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/subscribers`,
        {
          email,
        }
      );

      if (response.data.success) {
        const message = response.data?.message || "Subscribed to email successfully";
        toast.success(message);
        setEmail("");
        setIsSubscribed(true);
        setTimeout(() => setIsSubscribed(false), 3000);
      }
    } catch (error) {
      console.log(error);
      const message = error?.response?.data?.message || "Internal Server Error";
      toast.error(message);
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="text-center p-2 py-32">
      <p className="sm:text-2xl text-xl text-gray-800 font-medium">
        Subscribe to our Exclusive Offers
      </p>
      <p className="text-gray-400 mt-3">
        Stay updated with exclusive deals, new arrivals, and special promotions!
      </p>
      <form
        onSubmit={onSubmitHandler}
        className="max-w-lg flex flex-col sm:flex-row items-center gap-3 mx-auto my-6"
      >
        <div></div>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-5"
          placeholder="Enter your Email"
          disabled={isSubscribing}
          required
        />

        <Button
          disabled={isSubscribing || isSubscribed}
          className={`w-full cursor-pointer sm:w-auto px-8 py-5 font-semibold transition-all duration-300 ${
            isSubscribed
              ? "bg-green-500 hover:bg-green-500"
              : "hover:shadow-lg hover:shadow-white/25"
          }`}
        >
          {isSubscribing ? (
            <div className="flex items-center gap-2">
              <Spinner className="w-4 h-4" />
              Subscribing...
            </div>
          ) : isSubscribed ? (
            <div className="flex items-center gap-2 text-white">
              <Check className="w-4 h-4" />
              Subscribed!
            </div>
          ) : (
            <div className="flex items-center gap-2">
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </div>
          )}
        </Button>
      </form>

      <p className="text-gray-500 text-xs mt-4">
        By subscribing, you agree to receive marketing emails. Unsubscribe anytime.
      </p>
    </div>
  );
}

export default NewsLetterBox;
