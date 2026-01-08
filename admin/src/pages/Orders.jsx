import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { currency } from "../App.jsx";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import { Spinner } from "@/components/ui/spinner.jsx";
import { Button } from "@/components/ui/button.jsx";
import { ChevronLeft, ChevronRight, ListMinus } from "lucide-react";
import { Input } from "@/components/ui/input.jsx";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [totalOrders, setTotalOrders] = useState(null);
  
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  
  const orderTableColumns = [
    {
      header: "Order Details",
      accessorKey: "items",
      cell: ({ getValue }) => {
        const orderDetails = getValue();

        return (
          <div>
            {orderDetails?.map((order) => (
              <div key={order._id}>
                {order.quantity}
                {" x "}
                {order.name}
              </div>
            ))}
          </div>
        );
      },
    },
    {
      header: "Delivery Address",
      accessorKey: "address",
      cell: ({ getValue }) => {
        const addressDetails = getValue();
        return (
          <div className="text-sm font-light">
            <p>{addressDetails.address}</p>
            <p>
              {addressDetails.city}, {addressDetails.city} - {addressDetails.pincode}
            </p>
            <p>{addressDetails.country}</p>
          </div>
        );
      },
    },
    {
      header: "Payment Method",
      accessorKey: "paymentMethod",
      cell: ({ getValue }) => {
        return <p className="text-center">{getValue()}</p>;
      },
    },
    {
      header: "Order Date",
      accessorKey: "createdAt",
      cell: ({ getValue }) => {
        return new Date(getValue()).toLocaleString();
      },
    },
    {
      header: "Total Amount",
      accessorKey: "totalPrice",
      cell: ({ getValue }) => {
        return (
          <p className="text-center">
            {currency} {getValue()}
          </p>
        );
      },
    },
    {
      header: "order Status",
      accessorKey: "status",
      cell: ({ getValue }) => {
        const badgeClass =
          getValue() === "delivered"
            ? "bg-green-500"
            : getValue() === "cancelled"
            ? "bg-red-500"
            : "bg-amber-300";
        return (
          <p
            className={`${badgeClass} text-white rounded-full flex items-center justify-center h-fit p-0.5`}
          >
            {getValue()}
          </p>
        );
      },
    },
    {
      header: "Change Status",
      accessorKey: "changeStatus",
      cell: ({ row }) => {
        return (
          <Select
            onValueChange={(status) => handleStatusChange(status, row.original._id)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Change Order Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select an Order Status</SelectLabel>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      },
    },
  ];

  const table = useReactTable({
    columns: orderTableColumns,
    data: orders,
    pageCount,
    state: { pagination },
    manualPagination: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  const fetchOrders = async () => {
    try {
      setIsOrdersLoading(true);
      const response = await axios.get(`${backendUrl}/orders`, {
        params: {
          page: pagination.pageIndex,
          limit: pagination.pageSize,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setOrders(response.data.orders);
        setPageCount(response.data.totalPages);
        setTotalOrders(response.data.totalOrders);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        console.log(error.message);
        toast.error(`Server error: ${error.message}`);
      }
    } finally {
      setIsOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [pagination.pageIndex, pagination.pageSize]);


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
        // await fetchOrders();
        setOrders((orders) =>
          orders.map((order) => {
            if (order._id === id) {
              order.status = status;
            }

            return order;
          })
        );
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
      <h2 className="mb-4 text-2xl">All Orders</h2>
      <div className="mb-4 w-full">
        <Select onValueChange={(size) => table.setPageSize(Number(size))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select No. of Product to be Displayed" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select No. of Orders to be Displayed</SelectLabel>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
              <SelectItem value="40">40</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="bg-accent">
              {hg.headers.map((header) => (
                <TableHead key={header.id} className="px-4">
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
              <TableCell colSpan={orderTableColumns.length} className="h-36 text-center">
                {isOrdersLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    Loading...
                  </div>
                ) : (
                  "No Orders"
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-3 p-2 items-start sm:flex-row sm:items-center justify-between w-full">
        {totalOrders && <p className="text-xl font-bold">Total Orders: {totalOrders}</p>}
        <p>
          Showing {pagination.pageIndex + 1} of {pageCount}{" "}
          Page
        </p>
        <div className="flex items-center gap-2">
          <Button
            className="cursor-pointer"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button>{table.getState().pagination.pageIndex + 1}</Button>
          <Button
            className="cursor-pointer"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Orders;
