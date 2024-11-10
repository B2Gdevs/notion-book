'use client'

import { ColumnDef, PaginationState, SortingState, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState } from 'react';
import { DEFAULT_GLOBAL_FILTER_PAGE_SIZE } from '..';
import { useGetOrg, useGetOrgsByQuery, useUpdateOrg } from '../hooks/orgHooks';
import { Org, OrgType } from '../models/orgModels';
import { ColorfullTable } from './colorfull-table';
import { DataTableColumnHeader } from './datatable-column-header';
import FilterableHeader from './filterable-header';
import { TableIdColumn } from './table-id-column';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogPrimitive } from './ui/dialog';
import { toast } from './ui/use-toast';

export const OrgsTable: React.FC = () => {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 1,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);
    const [isActiveTogglerOpen, setIsActiveTogglerOpen] = useState(false);
    const [globalFilter, setGlobalFilter] = useState("");

    const updateOrgMutation = useUpdateOrg({
        onSuccess: () => {
            toast({
                title: 'Update Successful',
                description: 'The organization has been updated successfully.',
                duration: 3000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Update Failed',
                description: `Failed to update organization: ${error.message}`,
                duration: 3000,
            });
        },
    });

    const { data: orgData, isLoading } = useGetOrgsByQuery({
        page: globalFilter ? 1 : pageIndex,
        pageSize: globalFilter ? DEFAULT_GLOBAL_FILTER_PAGE_SIZE : pageSize,
        sortBy: "name",
        sortDirection: "asc",
    });

    const handleOpenActiveToggler = (org: Org) => {
        setSelectedOrg(org);
        setIsActiveTogglerOpen(true);
    };

    const handleCloseActiveToggler = () => {
        setIsActiveTogglerOpen(false);
    };

    const handleChangeOrgActiveStatus = (id: string) => {
        const isOrgIdValid = id === selectedOrg?.id;
        if (!isOrgIdValid) {
            toast({
                title: 'Error',
                description: 'Org ID being passed does not match selectedOrg id.',
                duration: 3000,
            });
            handleCloseActiveToggler();
            return;
        }
        if (!selectedOrg) {
            toast({
                title: 'Error',
                description: 'No org selected to update active status.',
                duration: 3000,
            });
            handleCloseActiveToggler();
            return;
        }
        const updatedOrg = { ...selectedOrg, is_active: !selectedOrg.is_active };
        updateOrgMutation.mutate(updatedOrg);
        handleCloseActiveToggler();
    }

    const columns: ColumnDef<Org>[] = React.useMemo(() => [
        {
            accessorKey: 'name',
            header: ({ column }) => <FilterableHeader id={"name"} title={"Name"} column={column} />,
            enableSorting: true,
        },
        {
            accessorKey: 'id',
            header: ({ column }) => <FilterableHeader id={"id"} title={"ID"} column={column} />,
            cell: info => <TableIdColumn id={info.row?.original?.id ?? ''} getPath={() => `/orgs/${info.row?.original?.id}`} />,
            enableSorting: true,
        },
        {
            accessorKey: 'admin_email',
            header: ({ column }) => <FilterableHeader id={"admin_email"} title={"Admin Email"} column={column} />,
            enableSorting: true,
        },
        {
            accessorKey: 'external_id',
            header: ({ column }) => <FilterableHeader id={"external_id"} title={"External ID"} column={column} />,
            enableSorting: true,
        },
        {
            accessorKey: 'is_active',
            header: ({ column }) => <DataTableColumnHeader id={"is_active"} title={"Active Status"} column={column} />,
            cell: (info) => {
                const isRecipient = info.row?.original?.org_type === OrgType.RECIPIENT;
                if (!isRecipient) return <div>Not recipient</div>;
                const isActive = info.row?.original?.is_active;
                const orgId = info.row?.original?.id;
                const { data: org } = useGetOrg(orgId ?? '')
                return (
                    <Button
                        className={`py-2 px-4 font-righteous text-white text-center rounded-lg w-fit ${isActive ? 'bg-primary-spinach-green' : 'bg-red-500'}`}
                        onClick={() => handleOpenActiveToggler(org ?? {} as Org)}
                    >
                        {isActive ? 'Active' : 'Inactive'}
                    </Button>
                );
            },
            enableSorting: false,
        },
    ], []);

    const pagination = React.useMemo(() => ({
        pageIndex,
        pageSize,
    }), [pageIndex, pageSize]);

    const table = useReactTable({
        data: orgData ?? [],
        columns,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        manualPagination: true,
        pageCount: -1,
    });


    return (
        <div>
            <Dialog open={isActiveTogglerOpen} onOpenChange={handleCloseActiveToggler} >
                <DialogContent className="bg-transparent overflow-y-auto max-h-[100vh] w-full border-none shadow-none" isSticky={true}>
                    <div className="bg-primary-off-white p-4 flex flex-col justify-center items-center gap-4 text-center">
                        <span className='text-2xl'>Are you sure you want to change the active status of this org?</span>
                        <span className='text-2xl font-righteous'>{selectedOrg?.name}</span>
                        <span className='italic'>Active orgs will be eligible for daily reminder emails.</span>
                        <div className='flex justify-center items-center gap-2'>
                            <Button
                                className='font-righteous'
                                onClick={() => handleChangeOrgActiveStatus(selectedOrg?.id ?? '')}>
                                Yes, Change Active Status
                            </Button>
                            <DialogPrimitive.Close
                                className='ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
                                onClick={handleCloseActiveToggler}
                            >
                                <Button className='font-righteous' variant='destructive'>No, Go Back</Button>
                                <span className='sr-only'>Close</span>
                            </DialogPrimitive.Close>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
            <ColorfullTable<Org>
                tableInstance={table}
                title={'Orgs'}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
                isLoading={isLoading}
                globalFilterEnabled={true}
            />
        </div>
    );
};