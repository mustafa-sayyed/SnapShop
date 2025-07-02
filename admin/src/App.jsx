import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import { AuthLayout, Login, Sidebar } from "./components";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Add, List, Orders } from "./pages";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "./context/userContext";
import axios from "axios";
export const currency = "$"

function App() {
  const [loading, setLoading] = useState(true);
  const { login, authStatus, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(authStatus, user);

    const token = localStorage.getItem("token");

    if (token) {
      axios
        .get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          return res.data.user;
        })
        .then((user) => {
          login({ name: user.name, email: user.email, role: user.role });
        })
        .catch((error) => {
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

  return authStatus ? (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <hr />

      <div className="flex w-full">
        <Sidebar />
        <div className="w-[70%] my-8 mx-auto ml-[max(5vw,25px))] text-gray-600 text-base">
          <Routes>
            <Route
              path="/add"
              element={
                <AuthLayout authentication={true}>
                  <Add />
                </AuthLayout>
              }
            />
            <Route
              path="/list"
              element={
                <AuthLayout authentication={true}>
                  <List />
                </AuthLayout>
              }
            />
            <Route
              path="/orders"
              element={
                <AuthLayout authentication={true}>
                  <Orders />
                </AuthLayout>
              }
            />
          </Routes>
        </div>
      </div>

      <ToastContainer
        autoClose={3000}
        closeOnClick={true}
        pauseOnFocusLoss={false}
        limit={2}
      />
    </div>
  ) : (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
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
