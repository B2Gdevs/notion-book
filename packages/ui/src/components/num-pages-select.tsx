import { Table } from "@tanstack/react-table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { TABLE_ROWS_PER_PAGE_VALUES } from "../constants/constants";
import { ReactElement } from "react";

export interface NumPagesSelectProps<TData> {
  table: Table<TData>
  defaultPageSize?: 10 | 20 | 30 | 40 | 50 | 100 
}

export function NumPagesSelect<TData>({ table, defaultPageSize = 10 }: NumPagesSelectProps<TData>): ReactElement {
  const pageSizeOptions = TABLE_ROWS_PER_PAGE_VALUES;

  // Ensure the defaultPageSize is in the pageSizeOptions
  if (!pageSizeOptions.includes(defaultPageSize)) {
    throw new Error(`Invalid defaultPageSize. Must be one of ${pageSizeOptions.join(', ')}`);
  }

  return (
    <Select
      value={`${table.getState().pagination.pageSize || defaultPageSize}`}
      onValueChange={(value) => {
        table.setPageSize(Number(value));
        table.setPageIndex(1); // Set page index to 1 when page size changes
      }}
    >
      <SelectTrigger className="h-8 w-[70px]">
        <SelectValue placeholder={table.getState().pagination.pageSize || defaultPageSize} />
      </SelectTrigger>
      <SelectContent side="top">
        {pageSizeOptions.map((pageSize) => (
          <SelectItem key={pageSize} value={`${pageSize}`}>
            {pageSize}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}