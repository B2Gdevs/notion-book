'use client';

import {
    ColumnDef,
    ColumnFiltersState,
    PaginationState,
    SortingState,
    getCoreRowModel,
    getFilteredRowModel,
    useReactTable
} from '@tanstack/react-table';
import React, { useState } from 'react';
import { AreaSelect, DatePicker, DeliveryWindow, DeliveryWindowSelect, OrderItem, OrderStatus, getStartAndEndOfDay, useGetBrandById, useGetOrderItems, useGetOrders, useGetOrg, useGetShare, useGetStore, useGetUser } from '..';
import { ColorfullTable } from './colorfull-table';
import { DataTableColumnHeader } from './datatable-column-header';

interface OrderItemsCurrentOrdersTableProps {
    storeIds?: string[]; // Optional storeIds prop
    orgDeliveryWindowId?: string; // Optional orgId prop
    isRestaurantView?: boolean;
    isPartnerView?: boolean;
}

export const OrderItemsCurrentOrdersTable = ({ storeIds, orgDeliveryWindowId, isRestaurantView, isPartnerView }: OrderItemsCurrentOrdersTableProps) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedWindow, setSelectedWindow] = useState<DeliveryWindow>();
    const [selectedAreaId, setSelectedAreaId] = useState<string>();
    const [sorting, setSorting] = useState<SortingState>([]);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 500
    });

    const pagination = React.useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const { startDateStartOfDay, endDateEndOfDay } = getStartAndEndOfDay(selectedDate);

    // If isRestaurantView is true, automatically set the delivery_window_id to org.delivery_window_id
    let orderItemsParams = {
        startDate: startDateStartOfDay.toISOString(),
        endDate: endDateEndOfDay.toISOString(),
        pageSize: pageSize,
        page: pageIndex,
        sortBy: sorting[0]?.id || 'store_id', // Add a default sort field,
        sortDirection: sorting[0]?.desc ? 'desc' as const : 'asc' as const,
        dateTimeField: 'delivery_date',
        delivery_window_id: '',
    };

    // Ensure partner view will show all delivery windows in that area
    if (isRestaurantView) {
        orderItemsParams = {
            ...orderItemsParams,
            delivery_window_id: orgDeliveryWindowId || 'placeholder_id',
        };
    } else {
        orderItemsParams = {
            ...orderItemsParams,
            delivery_window_id: selectedWindow?.id || '',
        };
    }

    const { data: orderItems, isLoading } = useGetOrderItems(orderItemsParams);
    const handleAreaChange = (areaId: string) => {
        setSelectedAreaId(areaId);
    };

    // Assuming orderItems is already fetched and storeIds is available
    const filteredOrderItems = React.useMemo(() => {
        if (!orderItems || !storeIds) return [];

        return orderItems.filter(item => storeIds.includes(item.store_id));
    }, [orderItems, storeIds]);

    const columns: ColumnDef<OrderItem>[] = React.useMemo(() => {
        let baseColumns: ColumnDef<OrderItem>[] = [
            {
                id: 'Store Name',
                accessorKey: 'store_id',
                header: 'Store Name',
                cell: info => {
                    const storeId = info.row.original.store_id as string;
                    const { data: store } = useGetStore(storeId);
                    return store?.name ?? 'Loading...';
                },
            },
            {
                id: 'Brand Name',
                accessorKey: 'store_id',
                header: 'Brand Name',
                cell: info => {
                    const storeId = info.row.original.store_id as string;
                    const { data: store } = useGetStore(storeId);
                    const { data: brand } = useGetBrandById(store?.brand_id ?? '');
                    return brand?.name ?? 'Loading...';
                },
            },
            {
                id: 'Order Placed',
                accessorKey: 'user_id',
                header: 'Order Placed?',
                cell: info => {
                    const shareGuestId = info.row.original?.share_guest_id as string;
                    const { data: user } = useGetUser(info.row.original?.user_id ?? '');

                    let params = {
                        userId: '',
                        startDate: startDateStartOfDay,
                        endDate: endDateEndOfDay,
                    }

                    if (shareGuestId) {
                        params.userId = shareGuestId;
                    } else {
                        params.userId = user?.id ?? '';
                    }

                    const { data: ordersData, isLoading: isLoadingOrders } = useGetOrders(params);

                    if (!info.row.original?.user_id && !info.row.original?.share_guest_id) return '';

                    if (isLoadingOrders) return <div>Loading...</div>;
                    // Check if ordersData is not empty and that the first order's status is NEW_ORDER, CONFIRMED, PICKED_UP, PREPARED, FULFILLED, PARTIALLY_FULFILLED, SENT_TO_KITCHEN, COMPLETED_EXTERNAL_TO_SYSTEM
                    const hasOrdered = ordersData && ordersData?.length > 0 && [OrderStatus.NEW_ORDER, OrderStatus.CONFIRMED, OrderStatus.PICKED_UP, OrderStatus.PREPARED, OrderStatus.FULFILLED, OrderStatus.PARTIALLY_FULFILLED, OrderStatus.SENT_TO_KITCHEN, OrderStatus.COMPLETED_EXTERNAL_TO_SYSTEM].includes(ordersData[0].status);

                    return (
                        <div className={`py-2 px-4 font-righteous text-white text-center rounded-lg w-fit ${hasOrdered ? 'bg-primary-spinach-green' : 'bg-red-500'}`}>
                            {hasOrdered ? 'Yes' : 'No'}
                        </div>
                    );
                },
                enableSorting: false,
            },
            {
                id: 'Quantity',
                accessorKey: 'quantity',
                header: 'Quantity',
                cell: info => info.row.original.quantity,
            },
            {
                id: 'Item Name',
                accessorKey: 'name',
                header: 'Item Name',
                cell: info => info.row.original.name,
            },
            {
                id: 'Modifiers',
                accessorKey: 'modifiers',
                header: 'Modifiers',
                cell: info => {
                    const modifiers = info.row.original.modifiers;

                    if (!modifiers?.length) return 'None';
                    return (
                        <ul>
                            {modifiers.map((modifier, index) => (
                                <li key={index}>{modifier.name} (Qty: {modifier.quantity})</li>
                            ))}
                        </ul>
                    );
                },
            },
            {
                id: 'Customer',
                accessorKey: 'user_id',
                header: ({ column }) => <DataTableColumnHeader column={column} title={"Customer"} />,
                cell: info => {
                    const shareGuestId = info.row.original?.share_guest_id as string;
                    const { data: user } = useGetUser(info.row.original?.user_id ?? '');
                    // If user_id ends in '_guest', display "Admin Guest"
                    if (info.row.original?.user_id.endsWith('_guest')) {
                        return 'Admin Guest';
                    }

                    if (!info.row.original?.user_id && !info.row.original?.share_guest_id) return '';

                    if (user) {
                        return (
                            <div className='text-primary-spinach-green font-righteous'>
                                {user?.first_name + " " + user?.last_name}
                            </div>
                        );
                    }

                    if (!shareGuestId) return '';
                    const parts = shareGuestId.split('_');
                    const firstName = parts[0];
                    const lastName = parts[1];

                    if (shareGuestId) {
                        return (
                            <div className='max-w-[150px] text-secondary-pink-salmon font-righteous'>
                                <div>{firstName} {lastName}</div>
                            </div>
                        );
                    }
                },
                enableSorting: false,
            },
            {
                id: 'Customer Org',
                accessorKey: 'user_id',
                header: ({ column }) => <DataTableColumnHeader column={column} title={"Customer Org"} />,
                cell: info => {
                    const shareGuestId = info.row.original?.share_id as string;
                    let userId;
                    if (info.row.original?.user_id.endsWith('_guest')) {
                        // Remove the '_guest' suffix
                        userId = info.row.original?.user_id.replace('_guest', '');
                    } else {
                        userId = info.row.original?.user_id;
                    }
                    const { data: share } = useGetShare(shareGuestId);
                    const { data: user } = useGetUser(userId);
                    const orgIdToPass = share ? share?.org_id : user?.org_id;
                    const { data: org } = useGetOrg(orgIdToPass ?? '');
                    return (
                        <div className='text-primary-spinach-green font-righteous'>
                            {org?.name}
                        </div>
                    );
                },
                enableSorting: false,
            },
        ];

        // Include these columns only if isRestaurantView is false and isPartnerView is false
        if (!isRestaurantView && !isPartnerView) {
            baseColumns.push(
                {
                    id: 'Store ID',
                    accessorKey: 'store_id',
                    header: ({ column }) => <DataTableColumnHeader id={"store_id"} title={"Store ID"} column={column} />,
                    cell: info => info.row.original.store_id,
                    enableSorting: true,
                },
                {
                    id: 'Order Item ID',
                    accessorKey: 'modifiers',
                    header: 'Order Item ID',
                    cell: info => info.row.original.id,
                },
                {
                    id: 'Menu Item ID',
                    header: 'Menu Item ID',
                    accessorKey: 'menu_item_id',
                    cell: info => info.row.original.menu_item_id,
                }
            );
        }

        return baseColumns;
    }, [setFilters, selectedDate]);

    const table = useReactTable({
        data: isRestaurantView ? filteredOrderItems : orderItems ?? [],
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
        <>
            <div className='flex flex-col justify-start items-start'>
                <DatePicker
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                    className='bg-primary-spinach-green w-fit mr-2'
                />
                {(!isRestaurantView && !isPartnerView) && <AreaSelect
                    selectedAreaId={selectedAreaId}
                    onChange={(areaId) => handleAreaChange(areaId)}
                    selectTriggerTextOverride='Select Area For Delivery Windows'
                    className='mt-2'
                />}
                {(!isRestaurantView && !isPartnerView) && <DeliveryWindowSelect
                    area_id={selectedAreaId}
                    onWindowSelect={setSelectedWindow}
                    isWithoutAddNewButton={true}
                />}
            </div>

            <ColorfullTable<OrderItem>
                tableInstance={table}
                subtitle={"Today's Order Items"}
                title={"Order Items"}
                isLoading={isLoading}
                enableDownload={true} />
        </>
    );
};