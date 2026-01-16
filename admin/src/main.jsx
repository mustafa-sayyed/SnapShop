import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import UserContextProvider from "./context/userContext.jsx";
import { SidebarProvider } from "./components/ui/sidebar";
import { ThemeContextProvider } from "./context/themeContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserContextProvider>
      <ThemeContextProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </ThemeContextProvider>
    </UserContextProvider>
  </BrowserRouter>
);
