import React, { useEffect, useState } from "react";
import { useAuth } from "../context/userContext";
import { useNavigate } from "react-router-dom";

function AuthLayout({ children, authentication = true }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { authStatus } = useAuth();

  useEffect(() => {
    setLoading(false);
    // const token = localStorage.getItem("token");
    if (authentication) {
      if (authentication && authStatus !== authentication) {
        navigate("/login");
      } else if (!authentication && authStatus !== authentication) {
        navigate("/");
      }
    }
  }, [authentication, authStatus]);

  return loading ? (
    <div className="w-full h-[80vh] flex items-center justify-center ">
      <div className="animate-spin inline-block size-12 border-5 border-current border-t-transparent text-red-600 rounded-full">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  ) : (
    <>{children}</>
  );
}

export default AuthLayout;
