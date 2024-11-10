'use client'

import { ColumnDef, ColumnFiltersState, PaginationState, SortingState, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState } from 'react';
import { useGetDeliveryJobById } from '..';
import { useGetBatchOrdersByIds } from '../hooks/batchOrderHooks'; // You might need to implement this hook
import { BatchOrder, BatchOrderStatus } from '../models/batchOrderModels';
import { ColorfullTable } from './colorfull-table';
import FilterableHeader from './filterable-header';
import { TableIdColumn } from './table-id-column';

export const BatchOrdersTable: React.FC<{ deliveryJobId: string }> = ({ deliveryJobId }) => {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    const { data: job } = useGetDeliveryJobById(deliveryJobId)

    const { data: batches, isLoading } = useGetBatchOrdersByIds(job?.batch_ids ?? [])

    const columns: ColumnDef<BatchOrder>[] = React.useMemo(() => [
        {
            accessorKey: 'id',
            header: ({ column }) => <FilterableHeader id={"id"} title={"ID"} column={column} setFilters={setFilters} />,
            cell: info => <TableIdColumn id={info.row?.original?.id ?? ''} getPath={() => `/jobs/${deliveryJobId}/batches/${info.row?.original?.id}`} />,
            enableSorting: true,
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <FilterableHeader id={"status"} title={"Status"} column={column} setFilters={setFilters} />,
            cell: info => info.getValue() as BatchOrderStatus,
            enableSorting: true,
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => <FilterableHeader id={"created_at"} title={"Created At"} column={column} setFilters={setFilters} />,
            enableSorting: true,
        },
        // Add more columns as needed
    ], [setFilters]);

    const pagination = React.useMemo(() => ({
        pageIndex,
        pageSize,
    }), [pageIndex, pageSize]);

    const table = useReactTable({
        data: batches ?? [],
        columns,
        state: {
            sorting,
            columnFilters: filters,
            pagination,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        manualPagination: true,
        pageCount: -1, // Assuming you handle total pages/count externally
    });

    return (
        <ColorfullTable<BatchOrder>
            tableInstance={table}
            title={'Batch Orders'}
            globalFilter={''}
            setGlobalFilter={() => { }}
            isLoading={isLoading} />
    );
};