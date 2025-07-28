import React, { useEffect, useState } from "react";
import { useShop } from "../contexts/ShopContext";
import { Title } from "../components";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Orders() {
  const { products, currency } = useShop();
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    (async () => {
      if (token) {
        try {
          const response = await axios.get(`${backendUrl}/orders/myorders`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            let allOrderItems = [];
            for (const orders of response.data.orders) {
              orders.items.map((item) => {
                item.status = orders.status;
                item.payment = orders.paymen;
                item.paymentMethod = orders.paymentMethod;
                item.date = orders.createdAt;
                allOrderItems.push(item);
              });
            }

            setOrderItems(allOrderItems.reverse());
          }
        } catch (error) {
          console.log(error);
          if (error.response) {
            toast.error(error.response.data.message);
          } else {
            toast.error(`Internal Server Error`);
          }
        } finally {
          setLoading(false);
        }
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-[85vh]">
        <div className="loading loading-spinner w-10 h-10"></div>
      </div>
    );
  }

  return (
    <div className="border-t pt-16">
      <div className="text-2xl">
        <Title children1={"My"} children2={"Orders"} />
      </div>

      <div>
        {orderItems.length ? (
          orderItems.map((product, index) => (
            <div
              key={index}
              className="flex py-4 border-t border-b border-gray-400 text-gray-700 flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start text-sm gap-6">
                <img src={product.image[0]} alt="productImage" className="w-16 sm:w-20" />
                <div>
                  <p className="sm:text-base font-medium">{product.name}</p>
                  <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                    <p className="text-lg">
                      {currency}
                      {product.price}
                    </p>
                    <p>Quantity: {product.quantity}</p>
                    <p>Size: {product.size}</p>
                  </div>
                  <p className="mt-2">
                    Date:{" "}
                    <span className="text-gray-400">
                      {new Date(product.createdAt).toLocaleString()}
                    </span>
                  </p>
                  <p className="mt-2">
                    Payment:{" "}
                    <span className="text-gray-400">{product.paymentMethod}</span>
                  </p>
                </div>
              </div>

              <div className="md:w-1/2 flex justify-between">
                <div className="flex items-center gap-2">
                  <p className="min-w-2 h-2 rounded-full bg-yellow-400"></p>
                  <p className="text-sm md:text-base">{product.status}</p>
                </div>
                <button className="border rounded-sm px-4 py-2 font-medium text-sm border-gray-400">
                  Track Order
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="min-h-[70vh] flex flex-col gap-4 items-center justify-center">
            <div className="text-center text-3xl ">No Orders Yet</div>
            <button className="btn btn-neutral" onClick={() => navigate("/collection")}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
