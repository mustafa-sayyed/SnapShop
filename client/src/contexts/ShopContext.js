import { createContext, useContext } from "react";

export const ShopContext = createContext({
  deliveryFee: 10,
  currency: "₹",
  products: [],
  search: "",
  showSearch: false,
  fetchProducts: () => {},
  updateCurrency: () => {},
  updateDeliveryFee: () => {},
});

export function useShop() {
  return useContext(ShopContext);
}
