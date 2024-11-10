'use client';

import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { Area, COLORFULL_GUEST_CLERK_IDS, CourierStatus, FulfillmentMode, OrderItem, OrderStatus, Org, SchedulingType, Share, User, calculateOrderTotals, getBudgetAmountForDay, useGetCurrentColorfullUser } from '../..';
import { Order } from '../../models/orderModels';
import { useGetDeliveryWindowById } from '../deliveryWindowHooks';
import { useGetOrders } from '../orderHooks';
import { useGetOrderItems } from '../orderItemHooks';

export const createOrUpdateOrderObject = (
	existingOrder: Order | undefined,
	selectedDate: Date,
	orderItems: OrderItem[] | undefined,
	orderNote: string = '',
	user: User | undefined,
	org: Org | undefined,
	tip: number,
	area: Area | undefined,
	isStipendApplied: boolean,
	share_guest_id?: string,
	share?: Share,
	isAdminGuestAccount?: boolean,
): Order | null => {

	if (!user?.id) {
		return null;
	}

	if (!org?.id) {
		return null;
	}

	if (!area) {
		return null;
	}
	// If orderItems is undefined or empty, retain the existing items
	// const itemsToUpdate = (orderItems?.length ?? 0) > 0 ? orderItems : existingOrder?.items;
	const itemsToUpdate = orderItems

	// Common order creation logic
	const userWorkLocation = org.locations?.find((location) => location.address === user.work_address);
	const areaTimezone = area.timezone ?? 'UTC';
	const { data: deliveryWindow } = useGetDeliveryWindowById((share ? share.delivery_window_id : org.delivery_window_id) ?? '');

	// Ensure defaultDeliveryTime is always a valid string
	const defaultDeliveryTime = deliveryWindow?.delivery_time ?? area?.area_delivery_time ?? "00:00";

	const deliveryTimeOffset = (deliveryWindow ? deliveryWindow.delivery_time_window_off_set : area?.delivery_time_window_off_set) ?? 30;

	let [hours, minutes] = defaultDeliveryTime.split(':').map(Number);

	const selectedDateInAreaTimezone = utcToZonedTime(selectedDate, areaTimezone);
	minutes += deliveryTimeOffset;
	selectedDateInAreaTimezone.setHours(hours, minutes, 0, 0);
	const deliveryTimeUtc = zonedTimeToUtc(selectedDateInAreaTimezone, areaTimezone);
	const deliveryTimeISOString = deliveryTimeUtc.toISOString();

	let share_guest_email;
	if (share_guest_id) {
		// If share_guest_id is provided, populate extra field on Order object
		share_guest_email = user.email;
	}

	let budgetAmount;
	if (share && share_guest_id) {
		budgetAmount = share.budget;
	} else {
		budgetAmount = org.budget?.amount;
	}
	const orderTotals = calculateOrderTotals(
		itemsToUpdate,
		org.financial_details?.taxes[0]?.rate ?? 0,
		budgetAmount ?? 0,
		tip,
		isStipendApplied,
		isAdminGuestAccount,
	);

	// Construct or update the order object
	const order: Order = {
		...existingOrder, // Spread existing order to retain original values
		user_id: user.id, // Overwrite specific fields with new values
		external_identifiers: {
			friendly_id: 'Colorfull',
		},
		currency_code: 'USD',
		status: OrderStatus.NEW_ORDER, // Consider if you need to update the status
		items: itemsToUpdate,
		ordered_at: existingOrder?.ordered_at ?? new Date().toISOString(), // Retain original order date if existing
		order_total: {
			subtotal: orderTotals.subtotal ?? 0,
			tax: orderTotals.tax ?? 0,
			discount: getBudgetAmountForDay(selectedDate, org) ?? 0,
			total: orderTotals.total ?? 0,
			tip: orderTotals.tip,
			tax_total: orderTotals.tax_total ?? 0,
		},
		org_id: org.id,
		fulfillment_info: {
			delivery_time: deliveryTimeISOString,
			fulfillment_mode: FulfillmentMode.DELIVERY,
			scheduling_type: SchedulingType.FIXED_TIME,
			courier_status: CourierStatus.COURIER_UNASSIGNED,
		},
		delivery_info: {
			destination: {
				full_address: user.work_address,
				location: userWorkLocation,
			},
		},
		area_id: userWorkLocation?.area_id,
		customer_note: orderNote,
		is_sub_order: existingOrder?.is_sub_order ?? false, // Provide a default value in case it's undefined
		share_id: share?.id,
		share_guest_id: share_guest_id,
		share_guest_email: share_guest_email,
		delivery_window_id: share ? share.delivery_window_id : org.delivery_window_id,
	};

	return order;
};

