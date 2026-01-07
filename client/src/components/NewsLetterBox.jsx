import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "react-toastify";

function NewsLetterBox() {
  const [email, setEmail] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/users/subscribe`,
        {
          email,
        }
      );

      if (response.data.success) {
        toast.success("Subscribed to ");
      }
    } catch (error) {
      console.log(error);
      const message = error?.response?.data?.message || "Internal Server Error";
      toast.error(message);
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
          required
        />
        <Button className="sm:flex-1 bg-black text-white text-sm p-5 px-8 rounded-md cursor-pointer active:bg-gray-900">
          Subscribe
        </Button>
      </form>
    </div>
  );
}

export default NewsLetterBox;
