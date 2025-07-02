import React, { useEffect, useState } from "react";
import { ShopContext } from "./ShopContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "./UserContext";

function ShopContextProvider({ children }) {
  const [currency, setCurrency] = useState("$");
  const [deliveryFee, setDeliveryFee] = useState(10);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const { authStatus } = useAuth();

  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const updateCurrency = (currency) => {
    setCurrency(currency);
  };
  const updateDeliveryFee = (deliveryFee) => {
    setDeliveryFee(deliveryFee);
  };

  useEffect(() => {
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
    fetchProducts();
  }, []);

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
      try {
        const res = await axios.post(
          `${backendUrl}/cart/`,
          { productId: itemId, size },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.data.success) {
          toast.success(res.data.message);
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
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

    cartData[itemId][size] = quantity;

    setCartItems(cartData);

    if (authStatus) {
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
          }
        );

        if (res.data.success) {
          toast.success(res.data.message);
        }
      } catch (error) {
        if (error.response) {
          toast.error(error.response.message);
        } else {
          toast.error(error.message);
          console.log(error.message);
        }
      }
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    if (products.length && Object.keys(cartItems).length) {
      for (const product in cartItems) {
        const productInfo = products.find((p) => p._id === product);
        for (const size in cartItems[product]) {
          if (cartItems[product][size]) {
            totalAmount += productInfo.price * cartItems[product][size];
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
        showSearch,
        cartItems,
        setCartItems,
        addToCart,
        getCartCount,
        getCartAmount,
        updateCart,
        setSearch,
        setShowSearch,
        updateCurrency,
        updateDeliveryFee,
      }}>
      {children}
    </ShopContext.Provider>
  );
}

export default ShopContextProvider;
