'use client'

import { ColumnDef, ColumnFiltersState, PaginationState, SortingState, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { useGetBrandsByIds } from '../hooks/brandHooks';
import { useGetStores, useUpdateStore } from '../hooks/storeHooks';
import { Store } from '../models/storeModels';
import { ColorfullTable } from './colorfull-table';
import { DataTableColumnHeader } from './datatable-column-header';
import FilterableHeader from './filterable-header';
import { OrgSelect } from './org-select';
import { TableIdColumn } from './table-id-column';
import { toast } from './ui/use-toast';

export const StoresTable: React.FC = () => {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const updateStoreMutation = useUpdateStore({
        onSuccess: () => {
            toast({
                title: 'Store updated',
            })
        }
    });
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);

    const { data: storeData, isLoading } = useGetStores({
        page: pageIndex,
        pageSize,
    });

    // Assuming brandData is used to map brand IDs to brand names
    const [brandIds, setBrandIds] = useState<string[]>([]);
    const { data: brandData } = useGetBrandsByIds(brandIds);

    useEffect(() => {
        if (storeData) {
            const uniqueBrandIds = Array.from(new Set(storeData.map(store => store.brand_id).filter(id => id)));
            setBrandIds(uniqueBrandIds as string[]);
        }
    }, [storeData]);

    const getBrandNameById = (brandId: string) => {
        return brandData?.find(brand => brand.id === brandId)?.name ?? 'Unknown';
    };

    const columns: ColumnDef<Store>[] = React.useMemo(() => [
        {
            accessorKey: 'name',
            header: ({ column }) => <FilterableHeader id={"name"} title={"Name"} column={column} setFilters={setFilters} />,
            enableSorting: true,
        },
        {
            accessorKey: 'id',
            header: ({ column }) => <FilterableHeader id={"id"} title={"ID"} column={column} setFilters={setFilters} />,
            cell: info => <TableIdColumn id={info.row?.original?.id ?? ''} getPath={() => `/stores/${info.row?.original?.id}`} />,
            enableSorting: true,
        },
        {
            accessorKey: 'brand_id',
            header: ({ column }) => <DataTableColumnHeader title={"Brand"} column={column} />,
            cell: info => <div>{getBrandNameById(info.getValue() as string ?? '')}</div>,
            enableSorting: true,
        },
        {
            accessorKey: 'org_id',
            header: ({ column }) => <DataTableColumnHeader title={"Org"} column={column} />,
            cell: info => {
                const initialOrgId = info.getValue() as string;
                return <OrgSelect initialOrgId={initialOrgId} onChange={(org) => {
                    if (!org?.id) {
                        return;
                    }
                    updateStoreMutation.mutate({
                        ...info.row?.original,
                        org_id: org?.id ?? '',
                    });
                }} />
            },
            enableSorting: true,
        },
        // Add more columns as needed
    ], [setFilters, brandData]);

    const pagination = React.useMemo(() => ({
        pageIndex,
        pageSize,
    }), [pageIndex, pageSize]);

    const table = useReactTable({
        data: storeData ?? [],
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
        <ColorfullTable<Store>
            tableInstance={table}
            title={'Stores'}
            isLoading={isLoading}
        />
    );
};