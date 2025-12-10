import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/UserContext.jsx";

function Login() {
  const [currentState, setCurrentState] = useState("Login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { login, setAddress } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (currentState === "Sign Up") {
        const response = await axios.post(`${backendUrl}/users/signup`, {
          name,
          email,
          password,
        });

        if (response.data.success) {
          toast.success(response.data.message);
          login(response.data.user, response.data.token);
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(`${backendUrl}/users/signin`, {
          email,
          password,
        });

        if (response.data.success) {
          toast.success(response.data.message);
          login(response.data.user, response.data.token);
          setAddress(response.data.address)
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        if(!navigator.onLine)
        toast.error(`Error while Login: ${error.message}`);
        else
          toast.error("Error while Login: Internal server Error")
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center w-[90%] max-w-96 h-[85vh] m-auto gap-4 text-gray-800">
      <div className="inline-flex items-center mb-2 mt-10 gap-2">
        <p className="prata text-4xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === "Sign Up" && (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800 rounded-md outline-black"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800 rounded-md outline-black"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800 rounded-md outline-black"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <Link to={"/forgor-password"}>
          <p className="cursor-pointer hover:underline">Forgot your password ?</p>
        </Link>
        {currentState === "Login" ? (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer hover:underline">
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer hover:underline">
            Login in you account
          </p>
        )}
      </div>
      <button
        type="submit"
        className="px-8 py-2.5 mt-4 rounded-sm cursor-pointer active:bg-gray-900 bg-black text-white">
        {currentState === "Login" ? "Sign In" : "Sign Up"}
      </button>
    </form>
  );
}

export default Login;
