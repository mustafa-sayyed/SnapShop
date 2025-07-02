import { createContext, useContext } from "react";
import { products } from "../assets/frontend_assets/index.js";

export const ShopContext = createContext({
  deliveryFee: 10,
  currency: "$",
  products: products,
  search: "",
  showSearch: false,
  fetchProducts: () => {},
  updateCurrency: () => {},
  updateDeliveryFee: () => {},
});

export function useShop() {
  return useContext(ShopContext);
}
