import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/UserContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Phone, Pencil, Trash2, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Spinner } from "./ui/spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

function ManageAddress() {
  const { userData, setUserData } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    phone: "",
    pincode: "",
    address: "",
    city: "",
    state: "",
    country: "",
    isDefault: false,
  });

  useEffect(() => {
    getAllAddresses();
  }, []);

  const getAllAddresses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/addresses`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setAddresses(response.data.addresses);
      }
    } catch (error) {
      console.log(`Error while getting all addresses: ${error}`);
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: userData?.name || "",
      email: userData?.email || "",
      phone: "",
      pincode: "",
      address: "",
      city: "",
      state: "",
      country: "",
      isDefault: false,
    });
    setEditingAddress(null);
  };

  const handleModalChange = (isOpen) => {
    setIsAddressModalOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
  };

  const updateFormData = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      email: address.email,
      phone: address.phone,
      pincode: address.pincode,
      address: address.address,
      city: address.city,
      state: address.state,
      country: address.country,
      isDefault: address.isDefault,
    });
    setIsAddressModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/addresses/${editingAddress._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Address updated successfully");
        // Update user context if default address changed
        if (response.data.address && formData.isDefault) {
          const updatedUserData = { ...userData };
          updatedUserData.defaultAddress = response.data.address;
          setUserData(updatedUserData);
        }

        // Refresh address list
        await getAllAddresses();
        setIsAddressModalOpen(false);
        resetForm();
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.data.message) {
          toast.error(error.response.data.message);
        } else if (error.response.data.errors) {
          Object.values(error.response.data.errors).forEach((err) => {
            toast.error(err[0]);
          });
        }
      } else {
        toast.error(error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (address) => {
    setAddressToDelete(address);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!addressToDelete) return;

    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/addresses/${addressToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Address deleted successfully");

        // Update user context if default address changed
        if (response.data.address) {
          const updatedUserData = { ...userData };
          updatedUserData.defaultAddress = response.data.address;
          setUserData(updatedUserData);
        }

        // Refresh address list
        await getAllAddresses();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to delete address");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setAddressToDelete(null);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">All Addresses</h2>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Spinner className="w-8 h-8" />
          <span className="ml-3">Loading addresses...</span>
        </div>
      ) : addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4"
            >
              <div className="space-y-2 text-sm mb-4">
                <p className="font-semibold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {address.name}
                </p>
                <p className="text-gray-600">{address.email}</p>
                <p className="text-gray-700">{address.address}</p>
                <p className="text-gray-700">
                  {address.city}, {address.state} - {address.pincode}
                </p>
                <p className="text-gray-700">{address.country}</p>
                <p className="flex items-center gap-2 text-gray-700">
                  <Phone className="w-4 h-4" />
                  {address.phone}
                </p>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-200">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditAddress(address)}
                  className="flex-1 cursor-pointer"
                >
                  <Pencil className="w-3 h-3 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteClick(address)}
                  className="flex-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3 mr-1" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
          <p className="text-gray-500">No addresses found</p>
        </div>
      )}

      {/* Edit Address Dialog */}
      <Dialog open={isAddressModalOpen} onOpenChange={handleModalChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Address</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 p-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="outline-none border border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-200 py-2.5 px-4 rounded-md transition-all"
                onChange={(e) => updateFormData("name", e.target.value)}
                value={formData.name}
                disabled={isSubmitting}
                required
                autoFocus
              />

              <input
                type="email"
                placeholder="Email Address"
                className="outline-none border border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-200 py-2.5 px-4 rounded-md transition-all"
                onChange={(e) => updateFormData("email", e.target.value)}
                value={formData.email}
                disabled={isSubmitting}
                required
              />
            </div>

            <input
              type="text"
              placeholder="Street Address"
              className="outline-none border border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-200 py-2.5 px-4 w-full rounded-md transition-all"
              onChange={(e) => updateFormData("address", e.target.value)}
              value={formData.address}
              disabled={isSubmitting}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Country"
                className="outline-none border border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-200 py-2.5 px-4 rounded-md transition-all"
                onChange={(e) => updateFormData("country", e.target.value)}
                value={formData.country}
                disabled={isSubmitting}
                required
              />
              <input
                type="text"
                placeholder="State"
                className="outline-none border border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-200 py-2.5 px-4 rounded-md transition-all"
                onChange={(e) => updateFormData("state", e.target.value)}
                value={formData.state}
                disabled={isSubmitting}
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
                disabled={isSubmitting}
                required
              />
              <input
                type="number"
                placeholder="Zip Code"
                className="outline-none border border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-200 py-2.5 px-4 rounded-md transition-all"
                onChange={(e) => updateFormData("pincode", e.target.value)}
                value={formData.pincode}
                disabled={isSubmitting}
                required
              />
            </div>

            <input
              type="number"
              placeholder="Phone Number"
              className="outline-none border border-gray-300 focus:border-gray-300 focus:ring-2 focus:ring-gray-200 py-2.5 px-4 w-full rounded-md transition-all"
              onChange={(e) => updateFormData("phone", e.target.value)}
              value={formData.phone}
              disabled={isSubmitting}
              required
            />

            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-md">
              <Checkbox
                id="isDefault"
                checked={formData.isDefault}
                onCheckedChange={(checked) => updateFormData("isDefault", checked)}
                className="border-gray-400"
                disabled={isSubmitting}
              />
              <Label htmlFor="isDefault" className="cursor-pointer">
                Set as default address
              </Label>
            </div>

            <Button
              disabled={isSubmitting}
              className="w-full cursor-pointer py-2.5"
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="w-5 h-5 mr-2" />
                  Updating...
                </>
              ) : (
                "Update Address"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this address. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive"
            >
              {isDeleting ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default ManageAddress;
