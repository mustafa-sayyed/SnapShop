import React, { useEffect, useState } from "react";
import { assets } from "../assets";
import axios from "axios";
import { toast } from "react-toastify";

function Add() {
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [addingProduct, setAddingProduct] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("Topwear");
  const [bestSeller, setBestSeller] = useState(false);
  const [sizes, setSizes] = useState([]);

  // const handlePhotoChange = (e, setImage) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const fileReader = new FileReader();
  //     fileReader.onloadend = () => {
  //       setImage(fileReader.result);
  //     };
  //     fileReader.readAsDataURL(file);
  //   }
  // };

  const handleSizeChange = (size) => {
    if (sizes.includes(size)) {
      setSizes((prev) => prev.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleError = (msg) => {
    toast(msg, {
      type: "error",
    });
  };

  const clearInputs = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("Men");
    setSubCategory("Topwear");
    setBestSeller(false);
    setImage1("");
    setImage2("");
    setImage3("");
    setImage4("");
    setSizes([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddingProduct(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("bestSeller", bestSeller);
      formData.append("sizes", JSON.stringify(sizes));

      image1 && formData.append("image1", image1);
      image2 && formData.append("image2", image2);
      image3 && formData.append("image3", image3);
      image4 && formData.append("image4", image4);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/products`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast("Product Added", {
          type: "success",
        });
        clearInputs();
      }
      setAddingProduct(false);
    } catch (error) {
      setAddingProduct(false);
      if (error.response) {
        handleError(error.response.data.message);
      } else {
        handleError("Error while adding product");
        console.log(error.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start w-full gap-3">
      <div>
        <p>Upload Images</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <label htmlFor="image1" className="cursor-pointer w-28">
            <img
              src={(image1 && URL.createObjectURL(image1)) || assets.upload_area}
              alt="image1"
              className="w-28 h-24 rounded-xs"
            />
            <input
              type="file"
              id="image1"
              onChange={(e) => setImage1(e.target.files[0])}
              hidden
            />
          </label>
          <label htmlFor="image2" className="cursor-pointer w-28">
            <img
              src={(image2 && URL.createObjectURL(image2)) || assets.upload_area}
              alt="image2"
              className="w-28 h-24 rounded-xs"
            />
            <input
              type="file"
              id="image2"
              onChange={(e) => setImage2(e.target.files[0])}
              hidden
            />
          </label>
          <label htmlFor="image3" className="cursor-pointer w-28">
            <img
              src={(image3 && URL.createObjectURL(image3)) || assets.upload_area}
              alt="image3"
              className="w-28 h-24 rounded-xs"
            />
            <input
              type="file"
              id="image3"
              onChange={(e) => setImage3(e.target.files[0])}
              hidden
            />
          </label>
          <label htmlFor="image4" className="cursor-pointer w-28">
            <img
              src={(image4 && URL.createObjectURL(image4)) || assets.upload_area}
              alt="image4"
              className="w-28 h-24 rounded-xs"
            />
            <input
              type="file"
              id="image4"
              onChange={(e) => setImage4(e.target.files[0])}
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="">Product Name</p>
        <input
          type="text"
          className="px-3 py-2 w-full max-w-[500px] outline-gray-500 border border-gray-400 rounded-md "
          placeholder="Type product name here..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="w-full">
        <p className="">Product Descriptioin</p>
        <textarea
          className="px-3 py-2 w-full max-w-[500px] outline-gray-500 border border-gray-400 rounded-md"
          placeholder="Type product description here..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-8 w-full">
        <div>
          <p>Product Category</p>
          <select
            className="w-full px-3 py-2 border border-gray-400 rounded-md outline-gray-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div>
          <p>Sub Category</p>
          <select
            className="w-full px-3 py-2 border border-gray-400 rounded-md outline-gray-500"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}>
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div>
          <p>Product Price</p>
          <input
            type="number"
            placeholder="Enter prodcut price..."
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="px-3 py-2 rounded-md outline-gray-500 border border-gray-400 w-full"
          />
        </div>
      </div>

      <div>
        <p>Product Sizes</p>
        <div className="flex gap-2 mt-2">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div onClick={() => handleSizeChange(size)} key={size}>
              <p
                className={`px-3 py-1.5 cursor-pointer rounded-sm border ${
                  sizes.includes(size) ? "bg-pink-100" : "bg-slate-200 border-slate-200"
                }`}>
                {size}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input
          type="checkbox"
          id="bestSeller"
          checked={bestSeller}
          className="w-4"
          onChange={(e) => setBestSeller((prev) => !prev)}
        />
        <label htmlFor="bestSeller" className="cursor-pointer">
          Add to Best Seller
        </label>
      </div>

      <button className="px-8 py-3 mt-2 cursor-pointer bg-black text-white rounded-md active:bg-gray-900">
        {addingProduct ? (
          <div className="flex items-center gap-2">
            <span className="animate-spin inline-block size-5 border-3 border-current border-t-transparent text-white rounded-full"></span>
            <span>Adding Product...</span>
          </div>
        ) : (
          "Add Product"
        )}
      </button>
    </form>
  );
}

export default Add;
