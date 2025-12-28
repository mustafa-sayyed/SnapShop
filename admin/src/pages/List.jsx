import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { productListColumns } from "@/lib/tableColumns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

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

  const alteredProductListColumns = productListColumns.map((product) => {
    if (product.accessorKey == "action") {
      product["cell"] = ({ row }) => {
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
      };
    }
    return product;
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const table = useReactTable({
    data: products,
    columns: alteredProductListColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <p className="mb-4 text-2xl">All Product List</p>
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
          ) : (
            <TableRow>
              <TableCell colSpan={productListColumns.length} className="h-36 text-center">
                No Products Found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default List;
