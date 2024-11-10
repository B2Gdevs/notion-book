'use client';

import { ArrowLeft, MenuIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { SideBar, SheetComponent, Footer, Button } from 'ui';

export default function AccountLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const [menuOpen, setMenuOpen] = useState(false);

	const categories = [
		{
			name: 'My Account',
			links: [
				{ name: 'Orders', href: `/my-account/my-orders`, active: true },
				{ name: 'Settings', href: `/my-account/my-settings` },
				// { name: "Reporting", href: `/accounts/${accountId}/reports` },
				// { name: "DEV Only - Menus", href: `/accounts/${orgCli}/integrations` },
			],
		},
	];

	return (
		<section className='bg-primary-off-white relative lg:flex'>
			<div className='text-primary-spinach-green absolute top-2 left-2 lg:hidden'>
				<SheetComponent
					open={menuOpen}
					side='left'
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
									{category.links.map((link, linkIdx) => (
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
					className='w-1/6'
					env='vangaurd'
					categories={categories}
					onLinkClick={(href) => {
						router.push(href);
					}}
					onLogoClick={() => {
						router.push('/');
					}}
				/>
			</span>

			<div className='flex-1 bg-white px-8 md:px-16 lg:px-24 overflow-y-auto pb-16 h-screen'>
				{children}
			</div>
		</section>
	);
}
