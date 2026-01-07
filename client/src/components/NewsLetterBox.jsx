import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "react-toastify";
import { Spinner } from "./ui/spinner";

function NewsLetterBox() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

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
        className="w-full sm:w-1/2 flex flex-col sm:flex-row items-center gap-3 mx-auto my-6"
      >
        <div></div>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-5 outline-none bg-gray-100 w-full rounded-md"
          placeholder="Enter your Email"
          disabled={isSubscribing}
          required
        />

        <Button
          disabled={isSubscribing}
          className="sm:flex-1 bg-black text-white text-sm p-5 px-8 rounded-md cursor-pointer active:bg-gray-900"
        >
          {isSubscribing ? (
            <div className="flex items-center gap-2">
              <Spinner />
              subscribing...
            </div>
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
    </div>
  );
}

export default NewsLetterBox;
