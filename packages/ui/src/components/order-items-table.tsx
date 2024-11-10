'use client'

import { ColumnDef, ColumnFiltersState, PaginationState, SortingState, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { Button, OrderItem, toast, useDeleteOrderItem, useGetOrderItems, useGetUser } from '..';
import { ColorfullTable } from './colorfull-table';
import { DataTableColumnHeader } from './datatable-column-header';
import { TableIdColumn } from './table-id-column';

interface OrderItemTableProps {
    userId?: string;
    storeId?: string;
}

export const OrderItemsTable: React.FC<OrderItemTableProps> = ({ userId, storeId }) => {
    const [mobilePage, setMobilePage] = useState(1);
    const [hasMoreOrderItems, setHasMoreOrderItems] = useState(true);
    const [sorting, setSorting] = useState<SortingState>([{ id: 'created_at', desc: true }]);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 1,
        pageSize: 10,
    });

    const deleteOrderItemMutation = useDeleteOrderItem({
        onSuccess: () => {
            toast({ title: 'Order item deleted' });
        },
    });

    const { data: orderItems, isLoading } = useGetOrderItems({
        page: mobilePage,
        pageSize,
        userId,
        storeId,
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
    });

    useEffect(() => {
        if (orderItems && orderItems.length < pageSize) {
            setHasMoreOrderItems(false);
        } else {
            setHasMoreOrderItems(true);
        }
    }, [orderItems, pageSize]);

    const columns: ColumnDef<OrderItem>[] = React.useMemo(() => [
        {
            accessorKey: 'name',
            header: ({ column }) => <DataTableColumnHeader column={column} title={"Name"} />,
            enableSorting: true,
        },
        {
            accessorKey: 'quantity',
            header: ({ column }) => <DataTableColumnHeader column={column} title={"Quantity"} />,
            enableSorting: true,
        },
        {
            accessorKey: 'price',
            header: ({ column }) => <DataTableColumnHeader column={column} title={"Price"} />,
            enableSorting: true,
            cell: info => `$${info.getValue()}`,
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => <DataTableColumnHeader column={column} title={"Created At"} />,
            enableSorting: true,
            cell: info => new Date(info.getValue() as string).toLocaleDateString(),
        },
        {
            accessorKey: 'delivery_date',
            header: ({ column }) => <DataTableColumnHeader column={column} title={"Delivery Date"} />,
            enableSorting: true,
            cell: info => {
                const dateValue = info.getValue() as string;
                return dateValue ? new Date(dateValue).toLocaleString() : '';
            },
        },
        {
            accessorKey: 'user_id',
            header: ({ column }) => <DataTableColumnHeader column={column} title={"User"} />,
            cell: info => {
                const { data: user } = useGetUser(info.row.original?.user_id ?? '');
                return (
                    <div className={'text-blue-500'}>
                        <TableIdColumn id={user?.first_name + " " + user?.last_name} getPath={() => `/users/${info.row.original?.user_id}`} />
                    </div>
                );
            },
            enableSorting: false,
        },
        {
            id: 'actions',
            header: ({ column }) => <DataTableColumnHeader column={column} title={"Actions"} />,
            cell: info => (
                <Button
                    className='bg-red-500 text-white'
                    onClick={() => {
                        if (confirm('Are you sure you want to delete this order item?')) {
                            deleteOrderItemMutation.mutate(info.row.original.id ?? '');
                        }
                    }}
                >
                    Delete
                </Button>
            ),
            enableSorting: false,
        },
    ], [deleteOrderItemMutation]);

    const table = useReactTable({
        data: orderItems ?? [],
        columns,
        state: {
            sorting,
            columnFilters: filters,
            pagination: { pageIndex, pageSize },
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setFilters,
        onPaginationChange: setPagination,
        manualPagination: true,
        pageCount: -1,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });


    return (
        <>
            <ColorfullTable<OrderItem>
                tableInstance={table}
                title='Order Items'
                globalFilter={''}
                setGlobalFilter={() => { }}
                isLoading={isLoading} />
            <div className='flex justify-between items-center mt-4'>
                <Button onClick={() => setMobilePage(prevPage => Math.max(prevPage - 1, 1))} disabled={pageIndex === 1}>Previous</Button>
                <Button onClick={() => setMobilePage(prevPage => prevPage + 1)} disabled={!hasMoreOrderItems}>Next</Button>
            </div>
        </>
    );
};