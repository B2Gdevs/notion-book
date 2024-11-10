'use client';
// @ts-ignore
import { useRouter } from 'next/navigation';
import { RestaurantScheduleList } from 'ui';
import { GlobalState, useGlobalStore } from '../../stores/globalStore';
import { isEqual } from 'date-fns';

interface RestaurantScheduleDisplayProps {
	isGuestLimitedView?: boolean;
	guestLimitedDate?: Date;
	activeDates?: Set<string>; // Dates with active orders
}

export const RestuarantScheduleDisplay: React.FC<RestaurantScheduleDisplayProps> = ({
	isGuestLimitedView,
	guestLimitedDate,
	activeDates,
}) => {
	const setDate = useGlobalStore((state: GlobalState) => state.setDate);
	const selectedDate = useGlobalStore(
		(state: GlobalState) => state.selectedDate,
	);

	const guestLimitedDateObj = guestLimitedDate ? new Date(guestLimitedDate) : undefined;

	const router = useRouter();
	return (
		<RestaurantScheduleList
			onDateSelect={(date: Date) => {
				if (!date) {
					return;
				}
				if (!isEqual(date, selectedDate)) {
					router.push('/');
				}
			}}
			dateSelected={selectedDate}
			dateSetter={setDate}
			isGuestLimitedView={isGuestLimitedView}
			guestLimitedDate={guestLimitedDateObj}
			activeDates={activeDates}
		/>
	);
};
