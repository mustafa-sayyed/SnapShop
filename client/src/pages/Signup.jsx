import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/UserContext.jsx";
import { config } from "@/Config/config.js";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Spinner } from "@/components/ui/spinner.jsx";
import { GoogleLogin } from "@react-oauth/google";

function Signup() {
  const [name, setName] = useState("");
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
        toast.error(error.response.data?.message);
        Object.values(error.response.data?.errors).forEach((value) => {
          toast.error(value[0]);
        });
      } else {
        if (!navigator.onLine) toast.error(`Error while Login: ${error.message}`);
        else toast.error("Error while Login: Internal server Error");
      }
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentials) => {
    try {
      const response = await axios.post(`${config.backendUrl}/users/google`, {
        token: credentials.credential,
      });

      console.log(response);

      if (response.data.success) {
        toast.success(response.data.message);
        login(response.data);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.message || "Internal Server Error";
      toast.error(errorMessage);
    }
  };

  const handleGoogleLoginError = (error) => {
    console.log(error);
    toast.error("Google Login Failed");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center w-full h-[85vh] m-auto gap-4 text-gray-800 p-2"
    >
      <div className="border rounded-md px-4 py-3 md:px-10 md:py-6 w-full flex flex-col items-center justify-center max-w-md m-auto gap-4 text-gray-800">
        <div className="inline-flex items-center mb-3 mt-10 gap-2">
          <p className="text-4xl">Create Account</p>
        </div>

        <Input
          id="name"
          type="text"
          className="w-full px-3 py-2 border border-gray-800 rounded-md outline-black"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isCreatingAccount}
          required
        />

        <Input
          id="email"
          className="w-full px-3 py-2 border border-gray-800 rounded-md outline-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isCreatingAccount}
          required
        />

        <Input
          id="password"
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

          <p
            onClick={() => navigate("/login")}
            className="cursor-pointer hover:underline"
          >
            Login in you account
          </p>
        </div>
        <Button
          type="submit"
          disabled={isCreatingAccount}
          className="px-8 py-2.5 w-full mt-4 rounded-sm cursor-pointer active:bg-gray-900 bg-black text-white"
        >
          {isCreatingAccount ? (
            <div className="flex items-center gap-2">
              <Spinner />
              Creating Account...
            </div>
          ) : (
            "Create Account"
          )}
        </Button>

        <div className="w-full">
          <div className="flex items-center justify-center mb-4 w-full">
            <div className="h-[1.5px] w-20 bg-gray-400 mr-2"></div>
            <p className="text-gray-600">or continue with</p>
            <div className="h-[1.5px] w-20 bg-gray-400 ml-2"></div>
          </div>

          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={handleGoogleLoginError}
            ux_mode="popup"
            logo_alignment="center"
            shape="rectangular"
          />
        </div>
      </div>
    </form>
  );
}

export default Signup;
