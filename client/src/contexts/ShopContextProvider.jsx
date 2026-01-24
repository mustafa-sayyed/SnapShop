import React, { useEffect, useState, useCallback } from "react";
import { ShopContext } from "./ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "./UserContext";

function ShopContextProvider({ children }) {
  const [currency, setCurrency] = useState("₹");
  const [deliveryFee, setDeliveryFee] = useState(10);
  const [products, setProducts] = useState([]);
  const [bestSellerProducts, setBestSellerProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cartItems, setCartItems] = useState({});
  const { authStatus } = useAuth();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const getToken = () => localStorage.getItem("token");

  const updateCurrency = (currency) => {
    setCurrency(currency);
  };
  const updateDeliveryFee = (deliveryFee) => {
    setDeliveryFee(deliveryFee);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/products`);

      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.log(`Error while  fetching products: ${error.message}`);
    }
  };

  const getCartData = async () => {
    const token = getToken();
    if (!token) {
      return [];
    }

    try {
      const response = await axios.get(`${backendUrl}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        return response.data.cartData || [];
      }
      return [];
    } catch {
      console.log(`Error while getting cart Data`);
      return [];
    }
  };

  const getCartDetailsFromLocal = useCallback(() => {
    if (!products.length) return [];

    const localCart = JSON.parse(localStorage.getItem("snapshopCart")) || {};
    const cartDetails = [];

    for (const productId in localCart) {
      const product = products.find((p) => p._id === productId);
      if (product) {
        for (const size in localCart[productId]) {
          const quantity = localCart[productId][size];
          if (quantity > 0) {
            cartDetails.push({
              ...product,
              size,
              quantity,
            });
          }
        }
      }
    }

    return cartDetails;
  }, [products]);

  useEffect(() => {
    fetchProducts();
    getCartData().then((data) => {
      const cartItems = {};
      data.forEach((cartProduct) => {
        if (cartItems[cartProduct._id]) {
          if (cartItems[cartProduct._id][cartProduct.size]) {
            cartItems[cartProduct._id][cartProduct.size] = cartProduct.quantity;
          } else {
            cartItems[cartProduct._id] = {
              ...cartItems[cartProduct._id],
              [cartProduct.size]: cartProduct.quantity,
            };
          }
        } else {
          cartItems[cartProduct._id] = { [cartProduct.size]: cartProduct.quantity };
        }
      });

      setCartItems(cartItems)
      
    });

    // Cart Structure
    // {
    //   productId: {
    //     size: quantity,
    //   }
    // }

    // Actual Cart Data after fetching cart
    // [
    //   {
    //     _id: "",
    //     size: "",
    //     quantity: 0,
    //   }
    // ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load cart when products are loaded for non authenticated user
  useEffect(() => {
    if (!authStatus && products.length) {
      const localCart = JSON.parse(localStorage.getItem("snapshopCart")) || {};
      setCartItems(localCart);
    }
  }, [authStatus, products, setCartItems]);

  const addToCart = async (itemId, size) => {
    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItems(cartData);

    if (authStatus) {
      const token = getToken();
      try {
        const res = await axios.post(
          `${backendUrl}/cart/`,
          { productId: itemId, size },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (res.data.success) {
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(`Error while adding to cart ${error}`);
        const message = error.response?.data?.message || error.message;
        toast.error(message);
      }
    } else {
      // For non-authenticated users, cartData is already updated, just save to localStorage
      localStorage.setItem("snapshopCart", JSON.stringify(cartData));
      toast.success("Added to cart");
    }
  };

  const updateLocalySavedCartItems = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const localCartItems = JSON.parse(localStorage.getItem("snapshopCart")) || {};

      for (const productId in localCartItems) {
        for (const size in localCartItems[productId]) {
          const quantity = localCartItems[productId][size];
          if (quantity > 0) {
            await axios.post(
              `${backendUrl}/cart/`,
              {
                productId,
                size,
                quantity,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
          }
        }
      }
      localStorage.removeItem("snapshopCart");
    } catch (error) {
      console.log(error);
    }
  };

  const getCartCount = () => {
    let totalCount = 0;

    for (const product in cartItems) {
      for (const quantity in cartItems[product]) {
        if (cartItems[product][quantity]) {
          totalCount += cartItems[product][quantity];
        }
      }
    }

    return totalCount;
  };

  const updateCart = async (itemId, size, quantity) => {
    const cartData = structuredClone(cartItems);

    // Handle deletion (quantity <= 0)
    if (quantity <= 0) {
      if (cartData[itemId]) {
        delete cartData[itemId][size];
        // If no sizes left, remove the product entry
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      // Update quantity
      if (!cartData[itemId]) {
        cartData[itemId] = {};
      }
      cartData[itemId][size] = quantity;
    }

    setCartItems(cartData);

    if (authStatus) {
      const token = getToken();
      try {
        const res = await axios.patch(
          `${backendUrl}/cart`,
          {
            productId: itemId,
            size,
            quantity,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.data.success) {
          toast.success(res.data.message);
        }
      } catch (error) {
        console.log(`Error while updating cart: `, error);
        const message = error.response?.data?.message || error.message;
        toast.error(message);
      }
    } else {
      // For non-authenticated users, save to localStorage
      localStorage.setItem("snapshopCart", JSON.stringify(cartData));
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    if (products.length && Object.keys(cartItems).length) {
      for (const productId in cartItems) {
        const productInfo = products.find((p) => p._id === productId);
        if (productInfo) {
          for (const size in cartItems[productId]) {
            const quantity = cartItems[productId][size];
            if (quantity > 0) {
              totalAmount += productInfo.price * quantity;
            }
          }
        }
      }
    }
    return totalAmount;
  };

  return (
    <ShopContext.Provider
      value={{
        currency,
        deliveryFee,
        products,
        search,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        getCartData,
        getCartAmount,
        getCartDetailsFromLocal,
        updateCart,
        setSearch,
        updateCurrency,
        updateDeliveryFee,
        bestSellerProducts,
        setBestSellerProducts,
        updateLocalySavedCartItems,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export default ShopContextProvider;
