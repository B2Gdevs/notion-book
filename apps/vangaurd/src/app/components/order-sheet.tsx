'use client';

import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import {
	OrderItem,
	OrderSheetErrorSection,
	OrderSheetExistingOrderSection,
	OrderSheetFinancialSection,
	OrderSheetNoItemsSection,
	OrderSheetOrderButton,
	OrderStatus,
	OrderTotal,
	Share,
	User,
	createOrUpdateOrderObject,
	isBudgetScheduleAppliedForDay,
	getHolidayOfDate,
	isPastOrderTime,
	toast,
	useCurrentColorfullUserOrdersForSelectedDate,
	useCurrentGuestUserOrdersForSelectedDate,
	useDeleteOrderItem,
	useGetAdminGuestUserOrderItemsById,
	useGetArea,
	useGetBrandsByIds,
	useGetCalendarEvents,
	useGetCurrentColorfullUser,
	useGetCurrentUserCartOrderItemsByDateNotUsingCalendarCart,
	useGetCurrentUserColorfullOrg,
	useGetDefaultPaymentMethod,
	useGetDeliveryWindowById,
	useGetOrderItems,
	useGetOrg,
	useGetStores,
	useUpdateOrder,
	useUpdateOrderItem,
	validateCanCreateOrder
} from 'ui';
import { GlobalState, useGlobalStore } from '../../stores/globalStore';
import { OrderSheetOrderItemCollapsible } from './order-sheet-order-item-collapsible';
import { utcToZonedTime } from 'date-fns-tz';

export interface OrderSheetProps {
	isCheckout?: boolean;
	selectedDate: Date;
	onMyAccountSettingsClick?: () => void;
	isGuestLimitedView?: boolean;
	share?: Share;
	adminGuestId?: string;
}

