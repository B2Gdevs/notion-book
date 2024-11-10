'use client'

import { ColumnDef, ColumnFiltersState, PaginationState, SortingState, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState } from 'react';
import { DeliveryWindow, DeliveryWindowQueryParams, useGetArea, useGetDeliveryWindows, useGetOrgsByIds } from '..';
import { ColorfullTable } from './colorfull-table';
import { DataTableColumnHeader } from './datatable-column-header';
import { TableIdColumn } from './table-id-column';

interface DeliveryWindowsTableProps {
    timezone?: string;
}

export const DeliveryWindowsTable: React.FC<DeliveryWindowsTableProps> = () => {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 1,
        pageSize: 10,
    });
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([{ id: 'created_at', desc: true }]);

    const params: DeliveryWindowQueryParams = {
        page: pageIndex,
        pageSize,
        sortBy: sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
    };

    const { data: deliveryWindowsData, isLoading } = useGetDeliveryWindows(params);

    const columns: ColumnDef<DeliveryWindow>[] = React.useMemo(() => [
        {
            accessorKey: 'id',
            header: ({ column }) => <DataTableColumnHeader id={"id"} title={"ID"} column={column} />,
            cell: info => <TableIdColumn id={info.row?.original?.id ?? ''} getPath={() => `/delivery-windows/${info.row?.original?.id}`} />,
            enableSorting: true,
        },
        {
            accessorKey: 'area_id',
            header: 'Area',
            cell: info => {
                const areaId = info.getValue() as string;
                const { data: area } = useGetArea(areaId);
                return area?.name ?? 'Loading...';
            },
            enableSorting: false,
        },
        {
            accessorKey: 'delivery_time',
            header: 'Delivery Time',
            cell: info => info.getValue(),
            enableSorting: false,
        },
        {
            accessorKey: 'timezone',
            header: 'Timezone',
            cell: info => info.getValue(),
            enableSorting: false,
        },
        {
            accessorKey: 'org_ids',
            header: 'Org IDs',
            cell: info => {
                const orgIds = info.getValue() as string[];
                const { data: orgs, isLoading } = useGetOrgsByIds(orgIds);
        
                if (isLoading) {
                    return <div>Loading...</div>;
                }
        
                return (
                    <div>
                        {orgs?.map(org => (
                            <div key={org.id}>
                                {org.name}
                            </div>
                        ))}
                    </div>
                );
            },
            enableSorting: false,
        }
    ], [setFilters]);

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );

    const table = useReactTable({
        data: deliveryWindowsData ?? [],
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
            <ColorfullTable<DeliveryWindow>
                tableInstance={table}
                title={'Delivery Windows'}
                isLoading={isLoading}
            />
        </>
    );
};