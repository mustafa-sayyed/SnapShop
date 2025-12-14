import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/UserContext.jsx";
import { config } from "@/Config/config.js";
import { Spinner } from "@/components/ui/spinner.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Button } from "@/components/ui/button.jsx";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogining, setIsLogining] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLogining(true);

    try {
      const response = await axios.post(`${config.backendUrl}/users/signin`, {
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
      setIsLogining(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center w-[90%] max-w-96 h-[85vh] m-auto gap-4 text-gray-800">
      <div className="inline-flex items-center mb-2 mt-10 gap-2">
        <p className="prata text-4xl">Login</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <Input
        type="email"
        className="w-full px-3 py-2 border border-gray-800 rounded-md outline-black"
        placeholder="Email"
        value={email}
        disabled={isLogining}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <Input
        type="password"
        className="w-full px-3 py-2 border border-gray-800 rounded-md outline-black"
        placeholder="Password"
        value={password}
        disabled={isLogining}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <Link to={"/forgot-password"}>
          <p className="cursor-pointer hover:underline">Forgot your password ?</p>
        </Link>
        <p onClick={() => navigate("/signup")} className="cursor-pointer hover:underline">
          Create account
        </p>
      </div>
      <Button
        type="submit"
        disabled={isLogining}
        className="px-8 py-2.5 mt-4 rounded-sm cursor-pointer active:bg-gray-900 bg-black text-white">
          {isLogining ? (
            <div className="flex items-center gap-2">
              <Spinner />
              Logining...
            </div>
          ) : "Login"}
        </Button>
    </form>
  );
}

export default Login;
