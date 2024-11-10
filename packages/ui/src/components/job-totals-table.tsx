'use client'

import { ColumnDef, ColumnFiltersState, PaginationState, SortingState, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState } from 'react';
import { useDeleteDeliveryJobTotal, useGetDeliveryJobTotals } from '../hooks/totalHooks';
import { DeliveryJobTotal } from '../models/totalModels';
import { ColorfullTable } from './colorfull-table';
import { DataTableColumnHeader } from './datatable-column-header';
import { OrgSelect } from './org-select';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';

export const JobTotalsTable: React.FC = () => {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 1,
        pageSize: 10,
    });

    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    const { mutate: deleteDeliveryJobTotal, isLoading: isDeleting } = useDeleteDeliveryJobTotal({
        onSuccess: () => {
            toast({
                title: 'Job total deleted successfully.',
                duration: 5000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error deleting job total.',
                description: error.message,
                duration: 5000,
            });
        },
    });

    const { data: deliveryJobTotalData, isLoading } = useGetDeliveryJobTotals({
        page: pageIndex,
        pageSize,
        sort_by: "delivery_date",
        sort_direction: "desc",
    });

    const columns: ColumnDef<DeliveryJobTotal>[] = React.useMemo(() => [
        {
            accessorKey: 'delivery_date',
            header: ({ column }) => <DataTableColumnHeader title={"Delivery Date"} column={column} />,
            cell: info => {
                const dateValue = info.getValue() as string;
                const date = new Date(dateValue);
                return date.toLocaleDateString();
            },
            enableSorting: true,
        },
        {
            accessorKey: 'id',
            header: ({ column }) => <DataTableColumnHeader title={"ID"} column={column} />,
            cell: info => <div className='text-secondary-peach-orange'>{info.getValue() as string}</div>,
            enableSorting: true,
        },
        {
            accessorKey: 'org_id',
            header: ({ column }) => <DataTableColumnHeader title={"Org"} column={column} />,
            cell: info => {
                const initialOrgId = info.getValue() as string; // Cast to string assuming the date is in string format
                return <OrgSelect initialOrgId={initialOrgId} disabled={true} />
            },
            enableSorting: true,
        },
        {
            accessorKey: 'subsidy_total',
            header: ({ column }) => <DataTableColumnHeader title={"Subsidy Total"} column={column} />,
            cell: info => <div>{info.getValue()?.toString() ?? 'Unknown'}</div>,
            enableSorting: true,
        },
        {
            accessorKey: 'tax_total',
            header: ({ column }) => <DataTableColumnHeader title={"Tax Total"} column={column} />,
            cell: info => <div>{info.getValue()?.toString() ?? 'Unknown'}</div>,
            enableSorting: true,
        },
        {
            accessorKey: 'subtotal',
            header: ({ column }) => <DataTableColumnHeader title={"Subtotal"} column={column} />,
            cell: info => <div>{info.getValue()?.toString() ?? 'Unknown'}</div>,
            enableSorting: true,
        },
        {
            accessorKey: 'delivery_fee',
            header: ({ column }) => <DataTableColumnHeader title={"Delivery Fee"} column={column} />,
            cell: info => <div>{info.getValue()?.toString() ?? 'Unknown'}</div>,
            enableSorting: true,
        },
        {
            accessorKey: 'total',
            header: ({ column }) => <DataTableColumnHeader title={"Total"} column={column} />,
            cell: info => <div>{info.getValue()?.toString() ?? 'Unknown'}</div>,
            enableSorting: true,
        },
        {
            accessorKey: 'id',
            header: 'Actions',
            cell: info => (
                <Button
                    onClick={() => {
                        if (window.confirm('Are you sure you want to delete this delivery job total?')) {
                            deleteDeliveryJobTotal(info.row.original.id as string);
                        }
                    }}
                    disabled={isDeleting}
                    variant='destructive'
                >
                    Delete
                </Button>
            ),
        },
        // Add more columns as needed
    ], [setFilters, deleteDeliveryJobTotal, isDeleting]);

    const pagination = React.useMemo(() => ({
        pageIndex,
        pageSize,
    }), [pageIndex, pageSize]);

    const table = useReactTable({
        data: deliveryJobTotalData ?? [],
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
        pageCount: -1,
    });

    return (
        <ColorfullTable<DeliveryJobTotal>
            tableInstance={table}
            title={'Delivery Job Totals'}
            isLoading={isLoading}
        />
    );
};