'use client';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { ReactElement } from "react";
import { Button } from "./ui/button";
import { NumPagesSelect, NumPagesSelectProps } from "./num-pages-select";
import { DEFAULT_TABLE_PAGE_SIZE } from "../constants/constants";

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  defaultNumPagesProps?: NumPagesSelectProps<TData>
}
export function DataTablePagination<TData>({
  table,
  defaultNumPagesProps = {
    defaultPageSize: DEFAULT_TABLE_PAGE_SIZE,
    table: table
  }
}: DataTablePaginationProps<TData>): ReactElement {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between px-2">
      <div className="flex-1 text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium ml-2 ">Rows per page</p>
          <NumPagesSelect {...defaultNumPagesProps} />
        </div>

        <Button
            variant="outline"
            className="h-8 w-8 p-0 text-black border-black"
            onClick={() => table.previousPage()}
            disabled={table.getState().pagination.pageIndex === 1}
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {table.getState().pagination.pageIndex}
        </div>
        <Button
          variant="outline"
          className="h-8 w-8 p-0 text-black border-black"
          onClick={() => table.nextPage()}
          disabled={table.getRowModel().rows.length !== table.getState().pagination.pageSize}
        >
          <ChevronRightIcon className="h-4 w-4" />
        </Button>

      </div>
    </div>
  )
}