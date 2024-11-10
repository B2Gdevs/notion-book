'use client';

import { isEqual } from 'date-fns';
import { BuildingIcon, HomeIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { FC } from 'react';
import {
	DeliveryWindow,
	Item,
	Share,
	User,
	useFirstAdminOrg, useGetCurrentColorfullUser, useGetDeliveryWindowById, useGetOrg, useMenuDataFromStoreId
} from 'ui';
import { GlobalState, useGlobalStore } from '../../stores/globalStore';
import OrderItemDialogComponent from '../stores/[id]/menus/order-item-dialog';
import { CustomUserButton } from './custom-user-button';
import { GuestUserButton } from './guest-user-button';
import { NavHeader } from './navheader';
import CorpAdminCompanyAcctDropdown from './corp-admin-company-account-dropdown';
import { utcToZonedTime } from 'date-fns-tz';

type HeaderProps = {
	onLogoClick?: () => void;
	isOrgMenu?: boolean;
	isGuestLimitedView?: boolean;
	share?: Share;
	guestUser?: User;
};

export const Header: FC<HeaderProps> = ({
	onLogoClick,
	isOrgMenu,
	isGuestLimitedView,
	share,
	guestUser,
}) => {
	const globalStore = useGlobalStore() as GlobalState;

	let {
		items,
		photos,
		modifierGroups,
	} = useMenuDataFromStoreId(globalStore?.selectedOrderItem?.store_id ?? '');


	const { data: user } = useGetCurrentColorfullUser()

	const firstOrgAdminOf = useFirstAdminOrg();

	const isOrgAdmin = !!firstOrgAdminOf;

	const adminGuestId = isOrgAdmin ? user?.id + '_guest' : '';

	const router = useRouter();
	const params = useParams();
	const shareId = params.shareId as string;
	const setDate = useGlobalStore((state: GlobalState) => state.setDate);

	const handleDateChange = (date: Date) => {
		if (!isEqual(date, globalStore?.selectedDate)) {
			router.push('/');
		}
	};

	const handleMyAccountSettingsClick = () => {
		router.push('/my-account/my-settings');
	}


	const handleOpenSheet = () => {
		globalStore.setIsOrderItemDialogOpen(false);
		globalStore.setIsSheetOpen(true);
	}

	const routes = [
		{ path: `${isGuestLimitedView ? `/shares/${shareId}` : '/'}`, label: 'Restaurants', boldName: '', icon: <HomeIcon /> },

		...(firstOrgAdminOf
			? [
				{
					path: `/accounts/${firstOrgAdminOf}/admin`,
					label: 'Company Account',
					boldName: '',
					icon: <BuildingIcon />,
				},
			]
			: []),
	];

	const menuItemId = globalStore?.selectedOrderItem?.menu_item_id;
	const menuItem = menuItemId ? items[menuItemId] : undefined;
	const itemPhotos = menuItem?.photo_ids?.map(
		(photoId) => photos[photoId],
	);

	const handleDialogClose = () => {
		globalStore.setIsOrderItemDialogOpen(false);
		if (globalStore.wasSheetOpen) {
			globalStore.setIsSheetOpen(true);
			globalStore.setWasSheetOpen(false);
		}
	}

	const { data: org } = useGetOrg(user?.org_id ?? '');
	const { data: guestDeliveryWindow } = useGetDeliveryWindowById(share?.delivery_window_id ?? '');
	const { data: orgDeliveryWindow } = useGetDeliveryWindowById(org?.delivery_window_id ?? '');

	const timeZone = guestDeliveryWindow?.timezone ?? 'UTC';
	const shareDateToPass = utcToZonedTime(share?.date ?? new Date(), timeZone);

	return (
		<div className='flex w-full z-50 sticky top-0 bg-primary-off-white'>
			<NavHeader
				startItems={routes?.map((route) => {
					if (route.label === 'Company Account') {
						return (
							<div className='relative'>
								<CorpAdminCompanyAcctDropdown />
							</div>
						)
					}
					return (
						<Link href={route.path} key={route.path}>
							<div className="text-primary-spinach-green text-sm sm:text-base md:text-lg xl:text-xl font-righteous hover:text-secondary-peach-orange p-4 lg:p-0">
								<div className='flex'>{route.label}</div>
							</div>
						</Link>
					)
				}
				)}
				endItems={!isGuestLimitedView ? [<CustomUserButton key={'custom_user_button'} />] : [<GuestUserButton key="guest_user_button" share={share ?? {} as Share} />]}
				onLogoClick={onLogoClick}
				isOrgMenu={isOrgMenu}
				selectedDate={globalStore?.selectedDate}
				dateSetter={setDate}
				onDateChange={handleDateChange}
				onMyAccountSettingsClick={handleMyAccountSettingsClick}
				onBagClick={handleOpenSheet}
				isOrgAdmin={isOrgAdmin}
				isGuestLimitedView={isGuestLimitedView}
				guestLimitedDate={shareDateToPass}
				share={share}
				guestUser={guestUser}
				adminGuestId={adminGuestId}
			/>
			{(guestDeliveryWindow || orgDeliveryWindow) ? (
				<OrderItemDialogComponent
					existingOrderItem={globalStore?.selectedOrderItem}
					isDialogOpen={globalStore.isOrderItemDialogOpen}
					onDialogClose={handleDialogClose}
					selectedItem={menuItem ?? {} as Item}
					selectedItemPhotos={itemPhotos ?? []}
					orgId={org?.id ?? ''}
					modifierGroups={modifierGroups}
					photos={photos}
					items={items}
					storeId={globalStore?.selectedOrderItem?.store_id ?? ''}
					onClose={handleDialogClose}
					deliveryWindow={guestDeliveryWindow ?? orgDeliveryWindow ?? {} as DeliveryWindow}
				/>
			) : null}

		</div>
	);
};

