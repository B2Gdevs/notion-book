'use client'

import { ColumnDef, PaginationState, SortingState, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import React, { useState } from 'react';
import { Button } from 'react-day-picker';
import { Checkbox, DEFAULT_GLOBAL_FILTER_PAGE_SIZE, DEFAULT_TABLE_PAGE_SIZE, ItemClassification, useDeleteItemClassification, useGetItemClassifications, useUpdateItemClassification } from '..';
import { ColorfullTable } from './colorfull-table';
import { DataTableColumnHeader } from './datatable-column-header';
import FilterableHeader from './filterable-header';
import { TableIdColumn } from './table-id-column';
import { toast } from './ui/use-toast';

interface ItemClassificationsTableProps {
    onItemEditClick?: (itemClassification: ItemClassification) => void;
}

export const ItemClassificationsTable: React.FC<ItemClassificationsTableProps> = ({ onItemEditClick }) => {
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 1,
        pageSize: DEFAULT_TABLE_PAGE_SIZE,
    });
    const [sorting, setSorting] = useState<SortingState>([]);
    const [globalFilter, setGlobalFilter] = useState("");

    const deleteItemClassificationMutation = useDeleteItemClassification({
        onSuccess: () => {
            toast({
                title: 'Delete Successful',
                description: 'The item classification has been deleted successfully.',
                duration: 3000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Delete Failed',
                description: `Failed to delete item classification: ${error.message}`,
                duration: 3000,
            });
        },
    });

    const { data: itemClassificationData, isLoading } = useGetItemClassifications({
        page: globalFilter ? 1 : pageIndex,
        pageSize: globalFilter ? DEFAULT_GLOBAL_FILTER_PAGE_SIZE : pageSize,
        sortBy: "tag",
        sortDirection: "asc",
    });

    const updateItemClasssificationMutation = useUpdateItemClassification(
        {
            onSuccess: () => {
                toast({
                    title: 'Update Successful',
                    description: 'The item classification has been updated successfully.',
                    duration: 3000,
                });
            },
            onError: (error) => {
                toast({
                    title: 'Update Failed',
                    description: `Failed to update item classification: ${error.message}`,
                    duration: 3000,
                });
            },
        }
    )


    const handleUpdateItemClassification = (itemClassification: ItemClassification) => {
        updateItemClasssificationMutation.mutate({
            itemClassificationId: itemClassification?.id ?? '',
            itemClassificationData: itemClassification,
        });
    }


    const handleDeleteItemClassification = (id: string) => {
        deleteItemClassificationMutation.mutate(id);
    }

    const columns: ColumnDef<ItemClassification>[] = React.useMemo(() => [
        {
            accessorKey: 'edit',
            header: ({ column }) => <DataTableColumnHeader id={"edit"} title={"Edit"} column={column} />,
            cell: (info) => {
                return (
                    <Button
                        className='py-2 px-4 font-righteous text-white text-center rounded-lg w-fit bg-blue-500'
                        onClick={() => onItemEditClick?.(info.row?.original)}
                    >
                        Edit
                    </Button>
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: 'tag',
            header: ({ column }) => <FilterableHeader id={"tag"} title={"Tag"} column={column} />,
            cell: (info) => {
                const tag = info.row?.original?.tag ?? '';
                return (
                    <div className='font-righetous'>
                        {tag}
                    </div>
                );
            },
            enableSorting: true,
        },
        {
            accessorKey: 'id',
            header: ({ column }) => <FilterableHeader id={"id"} title={"ID"} column={column} />,
            cell: info => <TableIdColumn id={info.row?.original?.id ?? ''} getPath={() => `/item-classifications/${info.row?.original?.id}`} />,
            enableSorting: true,
        },
        // create a column that will update the item classification from default boolean to true and back
        {
            accessorKey: 'default',
            header: ({ column }) => <FilterableHeader id={"default"} title={"Default"} column={column} />,
            cell: (info) => {
                const itemClassification = info.row?.original;
                return (
                    <Checkbox
                        checked={itemClassification?.default ?? false}
                        onClick={() => handleUpdateItemClassification({
                            ...itemClassification,
                            default: !itemClassification?.default,
                        })}
                    />
                );
            },
            enableSorting: false,
        },
        {
            accessorKey: 'delete',
            header: ({ column }) => <DataTableColumnHeader id={"delete"} title={"Delete"} column={column} />,
            cell: (info) => {
                const itemClassificationId = info.row?.original?.id;
                return (
                    <Button
                        className='py-2 px-4 font-righteous text-white text-center rounded-lg w-fit bg-red-500'
                        onClick={() => handleDeleteItemClassification(itemClassificationId ?? '')}
                    >
                        Delete
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
        data: itemClassificationData ?? [],
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
        <ColorfullTable<ItemClassification>
            tableInstance={table}
            title={'Item Classifications'}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            isLoading={isLoading}
            globalFilterEnabled={true}
        />
    );
};