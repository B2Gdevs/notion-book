'use client';

import {
	Area,
	useGetArea,
	useGetCurrentUserColorfullOrg,
	useGetDeliveryWindowById,
} from 'ui';
import { GlobalState, useGlobalStore } from '../../../../stores/globalStore';
import StoreIdMenuPage from '../../../components/store-id-menu-page';

export default function StoreMenu() {

	const { data: userOrg } = useGetCurrentUserColorfullOrg();
	const { data: area } = useGetArea(userOrg?.locations?.[0]?.area_id ?? '');
	const selectedDate = useGlobalStore(
		(state: GlobalState) => state.selectedDate,
	);
	const { data: orgDeliveryWindow } = useGetDeliveryWindowById(userOrg?.delivery_window_id ?? '');
	

	const isOrgActive = userOrg?.is_active ?? false; // Add null check, default to false;
	
	return (
		<StoreIdMenuPage
			userArea={area ?? {} as Area}
			selectedDate={selectedDate}
			isOrgActive={isOrgActive}
			deliveryWindow={orgDeliveryWindow}
		/>
	);
}
