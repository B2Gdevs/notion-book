'use client';

import { ArrowLeft, MenuIcon } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button, Footer, OrgType, SheetComponent, SideBar, useGetOrgsByQuery } from 'ui';

export default function AccountLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const params = useParams();
	const router = useRouter();
	const orgClerkId = params.id as string;
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const { data: orgData } = useGetOrgsByQuery({
		externalId: orgClerkId,
	});


	const standaloneLinks = [
		{ name: 'Admin Settings', href: `/accounts/${orgClerkId}/admin` },
		{ name: 'Users', href: `/accounts/${orgClerkId}/users` },
	];

	if (orgData?.[0].org_type === OrgType.RECIPIENT) {
		let budgetRoute = { name: 'Budgets', href: `/accounts/${orgClerkId}/budgets` }
		let recipientMetricsRoute = { name: 'Metrics', href: `/accounts/${orgClerkId}/corporation-metrics` }
		let invoicesRoute = { name: 'Invoices', href: `/accounts/${orgClerkId}/invoices` }
		let currentOrdersRoute = { name: 'Current Orders', href: `/accounts/${orgClerkId}/current-orders` }
		standaloneLinks.push(budgetRoute);
		standaloneLinks.push(recipientMetricsRoute);
		standaloneLinks.push(invoicesRoute);
		standaloneLinks.push(currentOrdersRoute);
	} else {
		let restaurantMetricsRoute = { name: 'Metrics', href: `/accounts/${orgClerkId}/restaurant-metrics` }
		let restaurantOrdersForecast = { name: 'Orders Forecast', href: `/accounts/${orgClerkId}/orders-forecast` }
		standaloneLinks.push(restaurantMetricsRoute);
		standaloneLinks.push(restaurantOrdersForecast);
	}

	const categories = [
		{
			name: 'Admin',
			links: [],
		},
	];


	return (
		<section className='bg-primary-off-white relative flex flex-col lg:flex-row'>
			<div className='text-primary-spinach-green absolute top-2 left-2 lg:hidden'>
				<SheetComponent
					side='left'
					open={menuOpen}
					onOpenChange={(open) => setMenuOpen(open)}
					triggerContent={
						<div className='items-center justify-center flex'>
							<MenuIcon size={24} onClick={() => setMenuOpen(!menuOpen)} />
						</div>
					}
					sheetContent={
						<div>
							<img
								src='https://res.cloudinary.com/dzmqies6h/image/upload/v1697226403/branding/Logo_256_eqmgsw.svg'
								alt='Colorfull icon'
								className='w-16 h-16'
								onClick={() => router.push('/')}
							/>
							{categories.map((category, idx) => (
								<div className='mb-5 font-righteous flex flex-col justify-start items-start gap-2' key={`${category.name}-${idx}`}>
									<span className='text-xl'>{category.name}</span>
									{standaloneLinks.map((link, linkIdx) => (
										<a key={`${link.name}-${linkIdx}`} href={link.href} onClick={() => router.push(link.href)}>
											{link.name}
										</a>
									))}
									<span className='font-sans absolute bottom-4 text-gray-600 left-1/2 transform -translate-x-1/2 text-center'>
										<Button
											variant="default"
											onClick={() => router.push('/')}
											className='w-fit py-2 px-4 rounded-lg flex justify-start items-center gap-2 transition-colors bg-primary-lime-green duration-300 text-primary-spinach-green font-righteous hover:text-secondary-peach-orange'
										>
											<ArrowLeft size={22} /> <span className='pr-1 min-w-[90px]'>Back to Restaurants</span>
										</Button>
										<Footer isInSidebar={true} />
									</span>
								</div>
							))}
						</div>
					}
					className='bg-primary-off-white p-4'
				/>
			</div>
			<span className='hidden lg:block'>
				<SideBar
					className={`min-h-screen ${isSidebarCollapsed ? 'w-0' : 'w-1/6'}`}
					env='vangaurd'
					categories={categories}
					standaloneLinks={standaloneLinks}
					onLinkClick={(href) => {
						router.push(href);
					}}
					onLogoClick={() => {
						router.push('/');
					}}
					onCollapseToggle={(collapsed: boolean) => {
						setIsSidebarCollapsed(!collapsed);
					}}
				/>
			</span>

			<div className='bg-white px-8 md:px-16 lg:px-24 overflow-y-auto pb-16 w-full h-screen'>
				{children}
			</div>
		</section>
	)
}