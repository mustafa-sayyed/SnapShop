import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/index.js";
import { currency } from "../App.jsx";

function Orders() {
  const [orders, setOrders] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${backendUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setOrders(response.data.orders);
        console.log(response.data.orders);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        console.log(error.message);
        toast.error(`Server error: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (status, id) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/orders/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success) {
        // toast.success(response.data.message);
        await fetchOrders();
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        console.log(error.message);
        toast.error(`Server error: ${error.message}`);
      }
    }
  };


  
  return (
    <div>
      <h2>All Orders</h2>
      <div>
        {orders.map((order) => (
          <div
            key={order._id}
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-300 my-3 md:my-3 p-5 sm:p-8 text-xs sm:text-sm text-gray-700">
            <img src={assets.parcel_icon} alt="" className="w-12" />
            <div>
              <div className="">
                {order.items.map((item) => (
                  <p key={item._id}>
                    {" "}
                    {item.name} X {item.quantity}{" "}
                    <span className="ml-1">{item.size}</span>
                  </p>
                ))}
              </div>
              <p className="font-medium py-1">{`${order.address.firstName} ${order.address.lastName}`}</p>
              <div>
                <p>{`${order.address.street}, `}</p>
                <p>{`${order.address.city}, ${order.address.state}, ${order.address.country} - ${order.address.pincode} `}</p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p>Item: {order.items.length}</p>
              <p className="mt-3">Payment Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <p>
              Total: {currency}
              {order.totalPrice}
            </p>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value, order._id)}
              className="px-4 py-1.5 outline-none border rounded-md border-gray-300 cursor-pointer font-medium">
              <option value="pending">pending</option>
              <option value="delivered">delivered</option>
              <option value="shipped">shipped</option>
              <option value="cancelled">cancelled</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
