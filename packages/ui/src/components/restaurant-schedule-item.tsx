'use client';

import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import React, { useState } from 'react';
import HalfMoonIcon from '../icons/HalfMoonIcon';
import SunIcon from '../icons/SunIcon';
import { cn } from '../lib/utils';

export interface RestaurantScheduleItemProps {
	day: string;
	date: string;
	isToday?: boolean;
	icon: 'sun' | 'moon';
	isSelected?: boolean;
	isDisabled?: boolean;
	onClick?: (event?: React.MouseEvent<HTMLElement>) => void; // Allow event to be optional
	className?: string;
	isCheckout?: boolean;
	value?: number;
	hasActiveOrder?: boolean;
	isRadio?: boolean;
}

export const RestaurantScheduleItem: React.FC<RestaurantScheduleItemProps> = ({
	className,
	day,
	date,
	icon,
	isToday,
	isSelected,
	isDisabled,
	onClick,
	isCheckout,
	value,
	hasActiveOrder,
	isRadio,
}) => {
	const [itemHovered, setItemHovered] = useState(false);
	const baseTextColor = !isDisabled
		? 'text-primary-spinach-green'
		: 'text-primary-lightened-spinach-green';
	const hoverTextColor =
		!isDisabled && itemHovered ? 'text-secondary-peach-orange' : '';
	const textColorOpacity = isDisabled ? 'opacity-50 brightness-50' : '';

	return (
		<div
			className={cn(
				'w-full sm:w-24 p-2 flex flex-col relative rounded-lg transition-colors mt-2',
				isDisabled ? '' : 'cursor-pointer',
				isCheckout ? 'justify-center items-center' : 'justify-start items-start',
				(isSelected && isCheckout) ? 'bg-beige-200 m-1' : '',
				className,
			)}
			onClick={isDisabled ? undefined : onClick}
			onKeyDown={
				isDisabled
					? undefined
					: (event) => {
						if (event.key === 'Enter') {
							onClick?.();
						}
					}
			}
			onMouseEnter={() => setItemHovered(true)}
			onMouseLeave={() => setItemHovered(false)}
		>
			{!isCheckout && (
				<div className='w-full flex justify-between items-center'>
					<div className='w-6 h-6 relative flex-shrink-0 flex flex-row mb-2'>
					<div className='flex items-center space-x-8'>
							{!isToday ? (
								<>
									{icon === 'sun' && <SunIcon />}
									{icon === 'moon' && <HalfMoonIcon />}
								</>
							) : (
								<div className="w-6 h-6 font-normal font-righteous text-secondary-peach-orange">
									Today
								</div>
							)}
							{hasActiveOrder && (
								<img
									className='ml-1 lg:ml-2'
									src={'https://res.cloudinary.com/dzmqies6h/image/upload/v1718144893/calendar_nhbdkx.png'}
									alt='Calendar with check mark'
								/>
							)}
						</div>
					</div>
					{value && (
						<div
							className="flex items-center bg-white text-primary-spinach-green text-xxs  rounded-full px-2 py-1 shadow-md ml-6"
						>
							<DollarSign className="mr-1" size={12} />
							<span className="font-sans">
								${value.toFixed(2)}
							</span>
						</div>
					)}
					<div className='block absolute left-0 bottom-0 w-full'>
						{isSelected && (
							<motion.span
								layoutId='schedule-item-underline'
								className='block h-[6px] w-full bg-secondary-pink-salmon'
							/>
						)}
					</div>
				</div>
			)}

			<div
				className={`${(isToday && isRadio) ? 'text-primary-cucumber-green' : baseTextColor} ${hoverTextColor} ${textColorOpacity} text-[22px] lg:text-2xl font-normal font-['Righteous']`}
			>
				{isToday && isRadio ? "Today" : day}
			</div>
			<div
				className={`${baseTextColor} ${hoverTextColor} ${textColorOpacity} text-[15px] lg:text-lg  font-sans`}
			>
				{date}
			</div>
		</div>
	);
};