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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import axios from "axios";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import parse from "html-react-parser";
import "react-quill-new/dist/quill.snow.css";

function EmailHistory() {
  const [emails, setEmails] = useState([]);
  const [isEmailsLoading, setIsEmailsLoading] = useState(false);
  const [totalEmails, setTotalEmails] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });

  const token = localStorage.getItem("token");

  const getAllEmails = async () => {
    try {
      setIsEmailsLoading(true);
      const result = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/emails`, {
        params: {
          page: pagination.pageIndex,
          limit: pagination.pageSize,
          search: table.getColumn("subject")?.getFilterValue() ?? "",
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.data.success) {
        setEmails(result.data.emails);
        setPageCount(result.data.totalPages);
        setTotalEmails(result.data.totalEmails);
      }
    } catch (error) {
      const message = error.response?.data?.message ?? "Failed to fetch email history";
      toast.error(message);
      console.log("Error while fetching emails: ", error);
    } finally {
      setIsEmailsLoading(false);
    }
  };

  const emailTableColumns = [
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "audience",
      header: "Audience",
      cell: ({ getValue }) => {
        const audience = getValue();
        const badgeClass =
          audience === "all"
            ? "bg-blue-500"
            : audience === "subscribers"
            ? "bg-green-500"
            : "bg-purple-500";
        return (
          <p
            className={`${badgeClass} text-white rounded-full flex items-center justify-center w-fit px-3 h-fit py-0.5 capitalize`}
          >
            {audience}
          </p>
        );
      },
    },
    {
      accessorKey: "recipientCount",
      header: "Recipients",
      cell: ({ getValue }) => {
        return <p className="text-center">{getValue() ?? "N/A"}</p>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue();
        const badgeClass =
          status === "sent"
            ? "bg-green-500"
            : status === "failed"
            ? "bg-red-500"
            : status === "pending"
            ? "bg-amber-300"
            : "bg-gray-500";
        return (
          <p
            className={`${badgeClass} text-white rounded-full flex items-center justify-center w-fit px-3 h-fit py-0.5 capitalize`}
          >
            {status}
          </p>
        );
      },
    },
    {
      accessorKey: "sentAt",
      header: "Sent At",
      cell: ({ getValue }) => {
        const date = getValue();
        return date ? new Date(date).toLocaleString() : "N/A";
      },
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => {
        return (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="cursor-pointer">
                <Eye />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-6xl w-full max-h-[80vh] overflow-x-hidden p-6 wrap-break-word">
              <DialogHeader className="text-start mt-8">
                <DialogTitle>{row.original.subject}</DialogTitle>
                <DialogDescription>
                  Sent to {row.original.audience} • {row.original.recipientCount ?? 0}{" "}
                  recipients
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <div className="text-sm py-2">
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    <span className="capitalize">{row.original.status}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Sent At:</span>{" "}
                    {row.original.sentAt
                      ? new Date(row.original.sentAt).toLocaleString()
                      : "N/A"}
                  </div>
                </div>
                <div className="border rounded-md p-4">
                  <p className="font-semibold mb-2">Email Content:</p>
                  <div className="wrap-break-word break-all whitespace-normal">{parse(row.original.content)}</div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        );
      },
    },
  ];

  const table = useReactTable({
    columns: emailTableColumns,
    data: emails,
    pageCount,
    manualPagination: true,
    state: { pagination },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    getAllEmails();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    table.getColumn("subject")?.getFilterValue(),
  ]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 1 }));
  }, [table.getColumn("subject")?.getFilterValue()]);

  return (
    <div className="w-full">
      <p className="mb-4 text-2xl">Email History</p>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 w-full">
        <Input
          placeholder="Search by Subject..."
          className="max-w-md"
          value={table.getColumn("subject")?.getFilterValue() ?? ""}
          onChange={(e) => table.getColumn("subject")?.setFilterValue(e.target.value)}
        />
        <Select onValueChange={(size) => table.setPageSize(Number(size))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select No. of Emails to be Displayed" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select No. of Emails to be Displayed</SelectLabel>
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
              <TableCell colSpan={emailTableColumns.length} className="h-36 text-center">
                {isEmailsLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Spinner />
                    Loading...
                  </div>
                ) : (
                  "No Emails Found"
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex flex-col gap-3 p-2 items-start sm:flex-row sm:items-center justify-between w-full">
        {totalEmails && <p className="text-xl font-bold">Total Emails: {totalEmails}</p>}
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

export default EmailHistory;
