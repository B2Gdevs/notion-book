'use client';

import { UserButton, useSession } from '@clerk/nextjs';
import { Clock11 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { SheetComponent, SideBar, ThemeSelect, TitleComponent, cn, useGetAreas, useGetOrg, useGetUsers } from 'ui';
import { AlgoliaSearch } from './algolia-search';
import { Clock } from './clock';

interface SidebarWrapperProps {
	children: React.ReactNode;
	className?: string;
	isCourierView?: boolean;
	isPartnerView?: boolean;
	isColorfullUser?: boolean; // Add this prop
	toggleView?: (view: 'courier' | 'partner') => void; // Make toggleView optional
}

const categories = [
	{
		name: 'Admin',
		links: [
			{ name: 'Orgs', href: `/orgs` },
			{ name: 'Org Groups', href: `/orggroups` },
			{ name: 'Stores', href: `/stores` },
			{ name: 'Areas', href: `/areas` },
			{ name: 'Brands', href: `/brands` },
			{ name: 'Couriers', href: `/couriers` },
			{ name: 'Users', href: `/users` },
			{ name: 'Orders', href: `/orders` },
			{ name: 'OrderItems', href: `/order-items` },
			{ name: 'ItemClassifications', href: `/item-classifications` },
			{ name: 'Current Orders', href: `/current-orders` },
			{ name: 'Shares', href: `/shares` },
			{ name: 'DeliveryWindows', href: `/delivery-windows` },
			{ name: 'Calendar', href: `/calendar` },
		],
	},
	{
		name: 'Financials',
		links: [
			// { name: 'Dashboard', href: `/dashboard` },
			{ name: 'Order Totals', href: `/order-totals` },
			{ name: 'Job Totals', href: `/job-totals` },
		],
	},
	{
		name: 'The Business',
		links: [
			{ name: 'Lifecycle', href: `/lifecycle` },
			{ name: 'Jobs', href: `/jobs` },
			{ name: 'Invoicing', href: `/invoicing` },
			{ name: 'Automations', href: `/automations` },
		],
	},
	{
		name: '🔥ENG ☠️',
		links: [
			{ name: 'Integrations', href: `/integrations` },
			{ name: 'Chat', href: `/chat` },
		]
	}
];

export function SidebarWrapper({ children, className, isCourierView, isPartnerView, isColorfullUser, toggleView }: SidebarWrapperProps) {
	const router = useRouter();
	const session = useSession();
	const userEmail = session.session?.user.primaryEmailAddress?.emailAddress
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const { data: areas } = useGetAreas()
	const { data: users } = useGetUsers({
		email: userEmail ?? ''
	})

	const user = users?.[0]

	const { data: org } = useGetOrg(user?.org_id ?? '')

	const orgAreaId = org?.locations?.[0]?.area_id
	// find the area given the location area_id from the array of areas
	const currentUserOrgTimezone = areas?.find(area => area.id === orgAreaId)?.timezone

	const renderCourierViewButton = () => {
		return (
			<div className='bg-secondary-pink-salmon text-xs md:text-sm rounded-full p-2'>
				<button onClick={() => {
					toggleView && toggleView('courier');
				}}>{isCourierView ? 'CF' : 'Courier'}</button>
			</div>
		);
	};

	const renderPartnerViewButton = () => {
		return (
			<div className='bg-secondary-peach-orange text-xs md:text-sm rounded-full p-2'>
				<button onClick={() => {
					toggleView && toggleView('partner');
				}}>{isPartnerView ? 'CF' : 'Partner'}</button>
			</div>
		);
	};

	if (isCourierView) {
		return (
			<section className={cn('relative bg-primary-off-white flex', className)}>
				<div className='fixed top-3 right-3 z-50'>
					<UserButton />
				</div>
				<div className='fixed top-3 left-3 z-50'>
					{isColorfullUser && renderCourierViewButton()}
				</div>

				<div className='flex-1 bg-white'>
					{children}
				</div>
			</section>
		);
	}

	if (isPartnerView) {
		return (
			<section className={cn('relative bg-primary-off-white flex', className)}>
				<div className='fixed top-3 right-3 z-50'>
					<UserButton />
				</div>
				<div className='fixed top-3 left-6 z-50'>
					{isColorfullUser && renderPartnerViewButton()}
				</div>

				<div className='flex-1 bg-white'>
					{children}
				</div>
			</section>
		);
	}

	return (
		<section className={cn('bg-primary-off-white flex', className)}>
			<AlgoliaSearch />
			<div className='flex flex-col'>
				<div className='flex m-5 justify-center items-center space-x-4'>
					<ThemeSelect />
					<UserButton />
					{isColorfullUser && renderCourierViewButton()}
					{isColorfullUser && renderPartnerViewButton()}
				</div>
				<SideBar
					env='bastion'
					categories={categories}
					onLinkClick={(href) => {
						router.push(href);
					}}
					onLogoClick={() => {
						router.push('/');
					}}
				/>
			</div>

			<div className='flex-1 bg-white'>
				{children}
			</div>
			<SheetComponent
				side='right'
				open={isSidebarOpen}
				onOpenChange={(open) => setIsSidebarOpen(open)}
				triggerContent={
					<div className='cursor-pointer bg-black rounded-lg p-0 justify-center text-white items-center absolute right-0 top-0 transform translate-y-1/2'>
						<Clock11 size={24} onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
					</div>
				}
				sheetContent={
					<div className=' bg-primary-almost-black h-screen border-l-2'>
						<div className='flex-col justify-center p-2 mx-4'>
							<Clock
								className='mt-4 text-white mb-10'
								timezone={currentUserOrgTimezone ?? 'GMT'}
								leftTitle='User Timezone'
								centerTitleClassName='text-black'
								centerTitle={`user: ${user?.first_name ?? 'N/A'} ${user?.last_name ?? 'N/A'}`}
								rightTitleClassName='text-xs text-black'
								rightTitle={`org: ${org?.name ?? 'N/A'}`}
							/>
							{(areas?.length ?? 0) > 0 && areas?.map((area) => (
								<TitleComponent
									key={area?.id}
									leftTitle='Area'
									leftTitleClassName='text-xs left-0 transform '
									rightTitle={area?.id}
									rightTitleClassName='text-xs right-0 transform '>
									<Clock leftTitle='austin'
										rightTitle={area?.is_active ? "Serving" : "Not Serving"}
										className='mt-4' timezone={area?.timezone ?? 'GMT'} />
								</TitleComponent>
							))}
						</div>
					</div>
				}
				className='bg-white'
			/>
		</section>
	);
}
