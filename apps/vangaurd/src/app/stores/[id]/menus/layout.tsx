'use client';


import {
	OrderStatus,
	useGetCurrentColorfullUser,
	useUserIdOrdersForDateRange
} from 'ui';
import { useRouter } from 'next/navigation';
import FloatingButtonGroup from '../../../components/floating-admin-navigation';
import { Header } from '../../../components/header';
import { OrgMenuFooterHolder } from '../../../components/org-menu-footer-holder';
import { RestuarantScheduleDisplay } from '../../../components/restuarant-shedule-display';
import { GlobalState, useGlobalStore } from '../../../../stores/globalStore';

export default function MenusLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const { data: user } = useGetCurrentColorfullUser();
	const globalStore = useGlobalStore() as GlobalState;
	const isAdminGuestAccount = globalStore.isAdminGuestAccount;
	let idToPass = user?.id;
	if (isAdminGuestAccount) {
		idToPass = user?.id + '_guest';
	}
	const { orders } = useUserIdOrdersForDateRange(idToPass, new Date(), 6);
	const activeDates = new Set(
		orders
			.filter(order => order.status === OrderStatus.NEW_ORDER && order.fulfillment_info?.delivery_time !== undefined)
			.map(order => {
				// Since we've filtered out undefined delivery_time, we can safely assert it's not undefined here
				const deliveryTime = order.fulfillment_info!.delivery_time!;
				return new Date(deliveryTime).toDateString();
			})
	);

	return (
		<section className='bg-primary-off-white flex-col'>
			<FloatingButtonGroup />
			<div className='z-50 sticky top-0 bg-primary-off-white'>
				<Header
					onLogoClick={() => {
						router.push('/');
					}}
					isOrgMenu={true}
				/>
                <div className='border-b border-primary-almost-black opacity-50' />
			</div>
			<RestuarantScheduleDisplay 
				activeDates={activeDates}
			/>
			<div className='border-b border-[#425F57]' />
			{children}

			{/* mobile footer w/ cart total */}
			<span className='block lg:hidden'>
				<OrgMenuFooterHolder
				/>
			</span>
		</section>
	);
}
