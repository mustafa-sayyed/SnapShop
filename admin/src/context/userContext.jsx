import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = createContext({
  user: {},
  authStatus: false,
});

function UserContextProvider({ children }) {
  const [authStatus, setAuthStatus] = useState(false);
  const [user, setUser] = useState({});

  const navigate = useNavigate();

  const login = (user) => {
    setAuthStatus(true);
    setUser(user);
  };

  const logout = () => {
    setAuthStatus(false);
    setUser({});
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ authStatus, user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useAuth() {
  return useContext(UserContext);
}

export default UserContextProvider;
