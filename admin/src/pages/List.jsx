import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

function List() {
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(null);
  const [isProductsLoading, setIsProductsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const fetchProducts = async () => {
    try {
      setIsProductsLoading(true);
      const response = await axios.get(`${backendUrl}/products`, {
        params: {
          page: pagination.pageIndex,
          limit: pagination.pageSize,
          search: table.getColumn("name")?.getFilterValue() ?? "",
        },
      });

      if (response.data.success) {
        setProducts(response.data.products);
        setPageCount(response.data.totalPages);
        setTotalProducts(response.data.totalProducts);
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
    } finally {
      setIsProductsLoading(false);
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

  const productListColumns = [
    {
      accessorKey: "image",
      header: "Image",
      cell: ({ getValue, row }) => {
        const imgUrls = getValue();
        const firstImage = imgUrls?.[0];

        return firstImage ? (
          <img
            src={firstImage}
            alt={row.original.name || "Product Image"}
            className="object-cover w-20 rounded-xs"
          />
        ) : (
          <span>No Image</span>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "price",
      header: "Price",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        const _id = row.original._id;

        return (
          <Button
            variant="outline"
            className="cursor-pointer hover:text-red-600"
            onClick={() => deleteProduct(_id)}
          >
            <Trash2 />
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    fetchProducts();
  }, [pagination.pageIndex, pagination.pageSize]);

  const table = useReactTable({
    data: products,
    columns: productListColumns,
    pageCount,
    manualPagination: true,
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    fetchProducts();
    setPagination((prev) => ({...prev, pageIndex: 0}))
  }, [table.getColumn("name")?.getFilterValue()])

  return (
    <div>
      <p className="mb-4 text-3xl">All Product List</p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 w-full">
        <Input
          placeholder="Search Products..."
          className="max-w-md"
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(e) => table.getColumn("name")?.setFilterValue(e.target.value)}
        />
        <Select onValueChange={(size) => table.setPageSize(Number(size))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select No. of Product to be Displayed" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select No. of Product to be Displayed</SelectLabel>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Table className="">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-accent">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : isProductsLoading ? (
            <TableRow>
              <TableCell colSpan={productListColumns.length} className="h-36 text-center">
              <div className="flex items-center justify-center gap-2">
                <Spinner />
                Loading Products...
              </div>
              </TableCell>
            </TableRow>
          ): (
            <TableRow>
              <TableCell colSpan={productListColumns.length} className="h-36 text-center">
                No Products Found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-3 p-2 items-start sm:flex-row sm:items-center justify-between w-full">
        {totalProducts && <p className="text-xl font-bold">Total Products: {totalProducts}</p>}
        <p>
          Showing {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}{" "}
          Pages
        </p>
        <div className="flex items-center gap-2">
          <Button
            className="cursor-pointer"
            disabled={pagination.pageIndex === 0}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button>{table.getState().pagination.pageIndex + 1}</Button>
          <Button
            className="cursor-pointer"
            disabled={pagination.pageIndex === pageCount - 1}
            onClick={() => table.nextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default List;
