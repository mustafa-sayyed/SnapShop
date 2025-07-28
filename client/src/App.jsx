import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  About,
  Cart,
  Collection,
  Contact,
  Home,
  Login,
  Orders,
  PlaceOrder,
  Product,
  Signup,
} from "./pages";
import { AuthLayout, Footer, Navbar, Profile, SearchBar } from "./components";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "./contexts/UserContext";
import { useShop } from "./contexts/ShopContext";

function App() {
  const { setUserData, setAuthStatus, setAddress } = useAuth();
  const { setCartItems } = useShop();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

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
            setUserData(response.data.user);
            setCartItems(response.data.user.cartData);
            setAddress(response.data.address || []);
            setAuthStatus(true);
          }
        } else {
          localStorage.removeItem("token");
          setAuthStatus(false);
        }
      } catch (error) {
        toast.error("Internal Server Error");
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
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/profile"
          element={
            <AuthLayout authRequired={true} >
              <Profile />
            </AuthLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <AuthLayout authRequired={true} >
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
      />
    </div>
  );
}

export default App;
