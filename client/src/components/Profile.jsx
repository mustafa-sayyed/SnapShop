import React, { useEffect, useState } from "react";
import Title from "./Title";
import { useAuth } from "../contexts/UserContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function Profile() {
  const { userData, address, setAddress } = useAuth();
  const [modalVisiblity, setModalVisiblity] = useState(false);
  const [addingAddress, setAddingAddress] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const isaddingAddress = searchParams.get("add");

  useEffect(() => {
    if (isaddingAddress) {
      setModalVisiblity(true);
    }
  }, []);
  

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
    country: "",
  });

  window.addEventListener("click", (e) => {
    if (e.target.className.includes("mymodal")) {
      closeModal();
    }
  });

  const closeModal = () => {
    if (isaddingAddress) {
      setSearchParams((params) => {
        params.delete("add");
        return params;
      });
    }
    setAddingAddress(false);
    setModalVisiblity(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      pincode: "",
      address: "",
      city: "",
      state: "",
      country: "",
    });
  };

  const updateFormData = (key, value) => {
    const data = { ...formData };
    data[key] = value;
    setFormData(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAddingAddress(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/address`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setAddress(response.data.address);
        closeModal();
        toast.success("Address Addedd Successfully");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen pt-8">
      <div className="text-2xl">
        <Title children1={"Your"} children2={"Profile"} />
      </div>

      <div className="bg-slate-50 px-6 sm:px-10 py-6 sm:py-8">
        <p>Name: {userData.name}</p>
        <p>Email: {userData.email}</p>
        <p>Address:</p>
        <div className="flex flex-wrap sm:flex-row item-center gap-4 mt-2">
          {address?.length ? (
            address.map((addr) => (
              <div
                key={addr._id}
                className="bg-slate-200 px-6 sm:px-8 py-4 flex flex-col gap-[2px] rounded-md text-xs sm:text-sm">
                <p>
                  {addr.firstName} {addr.lastName}
                </p>
                <p>{addr.email}</p>
                <p>{addr.address}</p>
                <p>
                  {addr.city}- {addr.pincode}
                </p>
                <p>
                  {addr.state}, {addr.country}.
                </p>
                <p>{addr.phone}</p>
              </div>
            ))
          ) : (
            <div>
              <div>No Address Found</div>
            </div>
          )}
        </div>

        <div className={`${modalVisiblity ? "visible" : "hidden"}  mymodal`}>
          <form
            method="post"
            onSubmit={handleSubmit}
            className="bg-white p-10 mymodal-content relative gap-4">
            <button
              onClick={closeModal}
              type="button"
              className="btn btn-md btn-circle btn-ghost absolute right-2 top-2 cursor-pointer">
              ✕
            </button>
            <h3 className="font-semibold text-xl mb-6">Add Address</h3>
            <div className="flex flex-col gap-4 w-full text-right">
              <div className="flex gap-3">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  value={formData.firstName}
                  required
                  autoFocus
                />
                <input
                  type="text"
                  name="LastName"
                  placeholder="Last Name"
                  className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  value={formData.lastName}
                  required
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
                onChange={(e) => updateFormData("email", e.target.value)}
                value={formData.email}
                required
              />
              <input
                type="text"
                placeholder="Address"
                className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
                onChange={(e) => updateFormData("address", e.target.value)}
                value={formData.address}
                required
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Country"
                  className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
                  onChange={(e) => updateFormData("country", e.target.value)}
                  value={formData.country}
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
                  onChange={(e) => updateFormData("state", e.target.value)}
                  value={formData.state}
                  required
                />
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="City"
                  className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
                  onChange={(e) => updateFormData("city", e.target.value)}
                  value={formData.city}
                  required
                />
                <input
                  type="number"
                  placeholder="Zip Code"
                  className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
                  onChange={(e) => updateFormData("pincode", e.target.value)}
                  value={formData.pincode}
                  required
                />
              </div>
              <input
                type="number"
                placeholder="Phone no"
                className="outline-none border border-gray-400 py-1.5 px-3.5 w-full rounded-md"
                onChange={(e) => updateFormData("phone", e.target.value)}
                value={formData.phone}
                required
              />

              <button className="btn btn-neutral py-4 w-fit self-end">
                {addingAddress ? (
                  <>
                    <span className="loading loading-spinner w-5 h-5"></span>Adding
                    addresss...
                  </>
                ) : (
                  "Add Address"
                )}
              </button>
            </div>
          </form>
        </div>

        <button
          className="underline cursor-pointer mt-8"
          onClick={() => setModalVisiblity(true)}>
          + Add Address
        </button>
      </div>
    </div>
  );
}

export default Profile;
