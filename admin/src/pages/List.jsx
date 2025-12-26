import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

function List() {
  const [products, setProducts] = useState([]);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/products`);

      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        console.log(error.message);
        toast.error(`Error while fetching Products: ${error.message}`);
      }
    }
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.delete(`${backendUrl}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        console.log(error.message);
        toast.error(`Error while Deleting Product: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <p className="mb-2">All Product List</p>
      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-3 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {products &&
          products.map((product) => (
            <div
              key={product._id}
              className="grid grid-cols-[1fr_3fr_1fr md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 text-sm border border-gray-400">
              <img
                src={product.image[0]}
                alt="productImage"
                className="w-20 rounded-xs"
              />
              <p>{product.name}</p>
              <p>{product.category}</p>
              <p>{product.price}</p>
              <div className="flex md:justify-center justify-end items-center">
                <Trash2 onClick={() => deleteProduct(product._id)} />
              </div>
            </div>
          ))}
      </div>

      {/* <div>Products Will be displayed here</div>
      {products &&
        products.map((product) => ( 
          <div key={product._id}>
          <div className="flex items-center flex-wrap gap-4">

            {
              product.image.map(img => (
                  <img src={img} alt="images" className="w-36 rounded-sm" />
              )) 
            }
          </div>

            <div>{product.name}</div>
            <div>{product.descrition}</div>
            <div>{product.price}</div>
            <div>{product.category}</div>
            <div>{product.subCategory}</div>
          </div>
        ))} */}
    </div>
  );
}

export default List;
