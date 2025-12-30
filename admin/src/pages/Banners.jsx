import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import axios from "axios";
import { CloudCog, FingerprintIcon, Plus, Trash2, UploadCloud } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Banners() {
  const [banners, setBanners] = useState([]);
  const [bannerImage, setBannerImage] = useState();
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isBannersLoading, setIsBannersLoading] = useState(false);
  const [isBannerAdding, setIsBannerAdding] = useState(false);
  const [addBanner, setAddBanner] = useState(false);
  const [isDeletingBanner, setIsDeletingBanner] = useState(false);

  const token = localStorage.getItem("token");

  const fetchBanners = async () => {
    try {
      setIsBannersLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/featured-banner`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res);

      setBanners(res.data.banners);
    } catch (error) {
      console.log("Error while fetching banners: ", error);
    } finally {
      setIsBannersLoading(false);
    }
  };

  const deleteBanner = async (id) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/featured-banner/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Banner deleted successfully");
      }
    } catch (error) {
      const message = error.response?.data?.message ?? "Failed to delete banner";
      toast.error(message);
      console.log("Error while fetching banners: ", error);
    }
  };

  const toggleBannerActive = async (id) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/featured-banner/${id}/toggle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      const message = error.response?.data?.message ?? "Failed to toggle banner state";
      toast.error(message);
      console.log("Error while toggling Banner Active ", error);
    }
  };

  const handleToggleBannerActive = (id, nextActive) => {
    setBanners((prevBanners) =>
      prevBanners.map((banner) =>
        banner._id === id ? { ...banner, isActive: nextActive } : banner
      )
    );
    toggleBannerActive(id);
  };

  const handleAddBanner = async () => {
    const formData = new FormData();

    formData.append("bannerImage", bannerImage);
    formData.append("bannerTitle", bannerTitle);
    formData.append("bannerLink", bannerLink);
    formData.append("isActive", isActive);
    try {
      setIsBannerAdding(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/featured-banner`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
      }

      setAddBanner(false);
      fetchBanners();
    } catch (error) {
      const message = error?.response?.data.message ?? "Error while adding banner";
      toast.error(message);
      console.log(error);
    } finally {
      setIsBannerAdding(false);
    }
  };

  const handleDeleteBanner = (id) => {
    setIsDeletingBanner(true);
    deleteBanner(id).finally(() => setIsDeletingBanner(false));
    setBanners((banners) => banners.filter((banner) => banner._id !== id));
  };

  const featuredBannerColumns = [
    {
      accessorKey: "bannerImage",
      header: "Banner Image",
      cell: ({ row }) => {
        const imageUrl = row.original.bannerImage;
        return <img src={imageUrl} alt={row.original.title} className="h-28 w-48" />;
      },
    },
    {
      accessorKey: "bannerTitle",
      header: "Title",
      cell: ({ getValue }) => {
        if (!getValue()) {
          return "No Title Given";
        }
        return getValue();
      },
    },
    {
      accessorKey: "bannerLink",
      header: "Link",
      cell: ({ getValue }) => {
        if (!getValue()) {
          return "No Link Given";
        }
        return getValue();
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ getValue }) => {
        return new Date(getValue()).toDateString();
      },
    },
    {
      accessorKey: "activate/deactivate",
      header: "Activate/Deactivate",
      cell: ({ row }) => {
        const isActive = row.original.isActive;
        const id = row.original._id;
        return (
          <Switch
            className="cursor-pointer data-[state=checked]:bg-green-500"
            checked={isActive}
            disabled={isDeletingBanner}
            onCheckedChange={(checked) => handleToggleBannerActive(id, checked)}
          />
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const id = row.original._id;
        return (
          <Button
            variant="outline"
            className="hover:text-red-500 cursor-pointer"
            onClick={() => handleDeleteBanner(id)}
          >
            {isDeletingBanner ? <Spinner /> : <Trash2 />}
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    fetchBanners();
  }, []);

  const table = useReactTable({
    data: banners,
    columns: featuredBannerColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl">Manage Featured Banners</p>
        <Dialog open={addBanner} onOpenChange={setAddBanner}>
          <form>
            <DialogTrigger asChild>
              <Button className="cursor-pointer">
                <Plus /> Add Banners
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Banners</DialogTitle>
                <DialogDescription>
                  Add all details here. Click on the Add Banner Button to add the banner.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  Banner Image
                  <Label htmlFor="image">
                    <div className="w-full">
                      {bannerImage ? (
                        <img
                          src={URL.createObjectURL(bannerImage)}
                          alt="Banner Image"
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <div className="w-full h-40 bg-accent cursor-pointer rounded-md flex items-center justify-center border-2">
                          <div className="flex items-center flex-col gap-2">
                            <UploadCloud />
                            Upload Banner Image
                          </div>
                        </div>
                      )}
                    </div>
                  </Label>
                  <Input
                    type="file"
                    id="image"
                    className="sr-only"
                    disabled={isBannerAdding}
                    onChange={(e) => setBannerImage(e.target.files[0])}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={bannerTitle}
                    disabled={isBannerAdding}
                    onChange={(e) => setBannerTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="link">Add Link for Button</Label>
                  <Input
                    id="link"
                    value={bannerLink}
                    disabled={isBannerAdding}
                    onChange={(e) => setBannerLink(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Checkbox
                    id="active"
                    className="border-gray-900 dark:border-white ml-1"
                    checked={isActive}
                    disabled={isBannerAdding}
                    onCheckedChange={() => setIsActive((prevState) => !prevState)}
                  />
                  <Label htmlFor="active" className="cursor-pointer">
                    Active
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    disabled={isBannerAdding}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  disabled={isBannerAdding}
                  onClick={() => handleAddBanner()}
                >
                  {isBannerAdding ? (
                    <div className="flex items-center gap-2">
                      <Spinner />
                      Adding Banner...
                    </div>
                  ) : (
                    "Add Banner"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="bg-accent">
              {hg.headers.map((header) => (
                <TableCell key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getCoreRowModel().rows.length ? (
            table.getCoreRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : isBannersLoading ? (
            <TableRow>
              <TableCell
                colSpan={featuredBannerColumns.length}
                className="h-36 text-center"
              >
                <div className="flex items-center gap-2 justify-center">
                  <Spinner />
                  <span>Loading...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <TableRow>
              <TableCell
                colSpan={featuredBannerColumns.length}
                className="h-36 text-center flex items-center justify-center"
              >
                No Banners Found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default Banners;
