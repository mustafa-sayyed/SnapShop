import { createContext, useContext } from "react";

export const ShopContext = createContext({
  deliveryFee: 10,
  currency: "₹",
  products: [],
  search: "",
  showSearch: false,
  cartItems: {},
  setCartItems: () => {},
  fetchProducts: () => {},
  updateCurrency: () => {},
  updateDeliveryFee: () => {},
  bestSellerProducts: [], 
  setBestSellerProducts: () => {},
  updateLocalySavedCartItems: async () => {},
  addToCart: async () => {},
  getCartData: async () => {},
  getCartDetailsFromLocal: () => [],
  getCartCount: () => 0,
  getCartAmount: () => 0,
  updateCart: async () => {},
});

export function useShop() {
  return useContext(ShopContext);
}
