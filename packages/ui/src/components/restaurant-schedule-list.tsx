'use client';

// import { useFeatureFlagEnabled } from 'posthog-js/react';
import React from 'react';
import { daysOfWeek } from '../constants/dayConstants';
import CalendarEditIcon from '../icons/CalendarEditIcon';
import { cn } from '../lib/utils';
import { RestaurantScheduleItem } from './restaurant-schedule-item';

interface RestaurantScheduleListProps {
	calendarOnClick?: () => void;
	onDateSelect?: (date: Date) => void;
	className?: string;
	dateSelected?: Date;
	withCalender?: boolean;
	dateSetter?: (date: Date) => void;
	variant?: 'radio' | 'list';
	value?: number;
	isGuestLimitedView?: boolean;
	guestLimitedDate?: Date;
	activeDates?: Set<string>; // Dates with active orders
}

export const RestaurantScheduleList: React.FC<RestaurantScheduleListProps> = ({
	className,
	calendarOnClick,
	onDateSelect,
	dateSelected,
	withCalender,
	dateSetter,
	variant = 'list',
	value,
	isGuestLimitedView,
	guestLimitedDate,
	activeDates,
}) => {
	const today = new Date();
	// set not implemented calendarOnClick alert, if calendarOnClick is not passed in
	if (!calendarOnClick) {
		calendarOnClick = () => alert('Calendar Edit not implemented');
	}

	if (!onDateSelect && !dateSetter) {
		onDateSelect = (date: Date) => alert(`Selected ${date}`);
	}

	// const weekendServiceFlagEnabled = useFeatureFlagEnabled('weekend_service');
	
	// Generate 7 days worth of RestaurantScheduleItems
	const items = Array.from({ length: 7 }).map((_, i) => {
		const itemDate = new Date(today);
		itemDate.setDate(today.getDate() + i);

		const isWeekend = itemDate.getDay() === 0 || itemDate.getDay() === 6;
		const dateString = `${String(itemDate.getMonth() + 1).padStart(
			2,
			'0',
		)}/${String(itemDate.getDate()).padStart(2, '0')}`;

		// Determine if the item date is "today"
		const isToday = i === 0;

		let isNotToday = true;
		if (isGuestLimitedView && dateSelected) {
			isNotToday = !(itemDate.toDateString() === dateSelected.toDateString());
		}

		const isSelected = dateSelected &&
			itemDate.toDateString() === dateSelected.toDateString()

		const hasActiveOrder = activeDates?.has(itemDate.toDateString());

		// Define onClick function based on isGuestLimitedView
		const onClickHandler = isGuestLimitedView ? (event?: React.MouseEvent<HTMLElement>) => {
			event?.stopPropagation(); // Prevent any parent handlers from being notified of the event
		} : () => {
			dateSetter?.(itemDate);
			onDateSelect?.(itemDate);
		};

		const isShareDate = (isGuestLimitedView && guestLimitedDate) ? itemDate.toDateString() === guestLimitedDate?.toDateString() : itemDate.toDateString() === dateSelected?.toDateString();

		const isDisabled = isGuestLimitedView ?
			(!isShareDate && (isWeekend || (isNotToday && !isToday) || (isToday && itemDate.toDateString() !== guestLimitedDate?.toDateString()))) :
			(isWeekend);

		return (
			<RestaurantScheduleItem
				className='w-full pt-[16px] lg:pt-[20px]'
				key={dateString}
				day={daysOfWeek[itemDate.getDay()]}
				date={dateString}
				icon={isWeekend ? 'moon' : 'sun'}
				isToday={isToday}
				isSelected={isShareDate}
				isDisabled={isDisabled}
				onClick={onClickHandler}
				value={isSelected ? value : undefined} 
				hasActiveOrder={hasActiveOrder}
			/>
		);
	});

	const radioItems = Array.from({ length: 7 }).map((_, i) => {
		const itemDate = new Date(today);
		itemDate.setDate(today.getDate() + i);
		const isWeekend = itemDate.getDay() === 0 || itemDate.getDay() === 6;
		if (isWeekend) {
			return null; // Skip weekends
		}

		// Determine if the item date is "today"
		const isToday = i === 0;

		let isNotToday = true;
		if (isGuestLimitedView && dateSelected) {
			isNotToday = !(itemDate.toDateString() === dateSelected.toDateString());
		}

		const dateString = `${String(itemDate.getMonth() + 1).padStart(2, '0')}/${String(itemDate.getDate()).padStart(2, '0')}`;

		// Define onClick function based on isGuestLimitedView
		const onClickHandler = isGuestLimitedView ? (event?: React.MouseEvent<HTMLElement>) => {
			event?.stopPropagation(); // Prevent any parent handlers from being notified of the event
		} : () => {
			dateSetter?.(itemDate);
			onDateSelect?.(itemDate);
		};

		const hasActiveOrder = activeDates?.has(itemDate.toDateString());

		const isShareDate = (isGuestLimitedView && guestLimitedDate) ? itemDate.toDateString() === guestLimitedDate?.toDateString() : itemDate.toDateString() === dateSelected?.toDateString();

		const isDisabled = isGuestLimitedView ?
			(!isShareDate && (isWeekend || (isNotToday && !isToday) || (isToday && itemDate.toDateString() !== guestLimitedDate?.toDateString()))) :
			(isWeekend);

		return (
			<RestaurantScheduleItem
				className='w-full'
				key={dateString}
				day={daysOfWeek[itemDate.getDay()]}
				date={dateString}
				icon={isWeekend ? 'moon' : 'sun'}
				isCheckout={true}
				isToday={isToday}
				isSelected={isShareDate}
				isDisabled={isDisabled}
				onClick={onClickHandler}
				hasActiveOrder={hasActiveOrder}
				isRadio={true}
			/>
		);
	});

	return (
		<div
			className={cn(
				'flex overflow-x-auto lg:w-full bg-primary-off-white justify-between container sm:px-2 px-1 no-scrollbar scroll-container',
				{
					'md:pr-[15%]': variant !== 'radio',
				},
				className,
			)}
			tabIndex={0} // Make div focusable
		>
			{variant === 'radio' ? (
				<div className="w-full flex justify-between items-center">{radioItems}</div>
			) : (
				items.map((item, index) => (
					<div
						className='w-[100px] flex-none'
						key={`${index}-${item.key?.toString()}`}
					>
						{item}
					</div>
				))
			)}
			{withCalender && (
				<CalendarEditIcon
					className='text-primary-spinach-green hover:text-secondary-peach-orange cursor-pointer'
					onClick={calendarOnClick}
				/>
			)}
		</div>
	);
};