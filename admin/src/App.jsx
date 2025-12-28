import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Add, List, Orders, Home, Banners, Login, NotFound } from "./pages";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "./context/userContext";
import axios from "axios";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthLayout from "./layouts/AuthLayout";
export const currency = "$";

function App() {
  const [loading, setLoading] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          console.log(res);
          return res.data.user;
        })
        .then((user) => {
          login({ name: user.name, email: user.email, role: user.role });
        })
        .catch((error) => {
          localStorage.removeItem("token");
          toast("Error, Login Again.", {
            type: "warning",
          });
          navigate("/login");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      navigate("/login");
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center ">
        <div className="animate-spin inline-block size-14 border-5 border-current border-t-transparent text-red-600 rounded-full">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to={"/dashboard/home"} replace />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route path="home" index={true} element={<Home />} />
          <Route path="banners" element={<Banners />} />
          <Route path="add" element={<Add />} />
          <Route path="list" element={<List />} />
          <Route path="orders" element={<Orders />} />
        </Route>
        <Route
          path="/login"
          element={
            <AuthLayout authentication={false}>
              <Login />
            </AuthLayout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <ToastContainer
        autoClose={3000}
        closeOnClick={true}
        pauseOnFocusLoss={false}
        limit={2}
      />
    </>
  );
}

export default App;
