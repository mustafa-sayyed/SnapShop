import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}
import {
  About,
  Cart,
  Collection,
  Contact,
  Forgotpassword,
  Home,
  Login,
  NotFound,
  Orders,
  PlaceOrder,
  Product,
  ResetPassword,
  Search,
  Signup,
  Unsubscribe,
} from "./pages";
import { AuthLayout, Footer, Navbar, Profile } from "./components";
import { toast, ToastContainer } from "react-toastify";

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
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<Forgotpassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/search" element={<Search />} />
        <Route path="/unsubscribe" element={<Unsubscribe />} />
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
        <Route path="*" element={<NotFound />} />
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
