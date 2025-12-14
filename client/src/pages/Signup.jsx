import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/UserContext.jsx";
import { config } from "@/Config/config.js";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Spinner } from "@/components/ui/spinner.jsx";

function Signup() {
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    setIsCreatingAccount(true);
    e.preventDefault();

    try {
      const response = await axios.post(`${config.backendUrl}/users/signup`, {
        name,
        email,
        password,
      });

      if (response.data.success) {
        toast.success(response.data.message);
        login(response.data);
        navigate("/");
      } else {
        toast.error(response.data?.message);
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        if (!navigator.onLine) toast.error(`Error while Login: ${error.message}`);
        else toast.error("Error while Login: Internal server Error");
      }
    } finally {
      setIsCreatingAccount(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center w-[90%] max-w-96 h-[85vh] m-auto gap-4 text-gray-800">
      <div className="inline-flex items-center mb-2 mt-10 gap-2">
        <p className="prata text-4xl">Create Account</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <Input
        type="text"
        className="w-full px-3 py-2 border border-gray-800 rounded-md outline-black"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        disabled={isCreatingAccount}
        required
      />
      <Input
        type="tel"
        className="w-full px-3 py-2 border border-gray-800 rounded-md outline-black"
        placeholder="Phone No"
        value={phoneNo}
        onChange={(e) => setPhoneNo(Number(e.target.value))}
        disabled={isCreatingAccount}
        required
      />
      <Input
        type="email"
        className="w-full px-3 py-2 border border-gray-800 rounded-md outline-black"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isCreatingAccount}
        required
      />

      <Input
        type="password"
        className="w-full px-3 py-2 border border-gray-800 rounded-md outline-black"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isCreatingAccount}
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <Link to={"/forgot-password"}>
          <p className="cursor-pointer hover:underline">Forgot your password ?</p>
        </Link>

        <p onClick={() => navigate("/login")} className="cursor-pointer hover:underline">
          Login in you account
        </p>
      </div>
      <Button
        type="submit"
        disabled={isCreatingAccount}
        className="px-8 py-2.5 mt-4 rounded-sm cursor-pointer active:bg-gray-900 bg-black text-white">
          {isCreatingAccount ? (
            <div className="flex items-center gap-2">
              <Spinner />
              Creating Account...
            </div>
          ) : "Create Account"}
        </Button>
    </form>
  );
}

export default Signup;
