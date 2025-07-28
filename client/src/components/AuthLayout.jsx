import { useShop } from "../contexts/ShopContext";
import { useAuth } from "../contexts/UserContext";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AuthLayout({ children, authRequired = true }) {
  const [loading, setLoading] = useState(true);

  const { authStatus, setUserData, setAuthStatus, setAddress } = useAuth();
  const { setCartItems } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(false);

    if (authRequired && authStatus !== authRequired) {
      console.log(authRequired, authStatus);
      navigate("/login");
      return;
    }
  }, [authStatus, authRequired, navigate]);

  return loading ? (
    <div className="h-[85vh] w-full flex items-center justify-center">
      <div>
        <span className="loading loading-spinner w-10 h-10 text-blue-800"></span>
      </div>
    </div>
  ) : (
    <>{children}</>
  );
}

export default AuthLayout;
