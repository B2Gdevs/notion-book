'use client'

import { ColumnDef, ColumnFiltersState, PaginationState, SortingState, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState } from 'react';
import { ColorfullTable } from './colorfull-table';
import FilterableHeader from './filterable-header'; // Adjust import paths as necessary
import { TableIdColumn } from './table-id-column';

import { OrgGroup } from '..';
import { useGetOrgGroups } from '../hooks/orgGroupHooks';

export const OrgGroupsTable: React.FC = () => {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = React.useState<SortingState>([]);

    const { data: orgGroupData, isLoading } = useGetOrgGroups({
        page: pageIndex,
        pageSize,
    });

    const columns: ColumnDef<OrgGroup>[] = React.useMemo(() => {
        let baseColumns: ColumnDef<OrgGroup>[] = [
            {
                accessorKey: 'name',
                header: ({ column }) => <FilterableHeader id={"name"} title={"Name"} column={column} setFilters={setFilters} />,
                enableSorting: true,
            },
            {
                accessorKey: 'id',
                header: ({ column }) => <FilterableHeader id={"id"} title={"ID"} column={column} setFilters={setFilters} />,
                cell: info => <TableIdColumn id={info.row?.original?.id ?? ''} getPath={() => `/orggroups/${info.row?.original?.id}`} />,
                enableSorting: true,
            },
            // Add more columns as needed
        ];
        return baseColumns;
    }, [setFilters]); // Ensure this closing parenthesis is correctly placed

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const table = useReactTable({
        data: orgGroupData ?? [],
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
        manualPagination: true, // Set to true if you're handling pagination server-side
        pageCount: -1, // Provide the total page count here if known, or -1 to indicate unknown page count
    });

    return (
        <ColorfullTable<OrgGroup>
            title={'Org Groups'}
            tableInstance={table} // Ensure `table` is being used here
            subtitle={'org groups'}
            isLoading={isLoading}
        />
    );
};