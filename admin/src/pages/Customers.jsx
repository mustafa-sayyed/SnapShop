import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import axios from "axios";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Users() {
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);
  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState("");
  const [totalUsers, setTotalUsers] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const token = localStorage.getItem("token");

  const handleUserDelete = async (id) => {
    try {
      setIsDeletingUser(true);
      setDeletingUserId(id);
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/users/${id}/admin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("User deleted successfully");
        setUsers((users) => users.filter((user) => user._id !== id));
      }
    } catch (error) {
      const message = error.response?.data?.message ?? "Failed to delete user";
      toast.error(message);
      console.log("Error while deleting user: ", error);
    } finally {
      setIsDeletingUser(false);
      setDeletingUserId("");
    }
  };

  const getAllUsers = async () => {
    try {
      setIsUsersLoading(true);
      const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/all`, {
        params: {
          page: pagination.pageIndex,
          limit: pagination.pageSize,
          search: table.getColumn("name")?.getFilterValue() ?? "",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.data.success) {
        setUsers(result.data.users);
        setPageCount(result.data.totalPages);
        setTotalUsers(result.data.totalUsers);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUsersLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, [pagination.pageIndex, pagination.pageSize]);

  const subscriberTableColumns = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "createdAt",
      header: "Accoutn Created At",
      cell: ({ getValue }) => {
        return new Date(getValue()).toLocaleString();
      },
    },

    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        return (
          <Button
            variant="outline"
            onClick={() => handleUserDelete(row.original._id)}
            className="hover:text-red-500 cursor-pointer"
            disabled={isDeletingUser && deletingUserId === row.original._id}
          >
            {isDeletingUser && deletingUserId === row.original._id ? <Spinner /> : <Trash2 />}
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    columns: subscriberTableColumns,
    data: users,
    pageCount,
    manualPagination: true,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    getAllUsers();
  }, [table.getColumn("name")?.getFilterValue()]);

  return (
    <div className="w-full">
      <p className="mb-4 text-2xl">All Users</p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 w-full">
        <Input
          placeholder="Search User from Names..."
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
              <SelectLabel>Select No. of Users to be Displayed</SelectLabel>
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
              <TableCell
                colSpan={subscriberTableColumns.length}
                className="h-36 text-center"
              >
                {isUsersLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    Loading...
                  </div>
                ) : (
                  "No Users"
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-3 p-2 items-start sm:flex-row sm:items-center justify-between w-full">
        {totalUsers && <p className="text-xl font-bold">Total Users: {totalUsers}</p>}
        <p>
          Showing {table.getState().pagination.pageIndex + 1} of {pageCount} Pages
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

export default Users;