export const getDateKey = (selectedDate: Date) => selectedDate.toISOString().split('T')[0];



const filterValidOrderItems = (orderItems: OrderItem[] | undefined): OrderItem[] => {
	return orderItems?.filter(Boolean) || [];
};

export const useGetCurrentUserCartOrderItemsByDateNotUsingCalendarCart = (selectedDate: Date) => {
	const { data: user, refetch } = useGetCurrentColorfullUser();
	const userIsGuest = COLORFULL_GUEST_CLERK_IDS.includes(user?.clerk_id ?? '');
	const { userCartOrderItems, isLoading, error } = useGetUserOrderItemsByDateNotUsingCalendarCart(user, selectedDate, !userIsGuest);

    if (userIsGuest) {
        return { userCartOrderItems: [], isLoading: false, error: null, refetch };
    }
	return { userCartOrderItems, isLoading, error, refetch };
};


export const useGetUserOrderItemsByDateNotUsingCalendarCart = (user: User | undefined, selectedDate: Date, enabled: boolean = true) => {
	const { startDateStartOfDay, endDateEndOfDay } = getStartAndEndOfDay(selectedDate)

	const { data: orderItems, isLoading, error } = useGetOrderItems({
		page: 1,
		pageSize: 100,
		userId: user?.id,
		startDate: startDateStartOfDay.toISOString(),
		endDate: endDateEndOfDay.toISOString(),
		dateTimeField: 'delivery_date'
	}, enabled)
	const validOrderItems = filterValidOrderItems(orderItems);
	return { userCartOrderItems: validOrderItems as OrderItem[], isLoading, error };
}

export const useUserIdOrdersForDateRange = (userId: string | undefined, startDate: Date, days: number) => {
	const endDate = new Date(startDate);
	endDate.setDate(startDate.getDate() + days);

	const { startDateStartOfDay, endDateEndOfDay } = getStartAndEndOfDayForRange(startDate, endDate);

	let params = {
		page: 1,
		pageSize: 100,
		userId: userId,
		startDate: startDateStartOfDay,
		endDate: endDateEndOfDay,
		dateTimeField: 'delivery_date'
	};

	const { data: orders, isLoading, error } = useGetOrders(params);

	return {
		orders: orders ?? [],
		isLoading,
		error,
	};
};

function getStartAndEndOfDayForRange(startDate: Date, endDate: Date) {
	const startDateStartOfDay = new Date(startDate);
	startDateStartOfDay.setHours(0, 0, 0, 0);
	const endDateEndOfDay = new Date(endDate);
	endDateEndOfDay.setHours(23, 59, 59, 999);

	return { startDateStartOfDay, endDateEndOfDay };
}

export const useGetGuestUserOrderItemsByShareGuestId = (shareGuestId: string,
	// selectedDate: Date
) => {
	// const { startDateStartOfDay, endDateEndOfDay } = getStartAndEndOfDay(selectedDate)
	const { data: orderItems, isLoading, error } = useGetOrderItems({
		share_guest_id: shareGuestId,
		dateTimeField: 'delivery_date',
		// need to add startDate & endDate parameters here - NOT TESTED
	})
	const validOrderItems = filterValidOrderItems(orderItems);
	return { userCartOrderItems: validOrderItems as OrderItem[], isLoading, error };
}

export const useGetAdminGuestUserOrderItemsById = (adminGuestId: string, selectedDate: Date) => {
	const { startDateStartOfDay, endDateEndOfDay } = getStartAndEndOfDay(selectedDate)

	const { data: orderItems, isLoading, error } = useGetOrderItems({
		page: 1,
		pageSize: 100,
		userId: adminGuestId,
		dateTimeField: 'delivery_date',
		startDate: startDateStartOfDay.toISOString(),
		endDate: endDateEndOfDay.toISOString(),
	})
	const validOrderItems = filterValidOrderItems(orderItems);
	return { userCartOrderItems: validOrderItems as OrderItem[], isLoading, error };
}

