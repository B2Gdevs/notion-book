'use client';

import { useSession } from '@clerk/nextjs';
import { CheckCircle2Icon, MenuIcon, X } from 'lucide-react';
import { useFeatureFlagEnabled } from 'posthog-js/react';
import React, { useEffect, useState } from 'react';
import {
	BagIcon,
	Button,
	ColorfullIcon,
	ColorfullLogo,
	ContactForm,
	CubeLoader,
	Dialog,
	DialogContent,
	GuestInviteForm,
	LeftArrowIcon,
	RestaurantScheduleList,
	Share,
	SheetComponent,
	SheetHeader,
	SheetPrimitive,
	SheetTitle,
	SpeechBubble,
	SpokeSpinner,
	Switch,
	User,
	UserForm,
	toast,
	useCreateUser,
	useCurrentColorfullUserOrdersForSelectedDate,
	useCurrentGuestUserOrdersForSelectedDate,
	useGetAdminGuestUserOrderItemsById,
	useGetCurrentColorfullUser,
	useGetCurrentUserCartOrderItemsByDateNotUsingCalendarCart,
	useGetGuestUserOrderItemsByShareGuestId,
	Progress,
	useGetDeliveryWindowById,
} from 'ui';
import { GlobalState, useGlobalStore } from '../../stores/globalStore';
import { OrderSheet } from './order-sheet';
import { utcToZonedTime } from 'date-fns-tz';

interface NavHeaderProps {
	startItems: React.ReactNode[];
	endItems: React.ReactNode[];
	onBagClick?: () => void;
	onLogoClick?: () => void;
	isOrgMenu?: boolean;
	selectedDate: Date;
	dateSetter?: (date: Date) => void;
	onDateChange?: (date: Date) => void;
	onMyAccountSettingsClick?: () => void;
	isOrgAdmin?: boolean;
	isGuestLimitedView?: boolean;
	guestLimitedDate?: Date;
	share?: Share;
	guestUser?: User;
	adminGuestId?: string;
}

