import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export const productListColumns = [
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
    }
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
  },
];