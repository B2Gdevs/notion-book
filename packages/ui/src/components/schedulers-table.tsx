'use client'

import { ColumnDef, ColumnFiltersState, PaginationState, SortingState, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState } from 'react';
import { useDeleteScheduler, useGetSchedulers } from '../hooks/schedulerHooks';
import { Scheduler, SchedulerStatus } from '../models/schedulerModels';
import { ColorfullTable } from './colorfull-table';
import { ConfirmationDialog } from './confirmation-dialog'; // Make sure this import path is correct
import { DataTableColumnHeader } from './datatable-column-header';
import FilterableHeader from './filterable-header';
import { TableIdColumn } from './table-id-column';
import { Button } from './ui/button';

export const SchedulersTable: React.FC = () => {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 1,
        pageSize: 10,
    });

    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const { data: schedulerData, isLoading } = useGetSchedulers({
        page: pageIndex,
        page_size: pageSize,
    });

    const { mutate: deleteScheduler } = useDeleteScheduler({
        onSuccess: () => {
            // Optionally, refetch the scheduler list or use query invalidation to update the list
        },
        onError: (error) => {
            console.error("Failed to delete scheduler:", error);
        },
    });

    const handleDeleteClick = (schedulerId: string) => {
        setPendingDeleteId(schedulerId);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (pendingDeleteId) {
            deleteScheduler(pendingDeleteId);
            setIsDialogOpen(false); // Close the dialog after confirming
            setPendingDeleteId(null); // Reset pending delete ID
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setPendingDeleteId(null); // Optionally reset pending delete ID on close
    };

    const columns: ColumnDef<Scheduler>[] = React.useMemo(() => [
        {
            accessorKey: 'job_name',
            header: ({ column }) => <FilterableHeader id={"job_name"} title={"Job Name"} column={column} setFilters={setFilters} />,
            enableSorting: true,
        },
        {
            accessorKey: 'id',
            header: ({ column }) => <FilterableHeader id={"id"} title={"ID"} column={column} setFilters={setFilters} />,
            cell: info => <TableIdColumn id={info.row?.original?.id ?? ''} getPath={() => {
                alert("navigating to scheduler not implemented");
                return "/placeholder-path";
            }} />,
        },
        {
            accessorKey: 'job_status',
            header: ({ column }) => <DataTableColumnHeader title={"Status"} column={column} />,
            cell: info => info.getValue() === SchedulerStatus.PAUSED ? 'Paused' : 'Active',
            enableSorting: true,
        },
        {
            accessorKey: 'cron_schedule',
            header: ({ column }) => <DataTableColumnHeader title={"Cron Schedule"} column={column} />,
            enableSorting: true,
        },
        {
            accessorKey: 'delete',
            header: () => <span>Delete</span>,
            cell: info => <Button variant={'destructive'} onClick={() => handleDeleteClick(info?.row?.original.id ?? '')}>Delete</Button>,
        },
    ], [handleDeleteClick]);

    const pagination = React.useMemo(() => ({
        pageIndex,
        pageSize,
    }), [pageIndex, pageSize]);

    const table = useReactTable({
        data: schedulerData ?? [],
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
        <>
            <ColorfullTable<Scheduler>
                tableInstance={table}
                title={'Schedulers'}
                isLoading={isLoading}
            />
            <ConfirmationDialog
                isOpen={isDialogOpen}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmDelete}
                message="Are you sure you want to delete this scheduler?"
            />
        </>
    );
};