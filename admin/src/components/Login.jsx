import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/userContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const displayError = (msg) => {
      toast(msg, {
        type: "error",
      });
    };

    if (!email || !password) {
      return displayError("All fields are required.");
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const res = await axios.post(`${backendUrl}/users/admin/signin`, {
        email,
        password,
      });

      const token = res.data.token;

      localStorage.setItem("token", token);

      login(res.data.user);

      toast(res.data.message, {
        type: "success",
      });

      navigate("/");
    } catch (error) {
      console.log("Error while login:", error.message);
      if (error.response) {
        displayError(error.response.data.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="bg-white shadow-md rounded-lg px-9 py-8 max-w-md">
        <h1 className="font-bold mb-4 text-4xl text-center">Admin Panel</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Email Address</p>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full rounded-md px-3 py-2 border border-gray-400 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-md px-3 py-2 border border-gray-400 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button className="px-8 py-2 rounded-md bg-black text-white w-full mt-3 cursor-pointer">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
