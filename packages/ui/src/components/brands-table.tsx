'use client'

import { ColumnDef, PaginationState, SortingState, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState } from 'react';
import { DEFAULT_GLOBAL_FILTER_PAGE_SIZE } from '..';
import { useGetBrands, useUpdateBrand } from '../hooks/brandHooks';
import { Brand } from '../models/brandModels';
import { ColorfullTable } from './colorfull-table';
import { DataTableColumnHeader } from './datatable-column-header';
import FilterableHeader from './filterable-header';
import { OrgSelect } from './org-select';
import { TableIdColumn } from './table-id-column';
import { toast } from './ui/use-toast';

export const BrandsTable: React.FC = () => {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 1,
        pageSize: 10,
    });
    const updateBrandMutation = useUpdateBrand({
        onSuccess: () => {
            // Do something on success
            toast({
                title: 'Brand updated',
            })
        }

    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const { data: brandData, isLoading } = useGetBrands({
        page: globalFilter ? 1 : pageIndex,
        pageSize: globalFilter ? DEFAULT_GLOBAL_FILTER_PAGE_SIZE : pageSize, 
    });

    const columns: ColumnDef<Brand>[] = React.useMemo(() => [
        {
            accessorKey: 'name',
            header: ({ column }) => <FilterableHeader id={"name"} title={"Name"} column={column} />,
            enableSorting: true,
        },
        {
            accessorKey: 'id',
            header: ({ column }) => <FilterableHeader id={"id"} title={"ID"} column={column} />,
            cell: info => <TableIdColumn id={info.row?.original?.id ?? ''} getPath={() => `/orgs/${info.row?.original?.org_id}/stores`} />,
            enableSorting: true,
        },
        {
            accessorKey: 'org_id',
            header: ({ column }) => <DataTableColumnHeader title={"Org"} column={column} />,
            cell: info => {
                const initialOrgId = info.getValue() as string; // Cast to string assuming the date is in string format
                return <OrgSelect initialOrgId={initialOrgId} onChange={(org) => {
                    if (!org?.id) {
                        return;
                    }
                    updateBrandMutation.mutate({
                        brandId: info.row?.original?.id ?? '',
                        brandData: {
                            ...info.row?.original,
                            org_id: org?.id ?? '',
                        },
                    });
                }} />
            },
            enableSorting: true,
        },
        // Add more columns as needed
    ], []);

    const pagination = React.useMemo(() => ({
        pageIndex,
        pageSize,
    }), [pageIndex, pageSize]);

    const table = useReactTable({
        data: brandData ?? [],
        columns,
        state: {
            sorting,
            globalFilter,
            pagination,
        },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onPaginationChange: setPagination,
        manualPagination: true,
        pageCount: -1,
    });

    return (
        <ColorfullTable<Brand>
            tableInstance={table}
            title={'Brands'}
            isTitleHidden={false}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            isLoading={isLoading} 
            globalFilterEnabled={true}
            />
    );
};