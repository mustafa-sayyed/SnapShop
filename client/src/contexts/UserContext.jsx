import { useState } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext({
  authStatus: false,
  userData: {},
});

function UserContextProvider({ children }) {
  const [authStatus, setAuthStatus] = useState(null);
  const [userData, setUserData] = useState({});

  const navigate = useNavigate();

  const login = (user, token) => {
    setAuthStatus(true);
    setUserData(user);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setAuthStatus(false);
    setUserData({});
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <UserContext.Provider
      value={{ authStatus, userData, login, logout, setUserData, setAuthStatus }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContextProvider;

export const useAuth = () => {
  return useContext(UserContext);
};
