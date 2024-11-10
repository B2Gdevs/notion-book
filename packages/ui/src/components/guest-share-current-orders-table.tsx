'use client'

import { useSession } from "@clerk/nextjs";
import {
    ColumnDef,
    ColumnFiltersState,
    FilterFn,
    PaginationState,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable
} from "@tanstack/react-table";
import * as React from 'react';
import { useState } from 'react';
import { DatePicker, Order, useGetOrders } from "..";
import { useGetOrgsByQuery } from "../hooks/orgHooks";
import { User } from "../models/userModels";
import { ColorfullTable } from "./colorfull-table";
import FilterableHeader from "./filterable-header";

// Define a default filter function
const fuzzyTextFilterFn: FilterFn<User> = (row, columnId, value) => {
    return row.getValue(columnId)?.toString().toLowerCase().includes(value.toLowerCase()) ?? false;
};

// Add this to make TypeScript happy (optional, based on your setup)
fuzzyTextFilterFn.autoRemove = val => !val;

interface GuestShareCurrentOrdersTableProps {
    orgClerkId?: string;
    subtitle?: string;
    isInVangaurd?: boolean;
    getUserPath?: (user: User) => string; // New prop for generating user-specific paths
}

export const GuestShareCurrentOrdersTable = ({ orgClerkId, subtitle, isInVangaurd, getUserPath }: GuestShareCurrentOrdersTableProps) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const session = useSession();
    const userEmail = session?.session?.user?.primaryEmailAddress?.emailAddress;
    const isUserColorfull = userEmail?.includes('@colorfull.ai')
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 500,
    });

    const { data: orgs } = useGetOrgsByQuery({ externalId: orgClerkId });
    const org = orgs?.[0];

    // Function to format date to YYYY-MM-DD
    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    }

    // Extract share ID from share_calendar
    const selectedDateFormatted = formatDate(selectedDate);
    const shareId = org?.share_calendar?.[selectedDateFormatted];

    // Use the shareId to fetch orders if it exists
    const { data: ordersData, isLoading: isLoadingOrders } = useGetOrders({ share_id: shareId }, shareId !== undefined);

    const columns: ColumnDef<Order>[] = React.useMemo(() => {
        let baseColumns: ColumnDef<Order>[] = [
            {
                accessorKey: 'share_guest_id',
                header: 'Guest Name',
                cell: info => {
                    const share_guest_id = info.row?.original.share_guest_id as string;
                    // Split the share_guest_id by "_" and take the first two elements for first and last name
                    const [first_name, last_name] = share_guest_id.split('_');
                    return (
                        <div className="font-righteous pr-8">{first_name} {last_name}</div>
                    );
                },
                enableSorting: false,
            },
            {
                accessorKey: 'items',
                header: 'Order Items',
                cell: info => {
                    const items = info.row?.original.items;
                    return (
                        <div>
                            {items?.map((item, index) => (
                                <div key={index} className="font-righteous pr-8">{item.name} x {item.quantity}</div>
                            ))}
                        </div>
                    );
                },
                enableSorting: false,
            }
        ];

        if (isUserColorfull && !isInVangaurd) {
            baseColumns = baseColumns.concat([
                {
                    accessorKey: 'id',
                    header: ({ column }) => (
                        <FilterableHeader id={"id"} title={"ID"} setFilters={setFilters} column={column} />
                    ),
                    enableSorting: true,
                    cell: info => info.row?.original?.id
                },
            ]);
        }
        
        return baseColumns;
    }, [setFilters, isUserColorfull, isInVangaurd, getUserPath, selectedDate]);

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const table = useReactTable({
        data: ordersData ?? [],
        columns,
        state: {
            sorting,
            columnFilters: filters,
            pagination
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        manualPagination: true, // Set to true if you're handling pagination server-side
        pageCount: -1, // Provide the total page count here if known, or -1 to indicate unknown page count
    });

    return (
        <>
            <DatePicker
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
                className='bg-primary-spinach-green w-fit mr-2'
            />

            <ColorfullTable<Order>
                tableInstance={table}
                subtitle={subtitle}
                title={`${org?.name} Guest Orders`}
                isLoading={isLoadingOrders}
                enableDownload={true}
            />
        </>
    );
};
