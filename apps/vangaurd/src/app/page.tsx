'use client';

import {
	Area,
	DeliveryWindow,
	GuestSignInLayout,
	LoweredDayOfWeek,
	OrderStatus,
	Store,
	useGetArea,
	useGetAreas,
	useGetBrandsByIds,
	useGetCurrentColorfullUser,
	useGetCurrentUserColorfullOrg,
	useGetDeliveryWindowById,
	useGetStoresByIds,
	useUserIdOrdersForDateRange
} from 'ui';

import { GlobalState, useGlobalStore } from '../stores/globalStore';
import { getStoresAndBrandsByDay as getStoreIdsByDay } from './scheduleUtils';

import { useSession } from '@clerk/nextjs';
import Hotjar from '@hotjar/browser';
import { parseISO, startOfDay } from 'date-fns';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useIntercom } from 'react-use-intercom';
import AppPage from './components/app-page';

// Hotjar id 3914008 is for Vangaurd DEV
const siteId = (process.env.NEXT_PUBLIC_HOTJAR_ID || 3914008) as number;
const hotjarVersion = 6;

Hotjar.init(siteId, hotjarVersion);

export default function Page() {
	const { session } = useSession();
	const { data: userOrg } = useGetCurrentUserColorfullOrg();
	const { data: area } = useGetArea(userOrg?.locations?.[0]?.area_id ?? '');
	const { data: orgDeliveryWindow } = useGetDeliveryWindowById(userOrg?.delivery_window_id ?? '');
	const router = useRouter()

	const selectedDate = useGlobalStore(
		(state: GlobalState) => state.selectedDate,
	);
	const currentPageNum = 1;
	const pageSize = 100;

	const { data: user } = useGetCurrentColorfullUser();
	const globalStore = useGlobalStore() as GlobalState;
	const isAdminGuestAccount = globalStore.isAdminGuestAccount;
	let idToPass = user?.id;
	if (isAdminGuestAccount) {
		idToPass = user?.id + '_guest';
	}
	const { orders } = useUserIdOrdersForDateRange(idToPass, new Date(), 6);

	const selectedDateStartOfDay = startOfDay(selectedDate);
	const mainOrders = orders?.filter(order => !order.is_sub_order) ?? [];
	const selectedOrder = mainOrders.find(order => {
		const orderDeliveryTime = startOfDay(parseISO(order?.fulfillment_info?.delivery_time ?? new Date().toISOString()));
		return orderDeliveryTime.getTime() === selectedDateStartOfDay.getTime();
	});

	const activeDates = new Set(
		orders
			.filter(order => order.status === OrderStatus.NEW_ORDER && order.fulfillment_info?.delivery_time !== undefined)
			.map(order => {
				const deliveryTime = order.fulfillment_info!.delivery_time!;
				return new Date(deliveryTime).toDateString();
			})
	);

	const onViewMenuClick = (storeId: string) => {
		router.push(`/stores/${storeId}/menus`);
	};

	const { data: areas } = useGetAreas(currentPageNum, pageSize);
	// Filter areas so only the area that matches orgDeliveryWindow.area_id is returned
	const matchingArea = areas?.find(area => area.id === orgDeliveryWindow?.area_id);
	// Ensure Argument of type '(Area | undefined)[]' is assignable to parameter of type 'Area[]'.
	const areaToPass = matchingArea ? [matchingArea] : [] as Area[];
	const days: LoweredDayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
	const selectedDayIndex = selectedDate?.getDay() ?? 1;
	const selectedDay = days[selectedDayIndex];

	const { storeIds } = getStoreIdsByDay(areaToPass ?? [], selectedDay);
	const { data: stores } = useGetStoresByIds(storeIds ?? []);

	// get max priority group in a variable from the stores
	const maxPriorityGroup = Math.max(...(stores?.map(store => store?.priority_group ?? 3) ?? [3]));

	// Sort stores by priority group in ascending order (1 is the most important and appears first)
	const sortedStores = [...(stores ?? [])].sort((a, b) => {
		const priorityA = a?.priority_group ?? maxPriorityGroup;
		const priorityB = b?.priority_group ?? maxPriorityGroup;
		return priorityA - priorityB;
	});
	const brandIds = React.useMemo(() => {
		return (stores?.flatMap(store => store?.brand_id).filter(brandId => brandId) || []) as string[];
	}, [stores]);
	const { data: brands } = useGetBrandsByIds(brandIds ?? []);

	const sortedStoresFiltered = sortedStores.filter((store): store is Store => store !== undefined);

	const { boot } = useIntercom();
	React.useEffect(() => {
		boot({
			alignment: 'right'
		});
	}, [boot]);

	const isOrderActive = (orderStatus?: OrderStatus): boolean => {
		if (!orderStatus) {
			return false;
		}

		return ![OrderStatus.CANCELED, OrderStatus.PARTIALLY_CANCELED].includes(orderStatus);
	};

	if (session?.user) {
		return <AppPage
			sortedStores={sortedStoresFiltered}
			brands={brands ?? []}
			onViewMenuClick={onViewMenuClick}
			userArea={area ?? {} as Area}
			selectedDate={selectedDate}
			activeDates={activeDates}
			selectedOrder={isOrderActive(selectedOrder?.status) ? selectedOrder : undefined}
			deliveryWindow={orgDeliveryWindow ?? {} as DeliveryWindow}
		/>
	}

	return (
		<GuestSignInLayout />
	);
}