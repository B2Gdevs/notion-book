'use client';

import { useParams, useRouter } from 'next/navigation';
import FloatingButtonGroup from '../../../../../components/floating-admin-navigation';
import { Header } from '../../../../../components/header';
import { RestuarantScheduleDisplay } from '../../../../../components/restuarant-shedule-display';
import { OrgMenuFooterHolder } from '../../../../../components/org-menu-footer-holder';
import { User, useGetDeliveryWindowById, useGetShare } from 'ui';
import Skeleton from 'react-loading-skeleton';
import { ShareLinkError } from '../../../../../components/share-link-error';
import { utcToZonedTime } from 'date-fns-tz';

export default function MenusLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const shareId = useParams().shareId as string;
	const isBrowser = typeof window !== 'undefined';

	const guestOrderId = isBrowser ? localStorage.getItem('guestOrderId') : null;
	const guestUserInfo = isBrowser ? localStorage.getItem('guestUserInfo') : null;

	const {
		first_name,
		last_name,
		email,
		phone,
		org_id,
		work_address,
	} = JSON.parse(guestUserInfo || '{}');

	// Construct a temporary User object
	const guestUser: User = {
		id: first_name + '_' + last_name + '_' + guestOrderId,
		first_name: first_name,
		last_name: last_name,
		email: email,
		phone: phone,
		org_id: org_id,
		work_address: work_address,
	};
	
	const { data: share, isLoading, isError } = useGetShare(shareId);
	const shareDate = share?.date;
    // Adjusted code to handle the date as UTC and convert to a specific timezone if needed
	const { data: deliveryWindow } = useGetDeliveryWindowById(share?.delivery_window_id ?? '');
    const timeZone = deliveryWindow?.timezone ?? 'UTC';
	const shareDateToPass = utcToZonedTime(shareDate ?? new Date(), timeZone);

	// If share date is in the past, redirect to an error page
	if (shareDateToPass) {
		const today = new Date();
		const shareDateObject = new Date(shareDateToPass);

		// Set both dates to start of the day for comparison
		today.setHours(0, 0, 0, 0);
		shareDateObject.setHours(0, 0, 0, 0);

		if (shareDateObject < today) {
			return (
				<div className='flex flex-col justify-center items-center p-4'>
					<span className='text-2xl font-righteous'>Error: Share date is in the past.</span>
					<span>If you believe this is an error, please contact Colorfull at <span className='underline'>help@colorfull.ai</span></span>
				</div>
			);
		}
	}

	if (isLoading) {
		return (
			<div className='flex flex-col justify-center items-center p-4'>
				<Skeleton width={400} height={50} />
				{Array.from({ length: 5 }).map((_, index) => (
					<Skeleton key={index} width={400} height={50} />
				))}
			</div>);
	}

	if (isError || !share) {
        return (
            <ShareLinkError />
        );
    }

	return (
		<section className='bg-primary-off-white flex-col'>
			<FloatingButtonGroup />
			<div className='z-50 sticky top-0 bg-primary-off-white'>
				<Header
					onLogoClick={() => {
						router.push(`/shares/${shareId}`);
					}}
					isOrgMenu={true}
					isGuestLimitedView={true}
					share={share}
                    guestUser={guestUser}
				/>
                <div className='border-b border-primary-almost-black opacity-50' />
			</div>
			<RestuarantScheduleDisplay
				isGuestLimitedView={true}
				guestLimitedDate={shareDateToPass}
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