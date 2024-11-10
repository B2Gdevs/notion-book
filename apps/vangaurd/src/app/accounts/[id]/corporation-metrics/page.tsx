'use client';
import { endOfToday, startOfToday, subWeeks } from 'date-fns';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import { DateRangePicker, MetricsBento, OrderTotal, OrderTotalsTable, PageTitleDisplay, SkeletonFour, Switch, WavyText, WavyWindow, calculateInvoiceSummary, useGetDeliveryJobTotals, useGetOrderTotals, useGetOrdersByIds, useGetOrgsByQuery } from 'ui';


const CorporationMetricsPage: React.FC = () => {
    const params = useParams();
    const orgClerkId = params.id as string;
    const { data: orgs } = useGetOrgsByQuery({ externalId: orgClerkId });
    const [showOrdersTable, setShowOrdersTable] = useState(false);
    const org = orgs?.[0] ?? null;
    const [startDate, setStartDate] = useState<Date>(subWeeks(startOfToday(), 1));
    const [endDate, setEndDate] = useState<Date>(endOfToday());

    const { data: orderTotalsInDateRange } = useGetOrderTotals({
        page: 1,
        pageSize: 1000,
        start_date: startDate,
        end_date: endDate,
        org_id: org?.id ?? '',
        datetime_field: 'delivery_date',
        sort_by: 'delivery_date',
        sort_direction: 'desc',
        is_sub_order_total: false,
    }, true);

    const jobTotalsQueryParams = {
        org_id: org?.id ?? '',
        start_date: startDate,
        end_date: endDate,
        datetime_field: 'delivery_date',
        page: 1,
        page_size: 100,
    };
    const { data: jobTotals } = useGetDeliveryJobTotals(jobTotalsQueryParams);
    const {
        sumOfJobTotals,
        sumOfUnder50Overages,
    } = calculateInvoiceSummary(jobTotals ?? []);


    const orderIds = orderTotalsInDateRange ? orderTotalsInDateRange.map((orderTotal: OrderTotal) => orderTotal.order_id) : [];
    const { data: mainOrders } = useGetOrdersByIds(orderIds);

    // Calculate metrics
    const totalOrders = mainOrders?.length ?? 0;
    const totalOrgOrderSpend = orderTotalsInDateRange?.reduce((sum: number, orderTotal: OrderTotal) => sum + (orderTotal.discount || 0), 0) ?? 0;
    const totalUserSpend = orderTotalsInDateRange?.reduce((sum: number, orderTotal: OrderTotal) => sum + (orderTotal.user_owed_amount || 0), 0) ?? 0;

    const items = [
        {
            title: "Orders",
            description: (
                <div>
                    This is how many Orders we have been able to deliver to yall!
                </div>
            ),
            header: (
                <div className="p-4">
                    <WavyText title="Total Number Of Orders" subTitle={`${totalOrders}`} />

                </div>
            ),
            className: "md:col-span-4",
        },
        {
            title: "Spend",
            description: (
                <div>
                    Your order metrics showcasing the total orders, total spent, and total canceled sub orders.
                </div>
            ),
            header: <SkeletonFour
                firstCardText='Total Spend'
                secondCardText='Total Org Order Subsidized'
                thirdCardText='Total User Spend'
                firstCardSubText={`${(sumOfJobTotals + sumOfUnder50Overages + totalUserSpend).toFixed(2)}`}
                secondCardSubText={`$${totalOrgOrderSpend.toFixed(2)}`}
                thirdCardSubText={`$${totalUserSpend.toFixed(2)}`}
            />,
            className: "md:col-span-4",
        },

    ];

    return (
        <div>
            <PageTitleDisplay overrideTitle='Metrics' additionalText={org?.name} />
            <div className='flex flex-row justify-between items-start lg:items-center gap-2 my-2'>
                <div className='flex flex-col lg:flex-row justify-start items-start lg:items-center gap-2 my-2'>
                    <label className='block text-sm font-medium text-gray-700 lg:my-2'>Date Range</label>
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onStartDateSelected={setStartDate}
                        onEndDateSelected={setEndDate}
                    />
                </div>
                <div className='flex flex-col lg:flex-row justify-start items-end lg:items-center gap-2 my-2 text-sm'>
                    <span className='lg:my-2'>{showOrdersTable ? 'Go Back' : 'View Order Totals Table'}</span>
                    <Switch
                        className='cursor-pointer my-2'
                        checkedRootColor="bg-primary-lime-green"
                        checkedThumbColor="bg-primary-spinach-green"
                        checked={showOrdersTable}
                        onClick={() => setShowOrdersTable(!showOrdersTable)}
                    />
                </div>
            </div>
            {((mainOrders?.length ?? 0) == 0 || !mainOrders) ? (<>
                <WavyWindow
                    mainText="Orders are coming..."
                    subText="No orders have been placed within the selected date range."
                />
            </>) : (<>
                {showOrdersTable ? (
                    <OrderTotalsTable
                        startDate={startDate}
                        endDate={endDate}
                        orgId={org?.id ?? ''}
                        is_sub_order_total={false}
                        isCustomerFacing={true}
                    />
                ) : (
                    <MetricsBento items={items} />
                )}
            </>)}
        </div>
    );
}


export default CorporationMetricsPage;
