import React, { useEffect, useState } from "react";
import Title from "./Title";
import { useAuth } from "../contexts/UserContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Container } from ".";
import { Button } from "./ui/button";
import { Phone, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";
import ManageAddress from "./ManageAddress";

function Profile() {
  const { userData, setUserData } = useAuth();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isDefaultAddressModalOpen, setIsDefaultAddressModalOpen] = useState(false);
  const [isGettingAddress, setIsGettingAddress] = useState(false);
  const [isSettingDefaultAddress, setIsSettingDefaultAddress] = useState(false);

  const [defaultAddress, setDefaultAddress] = useState(
    userData?.defaultAddress?._id ?? null
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const isUserWantsToAddAddress = searchParams.get("add");
  const isUserWantsToChangeDefaultAddress = searchParams.get("change");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (isUserWantsToAddAddress) {
      setIsAddressModalOpen(true);
    }
    if (isUserWantsToChangeDefaultAddress) {
      setIsDefaultAddressModalOpen(true);
      getAllAddress();
    }
  }, []);

  const [formData, setFormData] = useState({
    name: userData?.name,
    email: userData?.email,
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
    country: "",
    isDefault: false,
  });

  const handleModalChange = (modal, isOpen) => {
    if (modal == "addAddress") {
      setIsAddressModalOpen(isOpen);
      setFormData({
        name: userData?.name,
        email: userData?.email,
        phone: "",
        pincode: "",
        address: "",
        city: "",
        state: "",
        country: "",
        isDefault: false,
      });
    }

    if (modal == "changeAddress") {
      setIsDefaultAddressModalOpen(isOpen);
    }
    if (isUserWantsToAddAddress) {
      setSearchParams((params) => {
        params.delete("add");
        return params;
      });
    }
    if (isUserWantsToChangeDefaultAddress) {
      setSearchParams((params) => {
        params.delete("change");
        return params;
      });
    }
    setDefaultAddress(userData.defaultAddress._id ?? null);
  };

  const updateFormData = (key, value) => {
    const data = { ...formData };
    data[key] = value;
    setFormData(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAddingAddress(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/addresses`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        if (response.data.address) {
          const updatedUserData = { ...userData };
          updatedUserData.defaultAddress = response.data.address;
          setUserData(updatedUserData);
        }
        setIsAddressModalOpen(false);
        toast.success("Address Addedd Successfully");
      }
    } catch (error) {
      console.log(error);

      if (error.response) {
        if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else {
          Object.values(error?.response?.data?.errors).forEach((err) => {
            toast.error(err[0]);
          });
        }
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsAddingAddress(false);
    }
  };

  const getAllAddress = async () => {
    try {
      setIsGettingAddress(true);
      const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.data.success) {
        setAddresses(result.data.addresses);
      }
    } catch (error) {
      console.log(`Error while getting all addresses: ${error}`);
    } finally {
      setIsGettingAddress(false);
    }
  };

  const handleSetDefaultAddress = async () => {
    if (!defaultAddress || !addresses.length) {
      return;
    }
    try {
      setIsSettingDefaultAddress(true);
      const result = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/addresses/${defaultAddress}`,
        { isDefault: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (result.data.success) {
        const updatedUser = { ...userData };
        updatedUser.defaultAddress = result.data.address;
        setUserData(updatedUser);
        setIsDefaultAddressModalOpen(false);
      }
    } catch (error) {
      console.log(`Error while getting setting default address: ${error}`);
    } finally {
      setIsSettingDefaultAddress(false);
    }
  };

  return (
    <Container>
      <div className="min-h-screen pt-8 pb-12">
        <div className="text-2xl mb-8">
          <Title children1={"Your"} children2={"Profile"} />
        </div>

        <div className="bg-card card border px-4 sm:px-8 lg:px-10 py-6 sm:py-8">
          <div className="mb-8 space-y-3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Profile Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                <p className="text-sm text-gray-500 mb-1">Name</p>
                <p className="font-medium text-gray-800">{userData?.name}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-800">{userData?.email}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Default Address</h2>
            {userData?.defaultAddress ? (
              <div className="card border px-4 sm:px-6 py-5 rounded-lg bg-slate-50 max-w-md">
                <div className="space-y-2 text-sm sm:text-base">
                  <p className="font-semibold text-gray-900">
                    {userData.defaultAddress.name}
                  </p>
                  <p>{userData.defaultAddress.email}</p>
                  <p>{userData.defaultAddress.address}</p>
                  <p>
                    {userData.defaultAddress.city}, {userData.defaultAddress.state} -{" "}
                    {userData.defaultAddress.pincode}
                  </p>
                  <p>{userData.defaultAddress.country}</p>
                  <p className="flex items-center gap-2">
                    <Phone size={20} />
                    {userData.defaultAddress.phone}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center">
                <p className="text-gray-500">No default address set</p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Dialog
              open={isAddressModalOpen}
              onOpenChange={(isOpen) => handleModalChange("addAddress", isOpen)}
            >
              <DialogTrigger asChild>
                <Button className="cursor-pointer w-full sm:w-auto">
                  <Plus className="w-4 h-4 mr-2" /> Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">Add New Address</DialogTitle>
                </DialogHeader>
                <form method="post" onSubmit={handleSubmit} className="space-y-4 p-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      className="outline-none border border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-200 py-2.5 px-4 rounded-md transition-all"
                      onChange={(e) => updateFormData("name", e.target.value)}
                      value={formData.name}
                      disabled={isAddingAddress}
                      required
                      autoFocus
                    />

                    <input
                      type="email"
                      placeholder="Email Address"
                      className="outline-none border border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-200 py-2.5 px-4 rounded-md transition-all"
                      onChange={(e) => updateFormData("email", e.target.value)}
                      value={formData.email}
                      disabled={isAddingAddress}
                      required
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Street Address"
                    className="outline-none border border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-200 py-2.5 px-4 w-full rounded-md transition-all"
                    onChange={(e) => updateFormData("address", e.target.value)}
                    value={formData.address}
                    disabled={isAddingAddress}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Country"
                      className="outline-none border border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-200 py-2.5 px-4 rounded-md transition-all"
                      onChange={(e) => updateFormData("country", e.target.value)}
                      value={formData.country}
                      disabled={isAddingAddress}
                      required
                    />
                    <input
                      type="text"
                      placeholder="State"
                      className="outline-none border border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-200 py-2.5 px-4 rounded-md transition-all"
                      onChange={(e) => updateFormData("state", e.target.value)}
                      value={formData.state}
                      disabled={isAddingAddress}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      className="outline-none border border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-200 py-2.5 px-4 rounded-md transition-all"
                      onChange={(e) => updateFormData("city", e.target.value)}
                      value={formData.city}
                      disabled={isAddingAddress}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Zip Code"
                      className="outline-none border border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-200 py-2.5 px-4 rounded-md transition-all"
                      onChange={(e) => updateFormData("pincode", e.target.value)}
                      value={formData.pincode}
                      disabled={isAddingAddress}
                      required
                    />
                  </div>

                  <input
                    type="number"
                    placeholder="Phone Number"
                    className="outline-none border border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-200 py-2.5 px-4 w-full rounded-md transition-all"
                    onChange={(e) => updateFormData("phone", e.target.value)}
                    value={formData.phone}
                    disabled={isAddingAddress}
                    required
                  />

                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
                    <Checkbox
                      id="isActive"
                      checked={formData.isDefault}
                      onCheckedChange={(checked) => updateFormData("isDefault", checked)}
                      className="border-gray-400"
                      disabled={isAddingAddress}
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">
                      Set as default address
                    </Label>
                  </div>

                  <Button
                    disabled={isAddingAddress}
                    className="w-full cursor-pointer py-2.5"
                    type="submit"
                  >
                    {isAddingAddress ? (
                      <>
                        <span className="loading loading-spinner w-5 h-5 mr-2"></span>
                        Adding Address...
                      </>
                    ) : (
                      "Add Address"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog
              open={isDefaultAddressModalOpen}
              onOpenChange={(isOpen) => handleModalChange("changeAddress", isOpen)}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="cursor-pointer w-full sm:w-auto"
                  onClick={getAllAddress}
                >
                  Change Default Address
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Choose Your Default Address
                  </DialogTitle>
                </DialogHeader>
                <div className="py-4">
                  {addresses.length ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div
                          key={address._id}
                          className={`bg-slate-50 hover:bg-slate-100 border px-4 sm:px-6 py-4 rounded-lg cursor-pointer ${
                            defaultAddress === address._id
                              ? "border-2 border-green-600 hover:bg-green-50"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                          onClick={
                            !isSettingDefaultAddress
                              ? () => setDefaultAddress(address._id)
                              : () => {}
                          }
                        >
                          <div className="space-y-1.5 text-sm">
                            <p className="font-semibold text-gray-900">{address.name}</p>
                            <p>{address.email}</p>
                            <p>{address.address}</p>
                            <p>
                              {address.city}, {address.state} - {address.pincode}
                            </p>
                            <p>{address.country}</p>
                            <p>{address.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : isGettingAddress ? (
                    <div className="flex items-center justify-center gap-2">
                      <Spinner />
                      <span>Loading Addresses...</span>
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                      <p className="text-gray-500">
                        No addresses found. Add one to get started!
                      </p>
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button
                    className="w-full sm:w-auto cursor-pointer"
                    disabled={isSettingDefaultAddress}
                    onClick={handleSetDefaultAddress}
                  >
                    {isSettingDefaultAddress ? (
                      <div className="flex items-center gap-2">
                        <Spinner />
                        Setting default address...
                      </div>
                    ) : (
                      "Set Default Address"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <ManageAddress />
        </div>
      </div>
    </Container>
  );
}

export default Profile;