export const OrderSheet: React.FC<OrderSheetProps> = ({
	isCheckout,
	selectedDate,
	onMyAccountSettingsClick,
	isGuestLimitedView,
	share,
	adminGuestId,
}) => {
	const { data: user } = useGetCurrentColorfullUser();
	const { data: org } = useGetCurrentUserColorfullOrg();
	const { data: deliveryWindow } = useGetDeliveryWindowById(org?.delivery_window_id ?? '');
	const areaId = org?.locations?.[0]?.area_id ?? '';
	const { data: area } = useGetArea(areaId);
	const orderNote = ''
	const tip = 0;

	//== GUEST HANDLING START

	// Attempt to retrieve and parse the guestUserInfo from localStorage safely
	let guestUserInfo;
	try {
		const guestUserInfoRaw = localStorage.getItem('guestUserInfo');
		if (guestUserInfoRaw) {
			guestUserInfo = JSON.parse(guestUserInfoRaw);
		} else {
			throw new Error("Guest user info not found in localStorage.");
		}
	} catch (error) {
		// Handle the error appropriately, perhaps by setting a default state or notifying the user
		guestUserInfo = {}; // Set to an empty object or handle as needed
	}

	const guestOrderId = localStorage.getItem('guestOrderId') || '';

	const shareGuestId = guestOrderId && guestUserInfo ? `${guestUserInfo.first_name}_${guestUserInfo.last_name}_${guestOrderId}` : '';

	// Destructure properties safely with default values to avoid runtime errors
	const {
		first_name = '',
		last_name = '',
		email = '',
		phone = '',
		org_id = '',
		work_address = '',
	} = guestUserInfo || {};

	// Construct a temporary User object only if all required info is available
	let guestUser;
	if (first_name && last_name && guestOrderId && email && org_id && work_address) {
		guestUser = {
			id: first_name + '_' + last_name + '_' + guestOrderId,
			first_name: first_name,
			last_name: last_name,
			email: email,
			phone: phone || undefined,  // Allow phone to be undefined if empty
			org_id: org_id,
			work_address: work_address,
		};
	}

	const { data: guestOrg } = useGetOrg(share?.org_id ?? '');
	const guestAreaId = guestOrg?.locations?.[0]?.area_id ?? '';
	const { data: guestArea } = useGetArea(guestAreaId);

	const { data: guestOrderItems } = useGetOrderItems({
		share_guest_id: shareGuestId,
	});


	const { data: guestDeliveryWindow } = useGetDeliveryWindowById(share?.delivery_window_id ?? '');
	const guestDeliveryWindowOrderCutoffTime = guestDeliveryWindow?.order_cutoff_time ?? '';

    const timeZone = deliveryWindow?.timezone ?? 'UTC';
    const shareDateToPass = utcToZonedTime(share?.date ?? new Date(), timeZone);

	const { guestActiveMainOrders, guestCanceledMainOrders } = useCurrentGuestUserOrdersForSelectedDate(shareDateToPass, guestUser ?? {} as User);

	const guestNewOrUpdatedOrder = createOrUpdateOrderObject(guestCanceledMainOrders?.[0], shareDateToPass, guestOrderItems, orderNote, guestUser, guestOrg, tip, guestArea, true, guestUser?.id, share);

	const hasGuestUserOrderedToday = Boolean(guestActiveMainOrders?.[0]);
	let isGuestPastCutoffTime = false;
	let isGuestPastRebatchCutoffTime = false;
	if (shareDateToPass && !isNaN(shareDateToPass.getTime())) { // Check if shareDateToPass is a valid date
		const cutoffTimeToUse = guestDeliveryWindowOrderCutoffTime || guestArea?.order_cutoff_time;
		isGuestPastCutoffTime = isPastOrderTime(cutoffTimeToUse ?? '10:30', guestArea?.timezone ?? 'America/Chicago', shareDateToPass.toISOString());
		// ** Guest rebatch cutoff time for LATER delivery window is not yet implemented in the UI, so we're using the order_rebatch_cutoff_time from the guestArea for now
		isGuestPastRebatchCutoffTime = isPastOrderTime(guestArea?.order_rebatch_cutoff_time ?? '11:20', guestArea?.timezone ?? 'America/Chicago', shareDateToPass?.toISOString());
	}

	const guestOrderValidationResult = validateCanCreateOrder(
		hasGuestUserOrderedToday,
		guestNewOrUpdatedOrder?.order_total as OrderTotal,
		org?.financial_details?.taxes?.[0]?.rate ?? 0.0825,
		isGuestPastCutoffTime,
		guestArea,
		guestUser,
		guestOrg,
		isGuestPastRebatchCutoffTime,
		undefined,
		undefined,
		undefined,
		undefined,
		share
	);


	const guest_store_ids = guestNewOrUpdatedOrder?.items?.map(item => item.store_id);
	const guestStores = useGetStores({ storeIds: guest_store_ids });
	// Map over guestOrderItems and find the corresponding store for each item
	const guestOrderItemsWithStore = guestNewOrUpdatedOrder?.items?.map(item => {
		const store = guestStores?.data?.find(store => store?.id === item.store_id);
		return { orderItem: item, store: store };
	});

	// Get all brand ids and filter out undefined values
	const guestBrandIds = guestOrderItemsWithStore?.map(orderItemWithStore => orderItemWithStore.store?.brand_id).filter(Boolean) as string[];

	// Fetch all brands by their ids
	const { data: guestBrands } = useGetBrandsByIds(guestBrandIds);

	//== GUEST HANDLING END

	const { userCartOrderItems } = useGetCurrentUserCartOrderItemsByDateNotUsingCalendarCart(selectedDate);
	const { activeMainOrders, canceledMainOrders } = useCurrentColorfullUserOrdersForSelectedDate(selectedDate);
	const [isStipendApplied, setIsStipendApplied] = useState<boolean>(true);
	const [isBudgetScheduleApplied, setIsBudgetScheduleApplied] = useState<boolean>(true);

	useEffect(() => {
		if (!selectedDate || !org) {
			return;
		}
		const dayOfWeek = selectedDate.getDay(); // This returns a number from 0 (Sunday) to 6 (Saturday)
		setIsBudgetScheduleApplied(isBudgetScheduleAppliedForDay(dayOfWeek, org));
	}, [selectedDate, org]);

	const newOrUpdatedOrder = createOrUpdateOrderObject(canceledMainOrders?.[0], selectedDate, userCartOrderItems, orderNote, user, org, tip, area, (isBudgetScheduleApplied && isStipendApplied));
	const hasUserOrderedToday = Boolean(activeMainOrders?.[0]);
	let isPastCutoffTime = isPastOrderTime((deliveryWindow ? deliveryWindow.order_cutoff_time : area?.order_cutoff_time) ?? '10:30', area?.timezone ?? 'America/Chicago', selectedDate?.toISOString() ?? '');
	// deliveryWindow rebatch cutoff time does NOT exist (only the rebatch order_rebatch_cutoff_scheduler_id)
	let isPastRebatchCutoffTime = isPastOrderTime(area?.order_rebatch_cutoff_time ?? '11:20', area?.timezone ?? 'America/Chicago', selectedDate?.toISOString() ?? '');
	const { data: defaultPaymentMethod } = useGetDefaultPaymentMethod(user?.stripe_account_id ?? '');
	
	const orderValidationResult = validateCanCreateOrder(
		hasUserOrderedToday,
		newOrUpdatedOrder?.order_total as OrderTotal,
		org?.financial_details?.taxes?.[0]?.rate ?? 0.0825,
		isPastCutoffTime,
		area,
		user,
		org,
		isPastRebatchCutoffTime,
		defaultPaymentMethod
	);

	const store_ids = newOrUpdatedOrder?.items?.map(item => item.store_id);
	const stores = useGetStores({ storeIds: store_ids });
	const updateOrderItemMutation = useUpdateOrderItem();
	const deleteOrderItemMutation = useDeleteOrderItem({
	});
	const updateOrderMutation = useUpdateOrder({
		onSuccess: () => {
		},
		onError: (error) => {
			toast({
				title: 'Error',
				description: error.body.detail,
				duration: 4000,
			});
		},
	});

	const removeOrderItem = (orderItem: OrderItem) => {
		// Then deletes the orderItem from the database all together
		deleteOrderItemMutation.mutate(orderItem?.id ?? '');
	};

	const updateOrderItem = (updatedOrderItem: OrderItem) => {
		updateOrderItemMutation.mutate({
			orderItemId: updatedOrderItem?.id ?? '',
			orderItem: updatedOrderItem
		}, {
			onError: (error: any) => {
				// Display the error message as a toast notification
				const errorMessage = error?.body?.detail || 'An error occurred while updating the order item';
				toast({ title: 'Error', description: errorMessage, duration: 5000 });
			}
		});
	};

	// Map over orderItems and find the corresponding store for each item
	const orderItemsWithStore = newOrUpdatedOrder?.items?.map(item => {
		const store = stores?.data?.find(store => store?.id === item.store_id);
		return { orderItem: item, store: store };
	});

	// Get all brand ids and filter out undefined values
	const brandIds = orderItemsWithStore?.map(orderItemWithStore => orderItemWithStore.store?.brand_id).filter(Boolean) as string[];

	// Fetch all brands by their ids
	const { data: brands } = useGetBrandsByIds(brandIds);
    const { data: events } = useGetCalendarEvents();
    const holidayCalendarEvent = getHolidayOfDate(selectedDate?.toISOString().slice(0, 10) ?? '', events ?? [])

	// --- Admin Guest Handling ---

	const globalStore = useGlobalStore() as GlobalState;

	const isAdminGuestAccount = globalStore.isAdminGuestAccount;

	const { userCartOrderItems: adminGuestItems } = useGetAdminGuestUserOrderItemsById(adminGuestId ?? '', selectedDate);

	const { activeMainOrders: adminGuestActiveMainOrders, canceledMainOrders: adminGuestCanceledMainOrders } = useCurrentColorfullUserOrdersForSelectedDate(selectedDate, isAdminGuestAccount);

	const adminGuestUser: User = {
		id: user?.id + '_guest',
		first_name: user?.first_name,
		last_name: user?.last_name,
		email: user?.email ?? '',
		phone: user?.phone,
		org_id: user?.org_id,
		work_address: user?.work_address,
	};

	const adminGuestNewOrUpdatedOrder = createOrUpdateOrderObject(adminGuestCanceledMainOrders?.[0], selectedDate, adminGuestItems, orderNote, adminGuestUser, org, tip, area, true, undefined, undefined, isAdminGuestAccount);

	const hasAdminGuestUserOrderedToday = Boolean(adminGuestActiveMainOrders?.[0]);

	const adminGuestOrderValidationResult = validateCanCreateOrder(
		hasAdminGuestUserOrderedToday,
		adminGuestNewOrUpdatedOrder?.order_total as OrderTotal,
		org?.financial_details?.taxes?.[0]?.rate ?? 0.0825,
		isPastCutoffTime,
		area,
		user,
		org,
		isPastRebatchCutoffTime,
		defaultPaymentMethod
	);

	const adminGuestStoreIds = adminGuestNewOrUpdatedOrder?.items?.map(item => item.store_id);
	const adminGuestStores = useGetStores({ storeIds: adminGuestStoreIds });

	// Map over adminGuestOrderItems and find the corresponding store for each item
	const adminGuestOrderItemsWithStore = adminGuestNewOrUpdatedOrder?.items?.map(item => {
		const store = adminGuestStores?.data?.find(store => store?.id === item.store_id);
		return { orderItem: item, store: store };
	});

	// Get all brand ids for admin guest and filter out undefined values
	const adminGuestBrandIds = adminGuestOrderItemsWithStore?.map(orderItemWithStore => orderItemWithStore.store?.brand_id).filter(Boolean) as string[];

	// Fetch all brands by their ids for admin guest
	const { data: adminGuestBrands } = useGetBrandsByIds(adminGuestBrandIds);

	// ---  End Admin Guest Handling ---

	const fadeIn = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				duration: 0.5
			}
		},
		exit: { opacity: 0 }
	};

	if (isGuestLimitedView && share) {
		return (
			<>
				{!guestOrderItems || guestOrderItems.length === 0 ?
					(
						<>
							<OrderSheetNoItemsSection
								hasUserOrderedToday={hasGuestUserOrderedToday}
							/>
						</>
					) : (
						<div className='flex flex-col gap-2 lg:gap-6 pt-4 pb-[90px]'>
							<div className='overflow-y-auto max-h-[100vh] px-2 lg:px-6'>
								{guestOrderItemsWithStore?.map((orderItemWithStore, index) => {
									const brand = guestBrands?.find(brand => brand.id === orderItemWithStore.store?.brand_id);

									return (
										<OrderSheetOrderItemCollapsible
											key={`${orderItemWithStore.orderItem.id}-${index}`}
											orderItem={orderItemWithStore.orderItem}
											index={index}
											tax={guestOrg?.financial_details?.taxes?.[0].rate ?? 0.0825}
											subsidy={guestOrg?.budget?.amount ?? 0}
											onOrderItemRemove={removeOrderItem}
											onOrderItemChange={updateOrderItem}
											isCheckout={isCheckout ?? false}
											subHeaderText={brand?.name ?? ''}
											disabled={Boolean(guestActiveMainOrders?.[0])}
										/>
									)
								})}
							</div>
							<OrderSheetFinancialSection
								newOrUpdatedOrder={guestNewOrUpdatedOrder}
								org={guestOrg}
								// TO-DO: Implement the logic to determine if the guest user has ordered today
								hasUserOrderedToday={hasGuestUserOrderedToday}
								isStipendApplied={true}
								setIsStipendApplied={setIsStipendApplied}
								tip={tip}
								disabled={false}
								isBudgetScheduleApplied={true}
								isGuestLimitedView={true}
								share={share}
							/>
							<OrderSheetExistingOrderSection
								hasUserOrderedToday={hasGuestUserOrderedToday}
								order={guestActiveMainOrders?.[0]}
								onEditOrder={(order) => {
									if (!order?.id) {
										return;
									}
									updateOrderMutation.mutate({
										orderId: order.id,
										orderData: {
											...order,
											status: OrderStatus.CANCELED
										}
									})

								}} />
							<AnimatePresence>
								{!guestOrderValidationResult.canPlaceOrder && (
									// Don't display the error section if the user has already placed an order (activeMainOrders is not empty)
									!Boolean(guestActiveMainOrders?.[0]) && (
										<motion.div
											variants={fadeIn}
											initial="hidden"
											animate="show"
											exit="exit"
										>
											<OrderSheetErrorSection
												errorMessage={guestOrderValidationResult.errorMessage}
												errorType={guestOrderValidationResult.errorType}
												isGuestLimitedView={true}
												className='m-5'
											/>
										</motion.div>
									)
								)}
							</AnimatePresence>
							<OrderSheetOrderButton
								disabled={!guestOrderValidationResult.canPlaceOrder || Boolean(holidayCalendarEvent)}
								newOrUpdatedOrder={guestNewOrUpdatedOrder}
								guestUserEmail={guestUser?.email}
							/>

						</div>
					)}


			</>
		);
	}

	if (isAdminGuestAccount) {
		return (
			<>
				{!adminGuestItems || adminGuestItems.length === 0 ?
					(
						<>
							<OrderSheetNoItemsSection
								hasUserOrderedToday={hasAdminGuestUserOrderedToday}
							/>
						</>
					) : (
						<div className='flex flex-col gap-2 lg:gap-6 pt-4 pb-[90px]'>
							<div className='overflow-y-auto max-h-[100vh] px-2 lg:px-6'>
								{adminGuestOrderItemsWithStore?.map((orderItemWithStore, index) => {
									const brand = adminGuestBrands?.find(brand => brand.id === orderItemWithStore.store?.brand_id);

									return (
										<OrderSheetOrderItemCollapsible
											key={`${orderItemWithStore.orderItem.id}-${index}`}
											orderItem={orderItemWithStore.orderItem}
											index={index}
											tax={org?.financial_details?.taxes?.[0].rate ?? 0.0825}
											subsidy={org?.budget?.amount ?? 0}
											onOrderItemRemove={removeOrderItem}
											onOrderItemChange={updateOrderItem}
											isCheckout={isCheckout ?? false}
											subHeaderText={brand?.name ?? ''}
											disabled={Boolean(adminGuestActiveMainOrders?.[0])}
										/>
									)
								})}
							</div>
							<OrderSheetFinancialSection
								newOrUpdatedOrder={adminGuestNewOrUpdatedOrder}
								org={org}
								// TO-DO: Implement the logic to determine if the guest user has ordered today
								hasUserOrderedToday={hasAdminGuestUserOrderedToday}
								isStipendApplied={true}
								setIsStipendApplied={setIsStipendApplied}
								tip={tip}
								disabled={false}
								isBudgetScheduleApplied={true}
								isAdminGuestAccount={true}
							/>
							<OrderSheetExistingOrderSection
								hasUserOrderedToday={hasAdminGuestUserOrderedToday}
								order={adminGuestActiveMainOrders?.[0]}
								onEditOrder={(order) => {
									if (!order?.id) {
										return;
									}
									updateOrderMutation.mutate({
										orderId: order.id,
										orderData: {
											...order,
											status: OrderStatus.CANCELED
										}
									})

								}} />
							<AnimatePresence>
								{!adminGuestOrderValidationResult.canPlaceOrder && (
									// Don't display the error section if the user has already placed an order (activeMainOrders is not empty)
									!Boolean(adminGuestActiveMainOrders?.[0]) && (
										<motion.div
											variants={fadeIn}
											initial="hidden"
											animate="show"
											exit="exit"
										>
											<OrderSheetErrorSection
												errorMessage={adminGuestOrderValidationResult.errorMessage}
												errorType={adminGuestOrderValidationResult.errorType}
												className='m-5'
											/>
										</motion.div>
									)
								)}
							</AnimatePresence>
							<OrderSheetOrderButton
								disabled={!adminGuestOrderValidationResult.canPlaceOrder || Boolean(holidayCalendarEvent)}
								newOrUpdatedOrder={adminGuestNewOrUpdatedOrder}
							/>

						</div>
					)}
			</>
		);
	}


	return (
		<>
			{org && (orderItemsWithStore?.length === 0 || !orderItemsWithStore) ?
				(
					<>
						<OrderSheetNoItemsSection
							hasUserOrderedToday={hasUserOrderedToday}
						/>
					</>
				) : (
					<div className='flex flex-col gap-2 lg:gap-6 pt-4 pb-[90px]'>
						<div className='overflow-y-auto max-h-[100vh] px-2 lg:px-6'>
							{orderItemsWithStore?.map((orderItemWithStore, index) => {

								const brand = brands?.find(brand => brand.id === orderItemWithStore.store?.brand_id);

								return (
									<OrderSheetOrderItemCollapsible
										key={`${orderItemWithStore.orderItem.id}-${index}`}
										orderItem={orderItemWithStore.orderItem}
										index={index}
										tax={org?.financial_details?.taxes?.[0].rate ?? 0.0825}
										subsidy={org?.budget?.amount ?? 0}
										onOrderItemRemove={removeOrderItem}
										onOrderItemChange={updateOrderItem}
										isCheckout={isCheckout ?? false}
										subHeaderText={brand?.name ?? ''}
										disabled={Boolean(activeMainOrders?.[0])}
									/>
								)
							})}
						</div>
						<OrderSheetFinancialSection
							newOrUpdatedOrder={newOrUpdatedOrder}
							org={org}
							hasUserOrderedToday={hasUserOrderedToday}
							isStipendApplied={isStipendApplied}
							setIsStipendApplied={setIsStipendApplied}
							tip={tip}
							disabled={false}
							isBudgetScheduleApplied={isBudgetScheduleApplied}
						/>
						<OrderSheetExistingOrderSection
							hasUserOrderedToday={hasUserOrderedToday}
							order={activeMainOrders?.[0]}
							onEditOrder={(order) => {
								if (!order?.id) {
									return;
								}
								updateOrderMutation.mutate({
									orderId: order.id,
									orderData: {
										...order,
										status: OrderStatus.CANCELED
									}
								})

							}} />
						<AnimatePresence>
							{!orderValidationResult.canPlaceOrder && (
								// Don't display the error section if the user has already placed an order (activeMainOrders is not empty)
								!Boolean(activeMainOrders?.[0]) && (
									<motion.div
										variants={fadeIn}
										initial="hidden"
										animate="show"
										exit="exit"
									>
										<OrderSheetErrorSection
											errorMessage={orderValidationResult.errorMessage}
											errorType={orderValidationResult.errorType}
											onMyAccountSettingsClick={onMyAccountSettingsClick}
											className='m-5'
										/>
									</motion.div>
								)
							)}
						</AnimatePresence>
						<OrderSheetOrderButton
							disabled={!orderValidationResult.canPlaceOrder || Boolean(holidayCalendarEvent)}
							newOrUpdatedOrder={newOrUpdatedOrder}
						/>

					</div>
				)}


		</>
	);
};