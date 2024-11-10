'use client'

import { ColumnDef, ColumnFiltersState, PaginationState, SortingState, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import React, { useCallback, useState } from 'react';
import { useDeleteInvoice, useGetInvoices, useUpdateInvoice } from '../hooks/invoiceHooks';
import { Invoice } from '../models/invoiceModels';
import { ColorfullTable } from './colorfull-table';
import { DataTableColumnHeader } from './datatable-column-header';
import FilterableHeader from './filterable-header';
import { TableIdColumn } from './table-id-column';
import { Button } from './ui/button'; // Assuming Button component exists for simplicity
import { toast } from './ui/use-toast';

export const InvoicesTable: React.FC = () => {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const updateInvoiceMutation = useUpdateInvoice({
        onSuccess: () => {
            toast({
                title: 'Invoice updated',
            });
        },
    });
    const deleteInvoiceMutation = useDeleteInvoice({
        onSuccess: () => {
            toast({
                title: 'Invoice deleted successfully',
            });
        },
        onError: (error) => {
            toast({
                title: 'Error deleting invoice',
                description: error instanceof Error ? error.message : 'An error occurred',
            });
        },
    });
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    const { data: invoiceData, isLoading } = useGetInvoices({
        page: pageIndex,
        pageSize,
    });

    const handleDeleteInvoice = useCallback((invoiceId: string) => {
        deleteInvoiceMutation.mutate(invoiceId);
    }, [deleteInvoiceMutation]);

    const columns: ColumnDef<Invoice>[] = React.useMemo(() => [
        {
            accessorKey: 'amount',
            header: ({ column }) => <FilterableHeader id={"amount"} title={"Amount"} column={column} setFilters={setFilters} />,
            enableSorting: true,
        },
        {
            accessorKey: 'id',
            header: ({ column }) => <FilterableHeader id={"id"} title={"ID"} column={column} setFilters={setFilters} />,
            cell: info => <TableIdColumn id={info.row?.original?.id ?? ''} getPath={() => `/invoices/${info.row?.original?.id}`} />,
            enableSorting: true,
        },
        {
            accessorKey: 'org_id',
            header: ({ column }) => <DataTableColumnHeader title={"Org ID"} column={column} />,
            enableSorting: true,
        },
        {
            accessorKey: 'payment_status',
            header: ({ column }) => <DataTableColumnHeader title={"Payment Status"} column={column} />,
            enableSorting: true,
        },
        {
            id: 'delete',
            header: () => <span>Delete</span>,
            cell: ({ row }) => (
                <Button onClick={() => handleDeleteInvoice(row?.original?.id ?? '')} color="red">
                    Delete
                </Button>
            ),
        },
    ], [setFilters, updateInvoiceMutation, handleDeleteInvoice]);

    const pagination = React.useMemo(() => ({
        pageIndex,
        pageSize,
    }), [pageIndex, pageSize]);

    const table = useReactTable({
        data: invoiceData ?? [],
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
        <ColorfullTable<Invoice>
            tableInstance={table}
            title={'Invoices'}
            isLoading={isLoading} />
    );
};