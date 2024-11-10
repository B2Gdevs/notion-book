'use client'

import { ColumnDef, ColumnFiltersState, PaginationState, SortingState, getCoreRowModel, getFilteredRowModel, useReactTable } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';
import { Button, OrgSelect, cn, useGetOrg, useGetUser, useMobileView } from '..';
import { useDeleteOrderTotal, useGetOrderTotals, useUpdateOrderTotal } from '../hooks/totalHooks';
import { OrderTotal } from '../models/totalModels';
import { ColorfullTable } from './colorfull-table';
import { DataTableColumnHeader } from './datatable-column-header';
import { OrderTotalsTableMobileView } from './order-total-table-mobile-view';
import { PaymentStatusSelect } from './payment-status-select';
import { TableIdColumn } from './table-id-column';
import { toast } from './ui/use-toast';


interface OrderTotalsTableProps {
    orderTotals?: OrderTotal[];
    onlyUseGivenOrderTotals?: boolean;
    className?: string;
    startDate?: Date;
    endDate?: Date;
    orgId?: string;
    is_sub_order_total?: boolean;
    isCustomerFacing?: boolean;
}

export const OrderTotalsTable: React.FC<OrderTotalsTableProps> = ({
    orderTotals,
    onlyUseGivenOrderTotals,
    className,
    startDate,
    endDate,
    orgId,
    is_sub_order_total,
    isCustomerFacing }) => {
    const isMobileView = useMobileView();
    const [hasMoreOrderTotals, setHasMoreOrderTotals] = useState(true);
    const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
        pageIndex: 1,
        pageSize: 10,
    });
    const { mutate: deleteOrderTotal, isLoading: isDeleting } = useDeleteOrderTotal({
        onSuccess: () => {
            toast({
                title: 'Order total deleted successfully.',
                duration: 5000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error deleting order total.',
                description: error.message,
                duration: 5000,
            });
        },
    });

    const updateOrderTotalMutation = useUpdateOrderTotal({
        onSuccess: () => {
            toast({
                title: 'Order total updated',
            })
        }
    });

    const [filters, setFilters] = useState<ColumnFiltersState>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const componentWasGivenOrderTotals = (orderTotals?.length ?? 0) !== 0;

    const { data: fetchedOrderTotalData, isLoading } = useGetOrderTotals({
        page: pageIndex,
        pageSize,
        sort_by: "delivery_date",
        sort_direction: "desc",
        start_date: startDate,
        end_date: endDate,
        org_id: orgId,
        datetime_field: isCustomerFacing ? 'delivery_date' : undefined,
        is_sub_order_total,
    }, false, componentWasGivenOrderTotals);

    useEffect(() => {
        if (fetchedOrderTotalData && fetchedOrderTotalData.length < pageSize) {
            setHasMoreOrderTotals(false);
        } else {
            setHasMoreOrderTotals(true);
        }
    }, [fetchedOrderTotalData]);

    const orderTotalData = (onlyUseGivenOrderTotals ? orderTotals : orderTotals ?? fetchedOrderTotalData) as OrderTotal[];
    const pagination = React.useMemo(() => ({
        pageIndex,
        pageSize,
    }), [pageIndex, pageSize]);

    const splitDataIntoPages = (data: any[], pageSize: number) => {
        const pages = [];
        for (let i = 0; i < data.length; i += pageSize) {
            pages.push(data.slice(i, i + pageSize));
        }
        return pages;
    };
    let orderTotalPageData = orderTotalData
    if (componentWasGivenOrderTotals) {
        orderTotalPageData = splitDataIntoPages(orderTotalData, pageSize)[pageIndex - 1];
    }

    const goNextPage = () => {
        if (hasMoreOrderTotals) {
            setPagination(prevState => ({ ...prevState, pageIndex: prevState.pageIndex + 1 }));
        }
    };

    const goPrevPage = () => {
        if (pageIndex > 0) {
            setPagination(prevState => ({ ...prevState, pageIndex: prevState.pageIndex - 1 }));
            if (!hasMoreOrderTotals) {
                setHasMoreOrderTotals(true);
            }
        }
    };


    // =========== Columns & Table ===========
    const columns: ColumnDef<OrderTotal>[] = React.useMemo(() => {
        let baseColumns: ColumnDef<OrderTotal>[] = [
            {
                accessorKey: 'user_id',
                header: ({ column }) => <DataTableColumnHeader column={column} title={"Customer"} />,
                cell: info => {
                    const { data: user } = useGetUser(info.row.original?.user_id ?? '');
                    return (
                        <div className={'text-primary-spinach-green font-righteous'}>
                            {user?.first_name + " " + user?.last_name}
                        </div>
                    );
                },
                enableSorting: false,
            },
            {
                accessorKey: 'org_id',
                header: ({ column }) => <DataTableColumnHeader column={column} title={"Org"} />,
                cell: info => {
                    const { data: org } = useGetOrg(info.row.original?.org_id ?? '');
                    return (
                        <div className={'text-primary-spinach-green font-righteous'}>
                            {org?.name}
                        </div>
                    );
                },
                enableSorting: false,
            },
            {
                accessorKey: 'total_before_subsidy',
                header: ({ column }) => <DataTableColumnHeader title={"Total"} column={column} />,
                cell: info => {
                    const value = info.getValue();
                    const roundedValue = typeof value === 'number' ? value.toFixed(2) : 'Unknown';
                    return <div>${roundedValue}</div>;
                },
                enableSorting: false,
            },
            {
                accessorKey: 'subtotal',
                header: ({ column }) => <DataTableColumnHeader title={"SubTotal"} column={column} />,
                cell: info => {
                    const value = info.getValue();
                    const roundedValue = typeof value === 'number' ? value.toFixed(2) : 'Unknown';
                    return <div>${roundedValue}</div>;
                },
                enableSorting: false,
            },
            {
                accessorKey: 'tax_total',
                header: ({ column }) => <DataTableColumnHeader title={"Tax Total"} column={column} />,
                cell: info => {
                    const value = info.getValue();
                    const roundedValue = typeof value === 'number' ? value.toFixed(2) : 'Unknown';
                    return <div>${roundedValue}</div>;
                },
                enableSorting: false,
            },
            {
                accessorKey: 'delivery_date',
                header: ({ column }) => <DataTableColumnHeader id={"delivery_date"} title={"Delivery Date"} column={column} />,
                cell: info => {
                    if (!info.getValue()) {
                        return '';
                    }
                    const dateValue = info.getValue() as string;
                    const date = new Date(dateValue);
                    if (isNaN(date.getTime())) {
                        return 'Invalid date';
                    } else {
                        return date.toLocaleDateString();
                    }
                },
                enableSorting: false,
            },


        ];

        if (!isCustomerFacing) {
            baseColumns = [
                ...baseColumns,
                {
                    accessorKey: 'id',
                    header: ({ column }) => <DataTableColumnHeader title={"ID"} column={column} />,
                    cell: info => <div>{info.row.original.id ?? 'Unknown'}</div>,
                    enableSorting: false,
                },
                {
                    accessorKey: 'user_id',
                    header: ({ column }) => <DataTableColumnHeader column={column} title={"User ID"} />,
                    cell: info => {
                        return (
                            <div className={'text-blue-500'}>
                                <TableIdColumn id={info.row.original?.user_id ?? ''} getPath={() => `/users/${info.row.original?.user_id}`} />
                            </div>
                        );
                    },
                    enableSorting: false,
                },
                {
                    accessorKey: 'org_id',
                    header: ({ column }) => <DataTableColumnHeader title={"Org"} column={column} />,
                    cell: info => {
                        const initialOrgId = info.getValue() as string; // Cast to string assuming the date is in string format
                        return <OrgSelect initialOrgId={initialOrgId} disabled={true} />
                    },
                    enableSorting: true,
                },
                {
                    accessorKey: 'order_id',
                    header: ({ column }) => <DataTableColumnHeader title={"Order ID"} column={column} />,
                    cell: info => {
                        const isSubOrderTotal = info.row.original?.is_sub_order_total;
                        return (
                            <div className={!isSubOrderTotal ? 'text-blue-500' : 'text-black'}>
                                <TableIdColumn id={info.row?.original?.order_id ?? ''} getPath={() => `/orders/${info.row?.original?.order_id}`} />
                            </div>
                        );
                    },
                    enableSorting: false,
                },
                {
                    accessorKey: 'org_payment_staus',
                    header: ({ column }) => <DataTableColumnHeader title={"Payment Status"} column={column} />,
                    cell: info => {
                        return (
                            <PaymentStatusSelect
                                disabled={!isCustomerFacing}
                                initialStatus={info.row.original.org_payment_status}
                                onChange={(newStatus) => {
                                    const orderTotalId = info.row.original.id;
                                    if (orderTotalId) {
                                        updateOrderTotalMutation.mutate({ orderTotalId: orderTotalId, orderTotalData: { ...info.row.original, org_payment_status: newStatus } });
                                    }
                                }}
                            />
                        );
                    },
                    enableSorting: false,
                },
                {
                    accessorKey: 'user_payment_status',
                    header: ({ column }) => <DataTableColumnHeader title={"Payment Status"} column={column} />,
                    cell: info => {
                        return (
                            <PaymentStatusSelect
                                disabled={!isCustomerFacing}
                                initialStatus={info.row.original.user_payment_status}
                                onChange={(newStatus) => {
                                    const orderTotalId = info.row.original.id;
                                    if (orderTotalId) {
                                        updateOrderTotalMutation.mutate({ orderTotalId: orderTotalId, orderTotalData: { ...info.row.original, user_payment_status: newStatus } });
                                    }
                                }}
                            />
                        );
                    },
                    enableSorting: false,
                },
                {
                    accessorKey: 'created_at',
                    header: ({ column }) => <DataTableColumnHeader id={"created_at"} title={"Created Date"} column={column} />,
                    cell: info => {
                        const dateValue = info.getValue() as string;
                        const date = new Date(dateValue);
                        return date.toLocaleDateString();
                    },
                    enableSorting: false,
                },
                {
                    accessorKey: 'is_sub_order_total',
                    header: ({ column }) => <DataTableColumnHeader column={column} title={"Is Sub Order Total"} />,
                    enableSorting: false,
                    cell: info => {
                        const isSubOrderTotal = info.getValue() as boolean;
                        return (
                            <div className={!isSubOrderTotal ? 'text-blue-500' : 'text-black'}>
                                {!isSubOrderTotal ? 'No' : 'Yes'}
                            </div>
                        );
                    },
                },
                {
                    accessorKey: 'id',
                    header: 'Actions',
                    cell: info => (
                        <Button
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete this order total?')) {
                                    deleteOrderTotal(info.row.original.id as string);
                                }
                            }}
                            disabled={isDeleting}
                            variant='destructive'
                        >
                            Delete
                        </Button>
                    ),
                },
                {
                    accessorKey: 'id',
                    header: ({ column }) => <DataTableColumnHeader title={"ID"} column={column} />,
                    cell: info => <div>{info.row.original.id ?? 'Unknown'}</div>,
                    enableSorting: false,
                },

                {
                    accessorKey: 'order_id',
                    header: ({ column }) => <DataTableColumnHeader title={"Order ID"} column={column} />,
                    cell: info => {
                        return (
                            <div className='text-black'>
                                {info.row?.original?.order_id ?? ''}
                            </div>
                        );
                    },
                    enableSorting: false,
                },
            ];
        }

        return baseColumns;
    }, [isCustomerFacing, deleteOrderTotal, isDeleting]);


    const table = useReactTable({
        data: orderTotalPageData ?? [],
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
    // =========== End Of Columns & Table ===========

    if (isMobileView) {
        return (
            <OrderTotalsTableMobileView
                orderTotalPageData={orderTotalPageData}
                goPrevPage={goPrevPage}
                goNextPage={goNextPage}
                pageIndex={pageIndex}
                hasMoreOrderTotals={hasMoreOrderTotals}
            />
        );
    }

    return (
        <div className={cn(className)}>
            <ColorfullTable<OrderTotal>
                tableInstance={table}
                title={'Order Totals'}
                isTitleHidden={true}
                isLoading={isLoading}
            />
        </div>
    );
};