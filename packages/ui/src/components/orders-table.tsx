'use client'
import { CellContext, Column, ColumnDef, ColumnFiltersState, PaginationState, SortingState, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { ColorfullTable } from './colorfull-table';
import { DataTableColumnHeader } from './datatable-column-header';
import { OrderStatusSelect } from './order-status-select';
import { TableIdColumn } from './table-id-column';
import { Button, CodeBlock, Collapsible, Label, Order, PageTitleDisplay, ReceiptDialogContent, Sheet, SheetContent, SheetTrigger, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, toast, useDeleteOrder, useGetOrders, useUpdateOrder } from '..';
import {AreaSelect} from '..'

interface OrdersTableProps {
    onCancelOrder?: (orderId: string) => void;
    userId?: string;
    batchId?: string; // Add batchId as an optional prop
    isInBastion?: boolean;
    startDate?: Date;
    endDate?: Date;
    orgId?: string;
    is_sub_order?: boolean;
    isInMetricsPage?: boolean;
}

// This workaround assumes that the transformation is consistent (i.e., it always replaces . with _)
export const accessorKeyMapping: { [key: string]: string } = {
    'fulfillment_info_delivery_time': 'fulfillment_info.delivery_time',
    // Add more mappings here if needed
};

export function useMobileView() {
    const [isMobileView, setIsMobileView] = useState(() => typeof window !== 'undefined' ? window.innerWidth <= 768 : false);

    useEffect(() => {
        // Ensure window object is defined
        if (typeof window !== 'undefined') {
            setIsMobileView(window.innerWidth <= 768);

            const handleResize = () => {
                setIsMobileView(window.innerWidth <= 768);
            };

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    return isMobileView;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ onCancelOrder, userId, batchId, isInBastion, startDate, endDate, orgId, is_sub_order, isInMetricsPage }) => {
    const isMobileView = useMobileView();
    const [mobilePage, setMobilePage] = useState(1);
    const [hasMoreOrders, setHasMoreOrders] = useState(true);
    const [sortBy, setSortBy] = useState('');
    const [sorting, setSorting] = useState<SortingState>([{ id: 'fulfillment_info.delivery_time', desc: true }]);
    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 1,
        pageSize: 10,
    });

    const updateOrderMutation = useUpdateOrder({
        onSuccess: () => {
            // Do something on success
            toast({
                title: 'Order updated',
            });
        },
    });

    const deleteOrderMutation = useDeleteOrder({
        onSuccess: () => {
            // Do something on success
            toast({
                title: 'Order deleted',
            });
        },
    });

    const goNextPage = () => {
        setMobilePage(prevPage => prevPage + 1);
    };

    const goPrevPage = () => {
        setMobilePage(prevPage => prevPage > 1 ? prevPage - 1 : 1); // Prevent going back before page 1
        if (!hasMoreOrders) {
            setHasMoreOrders(true);
        }
    };

    // Determine which ID to use based on the presence of userId or batchId
    const idToUse = userId ?? batchId; // Use userId if available, otherwise use batchId
    const idType = userId ? 'userId' : 'batchId'; // Determine the type of ID being used

    const [globalFilter, setGlobalFilter] = useState("");
    const params = {
        page: globalFilter ? 1 : (isMobileView ? mobilePage : pageIndex),
        pageSize: globalFilter ? 200 : pageSize, // Adjust pageSize based on globalFilter
        [idType]: idToUse, // Dynamically set the key based on the ID type
        sortBy: sortBy || sorting[0]?.id,
        sortDirection: sorting[0]?.desc ? 'desc' : 'asc',
        startDate,
        endDate,
        orgId,
        is_sub_order,
        globalFilter, // Include globalFilter in the parameters
    }
    const { data: orders, isLoading } = useGetOrders(params);

    useEffect(() => {
        if (orders && orders.length < pageSize) {
            setHasMoreOrders(false);
        } else {
            setHasMoreOrders(true);
        }
    }, [orders]);


    const columns: ColumnDef<Order>[] = React.useMemo(() => {
        let baseColumns: ColumnDef<Order>[] = [
            {
                accessorKey: 'ordered_at',
                header: ({ column }) => <DataTableColumnHeader setSortBy={setSortBy} id={"ordered_at"} title={"Order Date"} column={column} />,
                enableSorting: true,
                cell: info => {
                    const dateValue = info.getValue() as string; // Cast to string assuming the date is in string format
                    const date = new Date(dateValue);
                    return date.toLocaleDateString();
                },
            },
            {
                accessorKey: 'fulfillment_info.delivery_time',
                header: ({ column }) => <DataTableColumnHeader setSortBy={setSortBy} id={"delivery_date"} title={"Delivery Date"} column={column} />,
                enableSorting: true,
                cell: info => {
                    const dateValue = info.getValue() as string; // Cast to string assuming the date is in string format
                    const date = new Date(dateValue);
                    return date.toLocaleString();
                },
            },
            {
                accessorKey: 'status',
                header: ({ column }) => <DataTableColumnHeader setSortBy={setSortBy} id={"status"} title={"Status"} column={column} />,
                enableSorting: true,
                cell: (info: CellContext<Order, unknown>) => {
                    const order = info.row.original;
                    const currentStatus = info.row.original.status;
                    return (
                        <OrderStatusSelect
                            initialStatus={currentStatus}
                            onChange={(newStatus) => {
                                // Implement the logic to handle status change here.
                                // This might involve updating the status in the backend and then refreshing the data.
                                // alert(`status change not implmented`);
                                order.status = newStatus;
                                updateOrderMutation.mutate({
                                    orderId: order.id ?? '',
                                    orderData: order,
                                });

                            }}
                            // Assuming you might want to disable changing status based on some conditions
                            disabled={!isInBastion}
                        />
                    );
                },
            },
            {
                accessorKey: 'delivery_info.destination.full_address',
                header: ({ column }) => <DataTableColumnHeader column={column} title={"Delivery Address"} />,
                enableSorting: false,
            },

            ...(!isInBastion ? [{
                id: 'actions',
                header: ({ column }: { column: Column<Order, unknown> }) => <DataTableColumnHeader column={column} title={"Actions"} />,
                cell: (info: CellContext<Order, unknown>) => {
                    const deliveryTimeString = info.row.original?.fulfillment_info?.delivery_time ?? '';
                    const deliveryTime = new Date(deliveryTimeString);
                    const isPastDelivery = deliveryTime < new Date();

                    // Add state for managing the actions
                    const [areActionsOpen, setActionsOpen] = React.useState(false);

                    return (
                        <div className='flex justify-start items-center pl-2 space-x-2'>
                            {areActionsOpen ? <ChevronLeft size={24} onClick={() => setActionsOpen(false)} /> : <ChevronRight size={24} onClick={() => setActionsOpen(true)} />}
                            <div className={`flex space-x-2 ${areActionsOpen ? '' : 'opacity-0'}`}>
                                <Sheet key={'left'}>
                                    <SheetTrigger asChild>
                                        <Button className='flex p-2 bg-primary-almost-black'>
                                            <Label className='font-righteous'>Receipt</Label>
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent className='bg-white' side={'left'}>
                                        <ReceiptDialogContent
                                            order={info.row.original}
                                        />
                                    </SheetContent>
                                </Sheet>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button className='bg-secondary-pink-salmon' onClick={() => onCancelOrder?.(info.row.original.id ?? '')} disabled={isPastDelivery}>
                                            Cancel
                                        </Button>
                                    </TooltipTrigger>
                                    {isPastDelivery && (
                                        <TooltipContent side="top">
                                            You can't cancel the order past the delivery time.
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            </div>
                        </div>
                    );
                },
                enableSorting: false,
            }] : []),
        ];

        // Conditionally add the "View" column if in bastion mode and it's not already included
        if (isInBastion && !baseColumns.find(column => column.id === 'view')) {
            baseColumns = [
                ...baseColumns,
                {
                    accessorKey: 'id',
                    header: ({ column }) => <DataTableColumnHeader column={column} title={"Area"} />,
                    cell: info => {
                        const selectedAreaId = info.row.original?.delivery_info?.destination?.location?.area_id;
                        return (
                            <div >
                                <AreaSelect 
                                selectedAreaId={selectedAreaId}
                                onChange={(areaId) => {
                                    if (!areaId) {
                                        return;
                                    }
                                    
                                    const order = info.row.original;
                                    if (order.delivery_info && order.delivery_info.destination && order.delivery_info.destination.location) {
                                        order.delivery_info.destination.location.area_id = areaId;
                                        updateOrderMutation.mutate({
                                            orderId: order.id ?? '',
                                            orderData: order,
                                        });
                                    }
                                }}/>
                            </div>
                        );
                    },
                    enableSorting: false,
                },

                {
                    accessorKey: 'id',
                    header: ({ column }) => <DataTableColumnHeader column={column} title={"Order ID"} />,
                    cell: info => {
                        const parentId = info.row.original?.parent_order_id;
                        const isRetryOrder = info.row.original?.is_retry
                        const isSubOrder = Boolean(parentId);
                        let textColor = 'text-blue-500';
                        if (isRetryOrder) {
                            textColor = 'text-green-500';
                        } else if (isSubOrder) {
                            textColor = 'text-black';
                        }
                        return (
                            <div className={textColor}>
                                <TableIdColumn id={info.row.original?.id ?? ''} getPath={(id) => `/orders/${id}`} />
                            </div>
                        );
                    },
                    enableSorting: false,
                },
                {
                    accessorKey: 'user_id',
                    header: ({ column }) => <DataTableColumnHeader column={column} title={"User"} />,
                    cell: info => {
                        if (info.row.original?.share_guest_id) {
                            return '';
                        }
                        
                        if (info.row.original?.customer?.last_name === 'Admin') {
                            return (
                                <div className={'text-blue-500'}>
                                    {info.row.original?.customer?.first_name + " " + info.row.original?.customer?.last_name}
                                </div>
                            );
                        }

                        return (
                            <div className={'text-blue-500'}>
                                <TableIdColumn id={info.row.original?.customer?.first_name + " " + info.row.original?.customer?.last_name} getPath={() => `/users/${info.row.original?.user_id}`} />
                            </div>
                        );
                    },
                    enableSorting: false,
                },
                {
                    accessorKey: 'share_guest_id',
                    header: 'Guest',
                    cell: info => {
                        // ex: firstName_lastName_guest_20240517_1715977588166
                        const shareGuestId = info.getValue() as string;
                        if (!shareGuestId) {
                            return '';
                        }
                        const parts = shareGuestId.split('_');
                        const firstName = parts[0];
                        const lastName = parts[1];

                        return (
                            <div className='max-w-[150px]'>
                                <div>{firstName} {lastName}</div>
                            </div>
                        );
                    },
                },

                {
                    accessorKey: 'parent_order_id',
                    header: ({ column }) => <DataTableColumnHeader column={column} title={"Parent ID"} />,
                    cell: info => {
                        const parentId = info.row.original?.parent_order_id;
                        const isSubOrder = Boolean(parentId);
                        return (
                            <div className={isSubOrder ? 'text-blue-500' : 'text-black'}>
                                {isSubOrder ? <TableIdColumn id={parentId ?? ''} getPath={(parent_order_id) => `/orders/${parent_order_id}`} /> : ''}
                            </div>
                        );
                    },
                    enableSorting: false,
                },



                {
                    id: 'delete',
                    header: ({ column }) => <DataTableColumnHeader column={column} title={"Delete"} />,
                    cell: info => (
                        <Button
                            className='bg-red-500 text-white'
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this order?')) {
                                    deleteOrderMutation.mutate(info.row.original.id ?? '');
                                }
                            }}
                        >
                            Delete
                        </Button>
                    ),
                    enableSorting: false,
                }
            ];
        }

        return baseColumns;
    }, [setSortBy, onCancelOrder, isInBastion]); // Ensure to include all dependencies that affect the columns

    const pagination = React.useMemo(() => ({
        pageIndex,
        pageSize,
    }), [pageIndex, pageSize]);

    const table = useReactTable({
        data: orders ?? [],
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

    // Mobile view component
    const MobileOrderCard: React.FC<{ order: Order }> = ({ order }) => {
        const deliveryTimeString = order?.fulfillment_info?.delivery_time ?? '';
        const deliveryTime = new Date(deliveryTimeString);
        const isPastDelivery = deliveryTime < new Date();

        // Truncate address after 6 characters
        const truncatedAddress = order.delivery_info?.destination?.full_address
            ? order.delivery_info.destination.full_address.slice(0, 6) + '...'
            : 'N/A';

        return (
            <div className='m-2 bg-slate-100 py-4 px-6 rounded-lg flex flex-col justify-start items-start gap-2'>
                <div className='flex justify-between items-center w-full'>
                    <span className='font-righteous'>Delivery Date: </span>
                    <CodeBlock>
                        {order.fulfillment_info?.delivery_time ? new Date(order.fulfillment_info.delivery_time).toLocaleDateString() : 'N/A'}
                    </CodeBlock>
                </div>
                <div className='flex justify-between items-center w-full'>
                    <span className='font-righteous'>Delivery Time: </span>
                    <CodeBlock>
                        {order.fulfillment_info?.delivery_time ? new Date(order.fulfillment_info.delivery_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}
                    </CodeBlock>
                </div>
                <div className='flex justify-between items-center w-full'>
                    <span className='font-righteous'>Status: </span>
                    <CodeBlock>
                        {order.status}
                    </CodeBlock>
                </div>
                <div className='flex justify-between items-center w-full'>
                    <span className='font-righteous'>Delivery Address: </span>
                    <CodeBlock>
                        {truncatedAddress}
                    </CodeBlock>
                </div>
                <TooltipProvider>
                    <div className='flex space-x-2'>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button size='sm' className='bg-secondary-pink-salmon' onClick={() => onCancelOrder?.(order.id ?? '')} disabled={isPastDelivery}>
                                    Cancel
                                </Button>
                            </TooltipTrigger>
                            {isPastDelivery && (
                                <TooltipContent side="top">
                                    You can't cancel the order past the delivery time.
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </div>
                </TooltipProvider>
                <Collapsible
                    stepHeaderProps={{
                        text: 'Order Details',
                    }}
                    expanded={false}
                >
                    <ReceiptDialogContent
                        order={order}
                    />
                </Collapsible>
            </div>
        );
    };

    // Reset page index when globalFilter changes
    useEffect(() => {
        setPagination(prevState => ({ ...prevState, pageIndex: 1 }));
    }, [globalFilter]);



    if (isMobileView) {
        if (isLoading) {
            return <Skeleton count={10} />;
        }
        return (
            <div>
                {!isInMetricsPage && <PageTitleDisplay
                    overrideTitle='Home'
                    additionalText='Orders'
                />}
                {orders?.map(order => <MobileOrderCard key={order.id + 'mobile-card'} order={order} />)}
                <div className='flex justify-start items-center gap-2 mx-2 py-2'>
                    <Button onClick={goPrevPage} disabled={mobilePage === 1}>Previous</Button> {/* Disable button when on page 1 */}
                    <Button onClick={goNextPage} disabled={!hasMoreOrders}>Next</Button> {/* Disable button when there are no more orders */}
                </div>
            </div>
        );
    }

    return (
        <ColorfullTable<Order>
            tableInstance={table}
            title='Orders'
            isTitleHidden={isInMetricsPage}
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            isLoading={isLoading}
        />
    );
};