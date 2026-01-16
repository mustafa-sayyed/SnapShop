import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggle: () => {},
});

export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("snapshopAdminTheme") ?? "light";
  });

  const toggle = () => {
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem("snapshopAdminTheme", "light");
      document.documentElement.classList.remove("dark");
    } else {
      setTheme("dark");
      localStorage.setItem("snapshopAdminTheme", "dark");
      document.documentElement.classList.add("dark");
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("snapshopAdminTheme");
    if (savedTheme && savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
        {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
