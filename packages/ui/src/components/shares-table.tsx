'use client'

import { ColumnDef, ColumnFiltersState, PaginationState, SortingState, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import React, { useState } from 'react';
import { useGetOrg } from '..';
import { ShareParams } from '../clients/shareClient';
import { useDeleteShare, useGetShares } from '../hooks/shareHooks';
import { Share } from '../models/shareModels';
import { ColorfullTable } from './colorfull-table';
import { DataTableColumnHeader } from './datatable-column-header';
import { TableIdColumn } from './table-id-column';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogPrimitive } from './ui/dialog';
import { toast } from './ui/use-toast';

interface SharesTableProps {
    timezone: string;
}

export const SharesTable: React.FC<SharesTableProps> = ({ timezone }) => {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 1,
        pageSize: 10,
    });
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([{ id: 'date', desc: true }]);
    const [selectedShare, setSelectedShare] = useState<Share | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const deleteShareMutation = useDeleteShare();

    const params: ShareParams = {
        page: pageIndex,
        pageSize,
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
    };

    const { data: sharesData, isLoading } = useGetShares(params);

    const handleOpenDeleteDialog = (share: Share) => {
        setSelectedShare(share);
        setIsDeleteDialogOpen(true);
    };

    const handleCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    const handleDeleteShare = (id: string) => {
        deleteShareMutation.mutate(id, {
            onSuccess: () => {
                toast({
                    title: 'Delete Successful',
                    description: 'The share has been deleted successfully.',
                    duration: 3000,
                });
                handleCloseDeleteDialog();
            },
            onError: (error) => {
                toast({
                    title: 'Delete Failed',
                    description: `Failed to delete share: ${error}`,
                    duration: 3000,
                });
                handleCloseDeleteDialog();
            },
        });
    };

    const columns: ColumnDef<Share>[] = React.useMemo(() => [
        {
            accessorKey: 'date',
            header: ({ column }) => <DataTableColumnHeader id={"date"} title={"Date"} column={column} />,
            cell: info => {
                const utcDate = new Date(info.getValue() as string);
                const zonedDate = utcToZonedTime(utcDate, timezone);
                return format(zonedDate, 'MM-dd-yyyy');
            },
            enableSorting: true,
        },
        {
            accessorKey: 'id',
            header: ({ column }) => <DataTableColumnHeader id={"id"} title={"ID"} column={column} />,
            cell: info => <TableIdColumn id={info.row?.original?.id ?? ''} getPath={() => `/shares/${info.row?.original?.id}`} />,
            enableSorting: true,
        },
        {
            accessorKey: 'org_id',
            header: ({ column }) => <DataTableColumnHeader id={"org_id"} title={"Org ID"} column={column} />,
            enableSorting: true,
        },
        {
            accessorKey: 'org_id',
            header: 'Org Name',
            cell: info => {
                const orgId = info.getValue() as string;
                const { data: org } = useGetOrg(orgId);
                return org?.name ?? 'Loading...';
            },
            enableSorting: false,
        },
        {
            accessorKey: 'guests',
            header: '# Guests',
            cell: info => info.getValue(),
            enableSorting: false,
        },
        {
            accessorKey: 'budget',
            header: 'Budget',
            cell: info => info.getValue(),
            enableSorting: false,
        },
        {
            accessorKey: 'order_ids',
            header: 'Order IDs',
            cell: info => {
                const orderIds = info.row?.original?.order_ids ?? [];
                return orderIds.map((id: string) => (
                    <div key={id} className={'text-blue-500'}>
                        <TableIdColumn id={id} getPath={() => `/orders/${id}`} />
                    </div>
                ));
            },
            enableSorting: false,
        },
        {
            accessorKey: 'order_total_ids',
            header: 'Order Total IDs',
            cell: info => {
                const orderTotalIds = info.getValue() as string[];
                return (
                    <div>
                        {orderTotalIds.map((id: string) => (
                            <div key={id}>
                                {id}
                            </div>
                        ))}
                    </div>
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: 'id',
            header: 'Actions',
            cell: info => {
                const share = info.row.original;
                return (
                    <div className="flex gap-2">
                        <Button onClick={() => handleOpenDeleteDialog(share)}>Delete</Button>
                    </div>
                );
            },
            enableSorting: false,
        },
    ], [setFilters]);

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );

    const table = useReactTable({
        data: sharesData ?? [],
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
        manualPagination: true,
        pageCount: -1,
    });



    return (
        <>
            <ColorfullTable<Share>
                tableInstance={table}
                title={'Shares'}
                isLoading={isLoading}
            />

            {/* Delete Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={handleCloseDeleteDialog}>
                <DialogContent className="bg-transparent overflow-y-auto max-h-[100vh] w-full border-none shadow-none" isSticky={true}>
                    <div className="bg-primary-off-white p-4 flex flex-col justify-center items-center gap-4 text-center">
                        <span className='text-2xl'>Are you sure you want to delete this share?</span>
                        <span className='text-2xl font-righteous'>ID: {selectedShare?.id}</span>
                        <span className='italic'>This will delete all orders that have been placed by guests who have used this link. This action cannot be undone.</span>
                        <div className='flex justify-center items-center gap-2'>
                            <Button
                                className='font-righteous'
                                onClick={() => handleDeleteShare(selectedShare?.id ?? '')}>
                                Yes, Delete Share
                            </Button>
                            <DialogPrimitive.Close
                                className='ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
                                onClick={handleCloseDeleteDialog}
                            >
                                <Button className='font-righteous' variant='destructive'>No, Go Back</Button>
                                <span className='sr-only'>Close</span>
                            </DialogPrimitive.Close>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};