import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import axios from "axios";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Subscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [isSubscriberLoading, setIsSubscriberLoading] = useState(false);
  const [isDeletingSubscriber, setIsDeletingSubscriber] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubscriberDelete = async (id) => {
    try {
      setIsDeletingSubscriber(true);
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/subscribers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        toast.success("Subscriber deleted successfully");
        setSubscribers((subscribers) => subscribers.filter((subs) => subs._id != id));
      }
    } catch (error) {
      const message = error.response?.data?.message ?? "Failed to delete subscriber";
      toast.error(message);
      console.log("Error while deleting subscriber: ", error);
    } finally {
      setIsDeletingSubscriber(false);
    }
  };

  const getAllSubscribers = async () => {
    try {
      setIsSubscriberLoading(true);
      const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/subscribers`);
      if (result.data.success) {
        setSubscribers(result.data.subscribers);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubscriberLoading(false);
    }
  };

  useEffect(() => {
    getAllSubscribers();
  }, []);

  const subscriberTableColumns = [
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "subscribedAt",
      header: "Subscribed At",
      cell: ({ getValue }) => {
        return new Date(getValue()).toLocaleString();
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        return (
          <p
            className={` rounded-full flex items-center justify-center w-fit px-4 h-fit p-0.5 ${
              getValue() === "active" ? "bg-green-500" : "bg-amber-300"
            }`}
          >
            {getValue()}
          </p>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        return (
          <Button
            variant="outline"
            onClick={() => handleSubscriberDelete(row.original._id)}
            className="hover:text-red-500 cursor-pointer"
            disabled={isDeletingSubscriber}
          >
            {isDeletingSubscriber ? <Spinner /> : <Trash2 />}
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    columns: subscriberTableColumns,
    data: subscribers,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <p className="mb-4 text-2xl">All Subscribers</p>
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
                {isSubscriberLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    Loading...
                  </div>
                ) : (
                  "No Subscribers"
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default Subscribers;
