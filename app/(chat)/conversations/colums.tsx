"use client"

import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import Link from "next/link"

export const columns: ColumnDef<{
  id: string
  createdAt: Date
  city: string | null
  region: string | null
  country: string | null
}>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = format(row.getValue("createdAt"), "dd MMM yyyy, HH:mm")

      return <div className="text-right font-medium">{date}</div>
    },
  },
  {
    accessorKey: "city",
    header: "City",
  },
  {
    accessorKey: "country",
    header: "Country",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const conversation = row.original

      return <Link href={`conversations/${conversation.id}`}>Go</Link>
    },
  },
]
