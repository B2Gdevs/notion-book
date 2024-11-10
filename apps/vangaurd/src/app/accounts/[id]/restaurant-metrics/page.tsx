'use client'

import { startOfToday, subWeeks, endOfToday } from 'date-fns';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { Brand, BrandSelect, DateRangePicker, MetricsBento, Order, OrderStatus, OrderTotal, OrderTotalsTable, PageTitleDisplay, SkeletonFour, Store, StoreSelect, WavyWindow, useGetOrderTotals, useGetOrdersByIds, useGetOrgsByQuery } from 'ui';

const RestaurantMetrics: React.FC = () => {
    const params = useParams();
    const orgClerkId = params?.id as string;

    const { data: orgs } = useGetOrgsByQuery({ externalId: orgClerkId });
    const org = orgs?.[0] ?? null;
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [startDate, setStartDate] = useState<Date>(subWeeks(startOfToday(), 1));
    const [endDate, setEndDate] = useState<Date>(endOfToday());

    const { data: orderTotalsInDateRange } = useGetOrderTotals({
        page: 1,
        pageSize: 1000,
        start_date: startDate,
        end_date: endDate,
        store_id: selectedStore?.id ?? '',
        datetime_field: 'delivery_date',
        sort_by: 'delivery_date',
        sort_direction: 'desc',
        is_sub_order_total: true,
    }, true);

    const orderIds = orderTotalsInDateRange ? orderTotalsInDateRange.map((orderTotal: OrderTotal) => orderTotal.order_id) : [];
    // filter empty ids, null ids, etc, it needs to tbe a string
    const filteredOrderIds = orderIds.filter((order_id: string | null | undefined) => order_id !== null && order_id !== undefined && order_id !== '');
    const { data: subOrders } = useGetOrdersByIds(filteredOrderIds);


    const totalOrders = orderTotalsInDateRange?.length ?? 0;
    const totalCanceled = subOrders?.filter((subOrder: Order) => (subOrder?.status == OrderStatus.CANCELED)).length ?? 0;
    const totalSpent = orderTotalsInDateRange?.reduce((sum: number, orderTotal: OrderTotal) => sum + (orderTotal?.discount ?? 0), 0) ?? 0;

    const items = [
        {
            title: "Order Metrics",
            description: (
                <div>
                    Your order metrics showcasing the total orders, total spent, and total canceled orders.
                </div>
            ),
            header: <SkeletonFour
                firstCardText='Total Orders Received'
                secondCardText='Total Customer Spend!'
                thirdCardText='Total Canceled Orders'
                firstCardSubText={`${totalOrders}`}
                secondCardSubText={`$${totalSpent.toFixed(2)}`}
                thirdCardSubText={`${totalCanceled}`}
            />,
            className: "md:col-span-4",
        },


    ];


    return (
        <div>
            <PageTitleDisplay additionalText={org?.name} />
            <div className='grid grid-cols-3 gap-4'>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Brand</label>
                    <BrandSelect
                        allowedBrandIds={org?.brand_ids}
                        onChange={setSelectedBrand}
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Store</label>
                    <StoreSelect
                        allowedStoreIds={selectedBrand?.store_ids}
                        onChange={setSelectedStore}
                    />
                </div>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Date Range</label>
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateSelected={setStartDate}
                        onEndDateSelected={setEndDate}
                    />
                </div>
            </div>
            {orderTotalsInDateRange?.length === 0 ? (
                <WavyWindow
                    mainText="No orders found"
                    subText="There are no orders within the selected date range and filters."
                />
            ) : (
                <>
                    <MetricsBento
                        className='mt-4'
                        items={items}
                    />
                    <OrderTotalsTable
                        className='w-full'
                        orderTotals={orderTotalsInDateRange}
                        onlyUseGivenOrderTotals={true} 
                        isCustomerFacing={true}
                        />

                </>
            )}
        </div>
    );
}

export default RestaurantMetrics;