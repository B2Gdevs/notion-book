'use client'

import { ColumnDef, ColumnFiltersState, PaginationState, SortingState, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState } from 'react';
import { useGetDeliveryJobs } from '../hooks/deliveryJobHooks';
import { DeliveryJob, DeliveryJobStatus } from '../models/deliveryJobModels';
import { ColorfullTable } from './colorfull-table';
import FilterableHeader from './filterable-header';
import { TableIdColumn } from './table-id-column';

export const DeliveryJobsTable: React.FC = () => {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    const { data: deliveryJobData, isLoading } = useGetDeliveryJobs({
        page: pageIndex,
        pageSize,
    });

    const columns: ColumnDef<DeliveryJob>[] = React.useMemo(() => [
        {
            accessorKey: 'id',
            header: ({ column }) => <FilterableHeader id={"id"} title={"ID"} column={column} setFilters={setFilters} />,
            cell: info => <TableIdColumn id={info.row?.original?.id ?? ''} getPath={() => `/jobs/${info.row?.original?.id}`} />,
            enableSorting: true,
        },
        {
            accessorKey: 'org_id',
            header: ({ column }) => <FilterableHeader id={"org_id"} title={"Org ID"} column={column} setFilters={setFilters} />,
            enableSorting: true,
        },
        {
            accessorKey: 'status',
            header: ({ column }) => <FilterableHeader id={"status"} title={"Status"} column={column} setFilters={setFilters} />,
            cell: info => info.getValue() as DeliveryJobStatus,
            enableSorting: true,
        },
        {
            accessorKey: 'payment_status',
            header: ({ column }) => <FilterableHeader id={"payment_status"} title={"Payment Status"} column={column} setFilters={setFilters} />,
            enableSorting: true,
        },
        {
            accessorKey: 'created_at',
            header: ({ column }) => <FilterableHeader id={"created_at"} title={"Created At"} column={column} setFilters={setFilters} />,
            enableSorting: true,
        },
        {
            accessorKey: 'updated_at',
            header: ({ column }) => <FilterableHeader id={"updated_at"} title={"Updated At"} column={column} setFilters={setFilters} />,
            enableSorting: true,
        },
        {
            accessorKey: 'batches',
            header: 'Batch Orders',
            cell: info => <TableIdColumn id={info.row?.original?.batch_ids.join(',') ?? ''} getPath={() => `/jobs/${info.row?.original?.id}/batches`} />,
        },
        // Add more columns as needed
    ], [setFilters]);

    const pagination = React.useMemo(() => ({
        pageIndex,
        pageSize,
    }), [pageIndex, pageSize]);

    const table = useReactTable({
        data: deliveryJobData ?? [],
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
        <ColorfullTable<DeliveryJob>
            tableInstance={table}
            title={'Delivery Jobs'}
            globalFilter={''}
            setGlobalFilter={() => { }}
            isLoading={isLoading} />
    );
};