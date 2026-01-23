import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useShop } from "./ShopContext";

const UserContext = createContext({
  authStatus: false,
  userData: {},
  address: [],
  login: () => {},
  logout: () => {},
  clearUserDetails: () => {},
});

function UserContextProvider({ children }) {
  const [authStatus, setAuthStatus] = useState(false);
  const [userData, setUserData] = useState({});
  const [address, setAddress] = useState([]);
  const { setCartItems } = useShop();

  const navigate = useNavigate();

  console.log(`Auth Status: ${authStatus}`);
  

  const login = (data) => {
    console.log(`Request came to login the user`);
    
    setAuthStatus(true);
    setUserData(data?.user);
    // Set cart data from user, ensure it's an object not null/undefined
    setCartItems(data?.user?.cartData || {});
    setAddress(data?.addresses || []);
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
  };

  const logout = () => {
    setAuthStatus(false);
    setAddress([]);
    setUserData({});
    // Clear cart items and reset to local storage cart if any
    const localCart = JSON.parse(localStorage.getItem("snapshopCart")) || {};
    setCartItems(localCart);
    localStorage.removeItem("token");
    toast.success("Logout successfull");
    navigate("/");
  };

  const clearUserDetails = () => {
    setAuthStatus(false);
    setAddress([]);
    setCartItems({});
    setUserData({});
  };

  return (
    <UserContext.Provider
      value={{
        authStatus,
        userData,
        login,
        logout,
        setUserData,
        setAuthStatus,
        address,
        setAddress,
        clearUserDetails,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;

export const useAuth = () => {
  return useContext(UserContext);
};