export function getStartAndEndOfDay(selectedDate: Date) {
	const startDateStartOfDay = new Date(selectedDate);
	startDateStartOfDay.setHours(0, 0, 0, 0);
	const endDateEndOfDay = new Date(selectedDate);
	endDateEndOfDay.setHours(23, 59, 59, 999);

	return { startDateStartOfDay, endDateEndOfDay };
}
export const useUserOrdersForSelectedDate = (user: User | undefined, selectedDate: Date, is_guest_user: boolean = false, enabled: boolean = true) => {

	const { startDateStartOfDay, endDateEndOfDay } = getStartAndEndOfDay(selectedDate)

	// Call useGetOrders with different parameters if is_guest_user is true
	let params = {};
	if (is_guest_user) {
		params = { share_guest_id: user?.id, startDate: startDateStartOfDay, endDate: endDateEndOfDay };
	} else {
		params = { userId: user?.id, startDate: startDateStartOfDay, endDate: endDateEndOfDay };
	}
	const { data: orders, isLoading, error } = useGetOrders(params, enabled);

	// React Query's useQuery hook automatically handles loading and error states,
	// so you can directly return its results along with the fetched orders.
	return {
		orders: orders ?? [],
		isLoading,
		error,
	};
};

export const useOrderDetailsAndManagement = (user: User | undefined, selectedDate: Date, is_guest_user: boolean = false, enabled: boolean = true) => {
	const { orders: selectedDateOrders, isLoading } = useUserOrdersForSelectedDate(user, selectedDate, is_guest_user, enabled);

	// Active and canceled orders
	const activeOrders: Order[] = selectedDateOrders?.filter(order =>
		order.status !== OrderStatus.CANCELED && order.status !== OrderStatus.PARTIALLY_CANCELED
	);
	const canceledOrders: Order[] = selectedDateOrders?.filter(order =>
		(order.status === OrderStatus.CANCELED || order.status === OrderStatus.PARTIALLY_CANCELED)
	);

	return { activeOrders, canceledOrders, isLoading };
};

export const useCurrentColorfullUserOrdersForSelectedDate = (
	selectedDate: Date,
	isAdminGuest: boolean = false,
	enabled: boolean = false,
) => {
	const { data: user } = useGetCurrentColorfullUser();
	// Construct a temporary User object
	const adminGuestUser: User = {
		id: user?.id + '_guest',
		first_name: user?.first_name,
		last_name: user?.last_name,
		email: user?.email ?? '',
		phone: user?.phone,
		org_id: user?.org_id,
		work_address: user?.work_address,
	};


	const { activeOrders, canceledOrders, isLoading } = useOrderDetailsAndManagement(isAdminGuest ? adminGuestUser : user, selectedDate, enabled);
	const activeMainOrders = activeOrders.filter(order => !order.is_sub_order);
	const canceledMainOrders = canceledOrders.filter(order => !order.is_sub_order);
	const activeSubOrders = activeOrders.filter(order => order.is_sub_order);
	const canceledSubOrders = canceledOrders.filter(order => order.is_sub_order);
	const data = { activeMainOrders, canceledMainOrders, activeSubOrders, canceledSubOrders, isLoading }
	return data;
}

export const useCurrentGuestUserOrdersForSelectedDate = (selectedDate: Date, guestUser: User) => {
	if (!guestUser) {
		return { guestActiveMainOrders: [], guestCanceledMainOrders: [], guestActiveSubOrders: [], guestCanceledSubOrders: [] };
	}
	const { activeOrders, canceledOrders, isLoading } = useOrderDetailsAndManagement(guestUser, selectedDate, true);

	const guestActiveMainOrders = activeOrders.filter(order => !order.is_sub_order);
	const guestCanceledMainOrders = canceledOrders.filter(order => !order.is_sub_order);
	const guestActiveSubOrders = activeOrders.filter(order => order.is_sub_order);
	const guestCanceledSubOrders = canceledOrders.filter(order => order.is_sub_order);
	const data = { guestActiveMainOrders, guestCanceledMainOrders, guestActiveSubOrders, guestCanceledSubOrders, isLoading };
	return data;
}