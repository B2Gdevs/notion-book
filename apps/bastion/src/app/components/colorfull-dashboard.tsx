'use client';

import _ from 'lodash';
import moment from 'moment-timezone';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Area, ColorfullKpiSection, DailyJobDashboard, DeliveryWindow, DeliveryWindowSelection, ENTITY_QUERY_MAX_LIMIT, Order, OrderItem, TitleComponent, User, calculateInvoiceSummary, calculateOrderTotals, parseGuestDetails, useGetAreas, useGetDeliveryJobTotals, useGetDeliveryWindows, useGetOrderItems, useGetOrders, useGetOrgsByIds, useGetShares, useGetUsers } from 'ui'; // Adjust the import path as necessary
import { WeeklyOrgBudgetScheduleDisplay } from '../weekly-org-budget-schedule-display';

export const ColorfullDashboard: React.FC = () => {
    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedWindow, setSelectedWindow] = useState<DeliveryWindow | undefined>();
    const [selectedArea, setSelectedArea] = useState<Area | undefined>();

    const { data: areas } = useGetAreas(0, 10);


    const { data: deliveryWindows } = useGetDeliveryWindows({
        // ids: deliveryWindowIds,
        page: 1,
        pageSize: ENTITY_QUERY_MAX_LIMIT,
        areaId: selectedArea?.id
    }, Boolean(selectedArea));


    useEffect(() => {
        if (areas?.length) {
            setSelectedArea(areas[0]);
        }
    }, [areas]);

    useEffect(() => {
        if (deliveryWindows?.length) {
            const defaultDeliveryWindow = deliveryWindows.find(window => window.is_default);
            setSelectedWindow(defaultDeliveryWindow);
        }
    }, [deliveryWindows]);

    const areaTimezone = selectedArea?.timezone ?? 'America/Chicago';

    // Parse the delivery time in the area timezone using Moment.js
    function parseDeliveryTime(deliveryTime: string): moment.Moment {
        const [hours, minutes] = deliveryTime.split(':').map(Number);
        return moment.tz(selectedDate, areaTimezone)
            .hour(hours)
            .minute(minutes)
            .second(0)
            .millisecond(0);
    }
    
    const parsedSelectedWindow = selectedWindow && selectedWindow.delivery_time
        ? parseDeliveryTime(selectedWindow.delivery_time)
        : null;
    
    // Use the parsedSelectedWindow Moment.js object directly
    const startDateMoment = parsedSelectedWindow
        ? parsedSelectedWindow
        : moment.tz(selectedDate, areaTimezone).startOf('day');
    
    const endDateMoment = parsedSelectedWindow
        ? startDateMoment.clone().add(1, 'hour')
        : startDateMoment.clone().endOf('day');

    const startDate = startDateMoment.clone().utc().toDate();
    const endDate = endDateMoment.clone().utc().toDate();
    
    // Use the Date objects or ISO strings as required by your API functions
    const { data: ordersData, refetch: refetchOrders } = useGetOrders({
        page: 1,
        pageSize: ENTITY_QUERY_MAX_LIMIT,
        is_sub_order: false,
        startDate: startDate,
        endDate: endDate,
    });
    
    const { data: orderItems } = useGetOrderItems({
        page: 1,
        pageSize: ENTITY_QUERY_MAX_LIMIT,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        dateTimeField: 'delivery_date',
    }, !!parsedSelectedWindow);
    

    const potentialUserOrders = orderItems?.reduce((acc: Record<string, OrderItem[]>, orderItem) => {
        const userId = orderItem.user_id ?? '';
        const guestId = orderItem.share_guest_id ?? '';

        // Ensure both user and guest IDs are treated as keys
        if (!acc[userId]) {
            acc[userId] = [];
        }
        if (!acc[guestId]) {
            acc[guestId] = [];
        }

        acc[userId].push(orderItem);
        if (userId !== guestId) {
            acc[guestId].push(orderItem);
        }

        return acc;
    }, {});

    const userIds = Object.keys(potentialUserOrders ?? {}).filter(key => !key.includes('_guest_'));
    // Assuming parseGuestDetails is correctly implemented to extract the shareId
    const shareGuestIds = orderItems?.map(item => item.share_guest_id).filter(Boolean); // Filter out undefined or null values

    // Extract unique shareIds using lodash's uniq function
    const shareIds = _.uniq(shareGuestIds?.map(shareGuestId => {
        const details = parseGuestDetails(shareGuestId ?? '');
        return details.shareId;
    }));

    const { data: shares } = useGetShares({
        share_ids: shareIds,
        page: 1,
        pageSize: 1000
    }, shareIds.length > 0);

    const { data: users } = useGetUsers(
        { userIds: userIds.length > 0 ? userIds : undefined },
        userIds.length > 0
    );

    const userMap = users?.reduce((acc: Record<string, User>, user) => {
        acc[user?.id ?? ''] = user;
        return acc;
    }, {});

    useEffect(() => {
        refetchOrders();
    }, [selectedDate, selectedWindow, refetchOrders]);


    let potentialJobOrgIds = (users?.map(user => user?.org_id).filter(Boolean) ?? []) as string[];

    // add org id from share and using lodash's uniq function to remove duplicates
    potentialJobOrgIds = _.uniq([
        ...potentialJobOrgIds,
        ...(shares?.map(share => share?.org_id).filter(Boolean) ?? []) as string[]
    ]);

    const { data: orgs } = useGetOrgsByIds(potentialJobOrgIds);

    const calculatePotentialMetrics = () => {
        // filter out all empty string keys and values from potentialUserOrders
        let potentialUserOrdersFiltered = Object.keys(potentialUserOrders ?? {}).reduce((acc: Record<string, OrderItem[]>, key) => {
            if (key) {
                acc[key] = (potentialUserOrders ?? {})[key];
            }
            return acc;
        }, {});

        // flatten all order items
        let allOrderItems = Object.values(potentialUserOrdersFiltered ?? {}).flat();
        let allUsers = Object.keys(potentialUserOrdersFiltered ?? {}).flat();
        let potentialTotals = calculateOrderTotals(allOrderItems);
        return {
            totalJobs: potentialJobOrgIds?.length ?? 0,
            totalOrders: allUsers?.length ?? 0,
            totalOrderItems: orderItems?.length ?? 0,
            totalUsers: allUsers?.length ?? 0,
            potentialOrderTotal: potentialTotals ?? {},
        };
    };

    const potentialMetrics = calculatePotentialMetrics();

    const orgsOrders = ordersData?.reduce((acc: Record<string, Order[]>, order) => {
        if (!acc[order?.org_id ?? '']) {
            acc[order?.org_id ?? ''] = [];
        }
        acc[order?.org_id ?? ''].push(order);
        return acc;
    }, {});


    const { data: jobTotals } = useGetDeliveryJobTotals({ page: 1, pageSize: 1000 });

    const invoiceSummaryTotals = calculateInvoiceSummary(jobTotals ?? []);

    const handleMenuClick = (buttonName: string) => {
        switch (buttonName) {
            case 'view-partner-metrics':
                router.push('/partner-metrics');
                break;
            default:
                console.error('Unknown action');
        }
    };


    const menuItems = [
        { name: 'view-partner-metrics', label: 'View Partner Metrics' }
    ];

    return (

        <TitleComponent
            className='m-4'
            leftTitle={`$${potentialMetrics?.potentialOrderTotal?.total?.toFixed(2) ?? 0} ${selectedArea?.name ?? ''} - ${selectedDate?.toDateString() ?? ''}`}
            rightTitle={`Jobs: ${potentialMetrics.totalJobs}, Orders: ${potentialMetrics.totalOrders}, Order Items: ${potentialMetrics.totalOrderItems}, Users: ${potentialMetrics.totalUsers}`}
        >
            <DeliveryWindowSelection
                selectedDate={selectedDate}
                selectedArea={selectedArea}
                selectedWindow={selectedWindow}
                onWindowSelect={setSelectedWindow}
                onAreaSelect={(_, area) => setSelectedArea(area)}
            />

            <ColorfullKpiSection jobTotals={jobTotals ?? []}
                invoiceSummaryTotals={invoiceSummaryTotals}
                menuItems={menuItems}
                handleMenuClick={handleMenuClick} />

            <DailyJobDashboard
                selectedDate={selectedDate}
                potentialMetrics={potentialMetrics}
                orgs={orgs ?? []}
                orgsOrders={orgsOrders ?? {}}
                potentialUserOrders={potentialUserOrders}
                userMap={userMap ?? {}}
                shares={shares ?? []}
                setSelectedDate={setSelectedDate} />

            <TitleComponent leftTitle='Customer Budget Schedules'>
                <WeeklyOrgBudgetScheduleDisplay />
            </TitleComponent>
        </TitleComponent>

    )
}