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
  const [authStatus, setAuthStatus] = useState(null);
  const [userData, setUserData] = useState({});
  const [address, setAddress] = useState([]);
  const { setCartItems } = useShop();

  const navigate = useNavigate();

  const login = (data) => {
    setAuthStatus(true);
    setUserData(data.user);
    setCartItems(data.user.cartData);
    setAddress(data.addresses);
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
  };

  const logout = () => {
    setAuthStatus(false);
    setAddress([]);
    setUserData({});
    localStorage.removeItem("token");
    toast.success("Logout successfull");
    navigate("/");
  };

  const clearUserDetails = () => {
    setAuthStatus(false);
    setAddress([]);
    setCartItems([])
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
