import React from "react";
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
import { Footer, Navbar, SearchBar } from "./components";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "./contexts/UserContext";
import { useShop } from "./contexts/ShopContext";

function App() {
  const { setUserData, setAuthStatus } = useAuth();
  const {setCartItems} = useShop();
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
            setCartItems(response.data.user.cartData)
            setAuthStatus(true);
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    })();
  }, []);

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
        <Route path="/orders" element={<Orders />} />
        <Route path="/place-order" element={<PlaceOrder />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
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
