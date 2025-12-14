import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import {
  About,
  Cart,
  Collection,
  Contact,
  Forgotpassword,
  Home,
  Login,
  Orders,
  PlaceOrder,
  Product,
  Search,
  Signup,
} from "./pages";
import { AuthLayout, Footer, Navbar, Profile } from "./components";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "./contexts/UserContext";

function App() {
  const { login, clearUserDetails } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data.success) {
            login(response.data);
          }
        } else {
          clearUserDetails();
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(" Internal server Error");
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="loading loading-spinner w-10 h-10"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        <Route
          path="/profile"
          element={
            <AuthLayout authRequired={true}>
              <Profile />
            </AuthLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <AuthLayout authRequired={true}>
              <Orders />
            </AuthLayout>
          }
        />
      </Routes>
      <Footer />
      <ToastContainer
        autoClose={2000}
        closeOnClick={true}
        theme="light"
        position="bottom-right"
        limit={3}
      />
    </>
  );
}

export default App;
