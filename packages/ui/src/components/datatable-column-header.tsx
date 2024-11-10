import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretSortIcon,
  EyeNoneIcon,
} from "@radix-ui/react-icons"
import { Column } from "@tanstack/react-table"

import React, { ReactElement } from 'react'
import { cn } from "../lib/utils"
import { accessorKeyMapping } from "./orders-table"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
  setSortBy?: (columnId: string) => void
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  setSortBy,
}: DataTableColumnHeaderProps<TData, TValue>): ReactElement {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span className="font-righteous text-primary-almost-black">{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" />
            ) : (
              <CaretSortIcon className="ml-2 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => {
            const originalAccessorKey = accessorKeyMapping[column.id] || column.id;
            if (setSortBy) {
              setSortBy(originalAccessorKey === 'fulfillment_info.delivery_time' ? originalAccessorKey : '');
            };
            column.toggleSorting(false);
          }}>
            <ArrowUpIcon className="mr-2 h-3.5 w-3.5  " />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            const originalAccessorKey = accessorKeyMapping[column.id] || column.id;
            if (setSortBy) {
              setSortBy(originalAccessorKey === 'fulfillment_info.delivery_time' ? originalAccessorKey : '');
            };
            column.toggleSorting(true);
          }}>
            <ArrowDownIcon className="mr-2 h-3.5 w-3.5  " />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeNoneIcon className="mr-2 h-3.5 w-3.5  " />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
