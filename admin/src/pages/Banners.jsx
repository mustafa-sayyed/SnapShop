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
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { featuredBannerColumns } from "@/lib/tableColumns";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Plus, UploadCloud } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

function Banners() {
  const [banners, setBanners] = useState([]);
  const [bannerImage, setBannerImage] = useState();

  const fetchBanners = async () => {
    try {
      setBanners([]);
    } catch (error) {
      console.log("Error while fetching banners: ", error);
    }
  };

  const deleteBanner = async (id) => {
    try {
      toast.success("Banner deleted successfully");
    } catch (error) {
      console.log("Error while fetching banners: ", error);
      toast.error("Error while deleting banner");
    }
  };

  const toggleBannerActive = async (id) => {
    try {
      // Todo: Add logic for Activate/Deactivate
    } catch (error) {
      console.log("Error while toggling Banner Active ", error);
    }
  };

  const table = useReactTable({
    data: banners,
    columns: featuredBannerColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl">Manage Featured Banners</p>
        <Dialog>
          <form>
            <DialogTrigger asChild>
              <Button className="cursor-pointer" onClick={() => {}}>
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
                    onChange={(e) => setBannerImage(e.target.files[0])}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" defaultValue="Trending Products" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="link">Add Link for Button</Label>
                  <Input id="link" defaultValue="All Product" />
                </div>
                <div className="flex gap-2">
                  <Checkbox
                    id="active"
                    className="border-gray-900 dark:border-white ml-1"
                  />
                  <Label htmlFor="active" className="cursor-pointer">
                    Active
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Add Banner</Button>
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
                <TableCell>
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
                    {flexRender(cell.column.columnDef.accessorKey, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={featuredBannerColumns.length}
                className="h-36 text-center"
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
