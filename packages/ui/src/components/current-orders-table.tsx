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
import { DatePicker, getStartAndEndOfDay, useGetOrderItems, useGetOrders } from "..";
import { useGetOrgsByQuery } from "../hooks/orgHooks";
import { useGetUsers } from "../hooks/userHooks";
import { User } from "../models/userModels";
import { ColorfullTable } from "./colorfull-table";
import FilterableHeader from "./filterable-header";
import { TableIdColumn } from "./table-id-column";

// Define a default filter function
const fuzzyTextFilterFn: FilterFn<User> = (row, columnId, value) => {
    return row.getValue(columnId)?.toString().toLowerCase().includes(value.toLowerCase()) ?? false;
};

// Add this to make TypeScript happy (optional, based on your setup)
fuzzyTextFilterFn.autoRemove = val => !val;

interface CurrentOrdersTableProps {
    orgClerkId?: string;
    subtitle?: string;
    isInVangaurd?: boolean;
    getUserPath?: (user: User) => string; // New prop for generating user-specific paths
}

export const CurrentOrdersTable = ({ orgClerkId, subtitle, isInVangaurd, getUserPath }: CurrentOrdersTableProps) => {
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
    const orgId = org?.id;

    // Only fetch users if orgId is defined
    const { data: usersData, isLoading: isLoadingUsers } = useGetUsers({
        pageSize: pageSize,
        page: pageIndex,
        orgId: orgId ?? '', // This will now only be set if orgId is not undefined
    }, orgId !== undefined); // This second argument is a dependency array which includes orgId

    const columns: ColumnDef<User>[] = React.useMemo(() => {
        let baseColumns: ColumnDef<User>[] = [
            {
                accessorKey: 'first_name',
                header: ({ column }) => (
                    <FilterableHeader id={"first_name"} title={"First Name"} setFilters={setFilters} column={column} />
                ),
                enableSorting: true,
            },
            {
                accessorKey: 'last_name',
                header: ({ column }) => (
                    <FilterableHeader id={"last_name"} title={"Last Name"} setFilters={setFilters} column={column} />
                ),
                enableSorting: true,
            },
        ];

        if (isUserColorfull && !isInVangaurd) {
            baseColumns = baseColumns.concat([
                {
                    accessorKey: 'id',
                    header: ({ column }) => (
                        <FilterableHeader id={"id"} title={"ID"} setFilters={setFilters} column={column} />
                    ),
                    enableSorting: true,
                    cell: info => (
                        <TableIdColumn
                            id={info.row?.original?.id ?? ''}
                            getPath={() => getUserPath ? getUserPath(info.row.original) : `/users/${info.row?.original?.id}`}
                        />
                    ),
                },
            ]);
        }

        baseColumns = baseColumns.concat([
            {
                accessorKey: 'has_user_ordered',
                header: 'Has Ordered',
                enableSorting: false,
                cell: (info) => {
                    const user = info.row.original;

                    // if selectedDate exists, use it, otherwise use the current date
                    const dateToUse = selectedDate ?? new Date();
                    const { startDateStartOfDay, endDateEndOfDay } = getStartAndEndOfDay(dateToUse)
                    const { data: ordersData, isLoading: isLoadingOrders } = useGetOrders({
                        userId: user.id,
                        startDate: startDateStartOfDay,
                        endDate: endDateEndOfDay
                    });

                    if (isLoadingOrders) return <div>Loading...</div>;
                    const hasOrdered = ordersData && ordersData?.length > 0;
                    return (
                        <div className={`py-2 px-4 font-righteous text-white text-center rounded-lg w-fit ${hasOrdered ? 'bg-primary-spinach-green' : 'bg-red-500'}`}>
                            {hasOrdered ? 'Yes' : 'No'}
                        </div>
                    );
                }
            },
            {
                accessorKey: 'user_order_items',
                header: 'Order Items In Cart',
                enableSorting: false,
                cell: (info) => {
                    const user = info.row.original;

                    // if selectedDate exists, use it, otherwise use the current date
                    const dateToUse = selectedDate ?? new Date();
                    const { startDateStartOfDay, endDateEndOfDay } = getStartAndEndOfDay(dateToUse)
                    const { data: orderItemsData, isLoading: isLoadingOrderItems } = useGetOrderItems({
                        userId: user.id,
                        startDate: startDateStartOfDay.toISOString(),
                        endDate: endDateEndOfDay.toISOString(),
                        dateTimeField: 'delivery_date',
                    });

                    if (isLoadingOrderItems) return <div>Loading Order Items...</div>;

                    return (
                        <div>
                            <div className="text-center font-righteous pr-8">{orderItemsData?.length}</div>
                        </div>
                    );
                }
            },
        ]);

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
        data: usersData ?? [],
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

            <ColorfullTable<User>
                tableInstance={table}
                subtitle={subtitle}
                title={org?.name}
                isLoading={isLoadingUsers}
                enableDownload={true}
            />
        </>
    );
};