export const NavHeader: React.FC<NavHeaderProps> = ({
	startItems,
	endItems,
	onBagClick,
	onLogoClick,
	isOrgMenu,
	selectedDate,
	dateSetter,
	onDateChange,
	onMyAccountSettingsClick,
	isOrgAdmin,
	isGuestLimitedView,
	guestLimitedDate,
	share,
	guestUser,
	adminGuestId,
}) => {
	const inviteGuestsFeatureEnabled = useFeatureFlagEnabled('invite_guests');

	const globalStore = useGlobalStore() as GlobalState;
	const isAdminGuestAccount = globalStore.isAdminGuestAccount;
	
	const { data: user } = useGetCurrentColorfullUser();

	const handleAdminGuestAccountToggle = () => {
		globalStore.setIsAdminGuestAccount(!isAdminGuestAccount);
	};

	const [menuOpen, setMenuOpen] = useState(false);
	const [isContactFormOpen, setContactFormOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isGuestInviteFormOpen, setGuestInviteFormOpen] = useState(false);
	const guestLimitedDateObj = guestLimitedDate ? new Date(guestLimitedDate) : undefined;
	const [progress, setProgress] = useState(0);

	const createUserMutation = useCreateUser({
		onSuccess: () => {
			toast({
				title: 'User Created',
				description: 'User has been created successfully',
				duration: 5000,
			})
		},
		onError: () => {
			toast({
				title: 'Failed to create user',
				description: 'Please try again later',
				variant: 'destructive',
				duration: 5000,
			})
		},
	});

	useEffect(() => {
		const loadData = async () => {
			try {
				// Simulate fetching data with progress
				const timeoutDuration = 2500;
				const interval = 50; // Update progress every 50ms
				let elapsed = 0;

				const intervalId = setInterval(() => {
					elapsed += interval;
					setProgress((elapsed / timeoutDuration) * 100);
					if (elapsed >= timeoutDuration) {
						clearInterval(intervalId);
						setIsLoading(false); // Set loading to false once data is fetched
					}
				}, interval);

				await new Promise(resolve => setTimeout(resolve, timeoutDuration)); // Simulate a network request
			} catch (error) {
				console.error('Failed to load data:', error);
				setIsLoading(false);
			}
		};

		loadData();
	}, []);

	const handleOpenContactForm = () => {
		setContactFormOpen(true);
	};

	const handleCloseContactForm = () => {
		setContactFormOpen(false);
	};

	const handleUserFormSubmit = (userData: User) => {
		if (userData) {
			createUserMutation.mutate({ user: userData });
		}
	};

	const handleOpenGuestInviteForm = () => {
		setGuestInviteFormOpen(true);
	}

	const handleCloseGuestInviteForm = () => {
		setGuestInviteFormOpen(false);
	}

	// --- Admin Guest Handling ---

	const { userCartOrderItems: adminGuestItems } = useGetAdminGuestUserOrderItemsById(adminGuestId ?? '', selectedDate);
	const { activeMainOrders: adminGuestActiveMainOrders,
		isLoading: isLoadingAdmingGuestOrders } = useCurrentColorfullUserOrdersForSelectedDate(selectedDate, isAdminGuestAccount, !isAdminGuestAccount);

	// ---  End Admin Guest Handling ---

	const { userCartOrderItems: items } = useGetCurrentUserCartOrderItemsByDateNotUsingCalendarCart(selectedDate);
	const guestId = guestUser?.id;

    const { data: deliveryWindow } = useGetDeliveryWindowById(share?.delivery_window_id ?? '');
    const timeZone = deliveryWindow?.timezone ?? 'UTC';
    const shareDateToPass = utcToZonedTime(share?.date ?? new Date(), timeZone);
	const { userCartOrderItems: guestItems } = useGetGuestUserOrderItemsByShareGuestId(guestId ?? '');

	const { activeMainOrders } = useCurrentColorfullUserOrdersForSelectedDate(selectedDate);
	const { guestActiveMainOrders } = useCurrentGuestUserOrdersForSelectedDate(shareDateToPass, guestUser ?? {} as User);

	const session = useSession();
	const userEmail = session.session?.user.primaryEmailAddress?.emailAddress;
	const userPhone = session.session?.user.phoneNumbers[0]?.phoneNumber;
	const userClerkId = session.session?.user.id;
	const isUserUndefined = (user === undefined);
	const isGuest = isGuestLimitedView;

	// Extracted boolean variables
	const hasGuestItems = isGuestLimitedView && (guestItems?.length ?? 0) > 0;
	const hasAdminGuestItems = isAdminGuestAccount && (adminGuestItems?.length ?? 0) > 0;
	const hasItems = (items?.length ?? 0) > 0;

	const hasGuestActiveMainOrders = Boolean(guestActiveMainOrders?.[0]);
	const hasAdminGuestActiveMainOrders = Boolean(adminGuestActiveMainOrders?.[0]);
	const hasActiveMainOrders = Boolean(activeMainOrders?.[0]);

	return (
		<div className='h-[70px] mx-auto w-full max-w-7xl sm:container sm:px-2 px-1'>
			{/* Loading Placeholder */}
			{isLoading ? (
				<div className="fixed inset-0 flex flex-col space-y-10 justify-center items-center bg-primary-almost-black opacity-50 z-999">
					<ColorfullLogo className="w-1/2" />
					<div className='flex space-x-4'>
						<CubeLoader />
						<div className="text-lg italic font-sans tracking-wide text-gray-400 mt-1">
							<span className="text-sm">Loading...</span>
						</div>
					</div>
					<Progress value={progress} className="w-1/2 mt-10" />
				</div>
			) : (
				<>
					{/* User Form */}
					{(isUserUndefined && !isGuestLimitedView) && (
						<div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
							<div className="bg-white p-4 rounded-lg shadow max-w-3/4 mx-auto">
								<UserForm
									isInVangaurd={true}
									initialData={
										{
											id: '',
											clerk_id: userClerkId,
											name: '',
											cart: [],
											email: userEmail || '',
											phone: userPhone || '',
											org_id: '',
											work_address: '',
											stripe_account_id: '',
											first_name: '',
											last_name: '',
										} as User
									}
									onSubmit={handleUserFormSubmit}
									className="bg-white p-4 rounded-lg shadow"
									isUserWithoutOrg={true}
									excludeFields={['work_address_select']}
									disableFields={['email']}
								/>
							</div>
						</div>
					)}
					<div className='h-full flex w-full max-w-full bg-primary-off-white items-center justify-between py-4 '>
						<div className='text-primary-spinach-green pl-2 lg:hidden'>
							{isOrgMenu ? (
								<span className='flex justify-center items-center gap-2'>
									<div className='flex justify-start items-center gap-1'>
										<LeftArrowIcon
											onClick={onLogoClick}
										/>
									</div>
									<Button className={`lg:hidden font-righteous w-fit px-2 mr-1 lg:mr-0 ${isGuestLimitedView ? 'opacity-0' : ''}`}
										onClick={handleOpenContactForm}>
										Contact
									</Button>
								</span>

							) : (
								<span className='flex justify-center items-center gap-2'>
									<SheetComponent
										side='left'
										open={menuOpen}
										onOpenChange={(open) => setMenuOpen(open)}
										triggerContent={
											<div className='items-center justify-center flex flex-col'>
												<MenuIcon size={32} onClick={() => {
													setMenuOpen(!menuOpen)
												}} />
											</div>
										}
										sheetContent={[startItems.map((item, idx) => (
											<div className='flex justify-start items-center gap-4' key={`${item}-${idx}`}>
												{item}
											</div>
										)),
										<div
											key='contact-us'
											className='text-xs lg:hidden absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center cursor-pointer text-primary-spinach-green underline'
											onClick={handleOpenContactForm}
										>
											Contact us at help@colorfull.ai
										</div>
										]}
										className='bg-primary-off-white p-4'
									/>
									{/* Mobile View Invite Guests Button */}
									{isOrgAdmin && inviteGuestsFeatureEnabled ? (<Button className='font-righteous bg-transparent text-primary-spinach-green border-2 border-primary-spinach-green hover:bg-primary-cucumber-green hover:text-primary-off-white hover:border-primary-spinach-green-lighter flex flex-col justify-center items-center lg:hidden text-xs w-fit px-1'
										onClick={handleOpenGuestInviteForm}>
										<span>Invite</span>
										<span>Guests</span>
									</Button>) : (
										<Button className='hidden'>Invisible placeholder</Button>
									)}
									<Button className={`lg:hidden font-righteous text-xs w-fit px-1 lg:mr-0 ${isGuestLimitedView ? 'opacity-0' : ''}`}
										onClick={handleOpenContactForm}>
										Contact
									</Button>
								</span>

							)}
						</div>

						<div className='hidden lg:flex flex justify-start items-center gap-4'>{startItems}</div>

						<div className='absolute left-1/2 transform -translate-x-1/2 w-fit lg:w-64 '>
							<ColorfullLogo className='hidden md:block' onClick={onLogoClick} />
							<ColorfullIcon variant='secondary' className='block md:hidden' />
						</div>


						{/* End Items */}
						<div className='flex items-center justify-center align-center lg:space-x-4 lg:pr-0'>

							{/* Invite Guests Button */}
							{isOrgAdmin && inviteGuestsFeatureEnabled && <Button className='font-righteous bg-transparent text-primary-spinach-green border-2 border-primary-spinach-green hover:bg-primary-cucumber-green hover:text-primary-off-white hover:border-primary-spinach-green-lighter hidden md:block'
								onClick={handleOpenGuestInviteForm}>
								Invite Guests
							</Button>}

							{isOrgAdmin && (
								<div className='flex flex-col lg:flex-row justify-center items-center lg:gap-2'>
									<span className='font-righteous flex flex-col lg:flex-row justify-center items-center text-xs lg:text-base lg:gap-1'>
										Admin <span className='hidden lg:block'>Budget</span> <span className='hidden lg:block'>: {isAdminGuestAccount ? 'On' : 'Off'}
										</span>
									</span>
									<Switch
										className='cursor-pointer mr-1 lg:my-2 lg:mr-0'
										checkedRootColor="bg-secondary-peach-orange-lightest"
										checkedThumbColor="bg-secondary-peach-orange"
										checked={isAdminGuestAccount}
										onClick={handleAdminGuestAccountToggle}
									/>
								</div>

							)}
							<Button className={`hidden font-righteous w-fit px-2 mr-1 lg:mr-0 ${isGuestLimitedView ? 'opacity-0' : 'lg:block'}`}
								onClick={handleOpenContactForm}>
								Contact
							</Button>

							{/* Guest Invite Form Dialog */}
							<Dialog open={isGuestInviteFormOpen} onOpenChange={handleCloseGuestInviteForm} >
								<DialogContent className="bg-transparent overflow-y-auto max-h-[100vh] w-full border-none shadow-none">
									<div className="bg-transparent dark:bg-black">
										<GuestInviteForm
											selectedDate={selectedDate}
											onClose={handleCloseGuestInviteForm}
										/>
									</div>
								</DialogContent>
							</Dialog>
							{/* Contact Form Dialog */}
							<Dialog open={isContactFormOpen} onOpenChange={handleCloseContactForm} >
								<DialogContent className="bg-transparent overflow-y-auto max-h-[100vh] w-full border-none shadow-none">
									<div className="bg-transparent dark:bg-black">
										<ContactForm
											handleCloseContactForm={handleCloseContactForm}
										/>
									</div>
								</DialogContent>
							</Dialog>

							{/* BagIcon */}
							<div className='relative w-9 h-9 flex items-center justify-center'>
								<SheetComponent
									side='right'
									onOpenChange={(open) => globalStore.setIsSheetOpen(open)}
									open={globalStore.isSheetOpen}
									triggerContent={
										<div className='relative items-center justify-center flex hover:text-red hover:cursor-pointer group'>
											<BagIcon onClick={onBagClick} className='group-hover:text-secondary-peach-orange text-primary-spinach-green' />
											{isAdminGuestAccount ? (
												hasAdminGuestActiveMainOrders ? (
													<CheckCircle2Icon id='chk_1' className='absolute left-1/2 transform -translate-x-1/2 -translate-y-1 w-3 h-3 mt-4 group-hover:text-secondary-peach-orange' />
												) : (
													<span id='length_1' className='absolute text-lg text-secondary-peach-orange mt-2 cursor-pointer font-righteous'>
														{isLoadingAdmingGuestOrders ? (
															<SpokeSpinner size='xs' />
														) : (
															adminGuestItems?.length
														)}
													</span>
												)
											) : (
												<>
													{isGuest ? (
														hasGuestActiveMainOrders ? (
															<CheckCircle2Icon className='absolute  left-1/2 transform -translate-x-1/2 -translate-y-1 w-3 h-3 mt-4 group-hover:text-secondary-peach-orange' />
														) : (
															<span className='absolute text-lg text-secondary-peach-orange mt-2 cursor-pointer font-righteous'>
																{guestItems.length}
															</span>
														)
													) : (
														hasActiveMainOrders ? (
															<CheckCircle2Icon className='absolute  left-1/2 transform -translate-x-1/2 -translate-y-1 w-3 h-3 mt-4 group-hover:text-secondary-peach-orange' />
														) : (
															<span className='absolute text-lg text-secondary-peach-orange mt-2 cursor-pointer font-righteous'>
																{hasAdminGuestItems ? adminGuestItems.length : (hasItems ? items.length : 0)}
															</span>
														)
													)}
												</>
											)}



											{((hasGuestItems && !hasGuestActiveMainOrders) || (hasAdminGuestItems && !hasAdminGuestActiveMainOrders) || (hasItems && !hasActiveMainOrders)) &&
												<span className='absolute top-12'>
													<SpeechBubble
														text='Please click "Place Order" to ensure your meal arrives 👋'
														direction='bottom'
														bubbleColor='#f28181' // the hard-coded color for pink-salmon (using the text doesn't work)
														textColor='white'
													/>
												</span>
											}
										</div>
									}
									sheetContent={
										<>
											<SheetHeader>
												<div className='relative w-full flex-col flex justify-center items-center pt-4 lg:pb-4'>
													<SheetTitle className='font-righteous mb-2 text-2xl'>
														Finalize Your Order
													</SheetTitle>
													<SheetPrimitive.Close
														className='absolute right-4 top-[18px]'
														onClick={() => globalStore.setIsSheetOpen(false)}>
														<X className='h-[25px] w-[25px]' />
														<span className='sr-only'>Close</span>
													</SheetPrimitive.Close>
													<div className='border-b border-[#425F57] w-full pt-2' />
												</div>
											</SheetHeader>
											<RestaurantScheduleList
												onDateSelect={(date: Date) => {
													if (!date) {
														return;
													}
													onDateChange?.(date);
												}}
												className='overflow-x-auto'
												dateSelected={selectedDate}
												dateSetter={dateSetter}
												variant='radio'
												isGuestLimitedView={isGuestLimitedView}
												guestLimitedDate={guestLimitedDateObj}
											/>
											<OrderSheet
												isCheckout={true}
												selectedDate={selectedDate}
												onMyAccountSettingsClick={onMyAccountSettingsClick}
												isGuestLimitedView={isGuestLimitedView}
												share={share}
												adminGuestId={adminGuestId}
											/>
										</>
									}
									className='bg-primary-off-white'
								/>
							</div>
							<div className='flex mx-2 lg:mx-0'>{endItems}</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};