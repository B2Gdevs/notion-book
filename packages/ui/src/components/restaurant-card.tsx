'use client';

import * as React from 'react';
import { Area, Brand, DirectionAwareHover, ItemClassification } from '..';
import { cn } from '../lib/utils';
import { CircleSlashIcon } from 'lucide-react';

interface RestaurantCardProps {
	storeId: string;
	variant?: 'lime' | 'corn' | 'peach' | 'creamer';
	selected?: boolean;
	brandImage?: string;
	foodCategory?: string;
	dropOffTimeWindow?: string;
	orderCutOffTime?: string;
	title?: string;
	description?: string;
	lastMeal?: string;
	establishedDate?: string;
	favoriteDish?: string;
	onViewMenuClick?: (storeId: string) => void; // Updated to accept an optional string parameter
	className?: string;
	isDisabled?: boolean;
	disabledReason?: string;
	area?: Area;
	brand?: Brand;
	itemClassifications?: ItemClassification[];
	isUnavailable?: boolean;
}

const VARIANT_COLORS = {
	lime: 'bg-primary-lime-green',
	corn: 'bg-secondary-corn-yellow',
	peach: 'bg-secondary-peach-orange',
	creamer: 'bg-secondary-creamer-beige',
};

export const RestaurantCard: React.FC<RestaurantCardProps> = (props) => {
	const bgColor =
		VARIANT_COLORS[props?.variant ?? 'lime'] || VARIANT_COLORS.lime;
	const selectedBorder = props?.selected
		? 'border-4 border-secondary-peach-orange rounded-xl'
		: '';
	const onViewMenuClick =
		props?.onViewMenuClick ?? (() => alert('Not implemented'));


	const titleLength = props?.title?.length ?? 0;
	let titleClass = 'text-xl';
	if (titleLength > 20) {
		titleClass = 'text-lg';
	}
	if (titleLength > 28) {
		titleClass = 'text-base';
	}
	if (titleLength > 36) {
		titleClass = 'text-sm';
	}

	// Handling card click without triggering onViewMenuClick when buttons are clicked
	const handleCardClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if ((e.target as Element).nodeName !== 'BUTTON' && !props.isDisabled) {
			onViewMenuClick(props.storeId);
		}
	};

	const UnavailableOverlay = () => (
		<div className='absolute top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 rounded-xl text-lg z-[999]'>
			{/* <span className='text-secondary-peach-orange font-righteous'>
				{props.disabledReason || "We are closed for the day. 👋"}
			</span> */}
			<div className='absolute top-2 left-2 bg-white border border-black text-black text-sm px-3 py-1 rounded-full flex space-x-2 justify-center text-center items-center'>
				<CircleSlashIcon />
				<div>
					Unavailable
				</div>
			</div>
		</div>
	);

	return (
		<div
			className={cn(
				'transform overflow-hidden flex flex-col items-start rounded-2xl bg-primary-almost-black',
				`${selectedBorder} relative w-[343px] h-[280px]`,
				props.className,
				{
					'cursor-pointer hover:bg-primary-almost-black-darker':
						!props.isDisabled,
				},
				{ 'opacity-50 cursor-not-allowed filter': props.isDisabled },
				{ 'transition-transform duration-300': !props.isDisabled },
			)}
			onClick={handleCardClick}
			id='restaurant-card'
		>
			{(props.isDisabled || props.isUnavailable) && <UnavailableOverlay />}

			{props?.area && !props.isDisabled ? (
				<DirectionAwareHover
					className='w-full h-[190px] 2xl:h-[175px]'
					imageUrl={props?.brandImage ?? "https://res.cloudinary.com/dzmqies6h/image/upload/v1710964546/Image_Container_b2q5nv.png"}
					childrenClassName='text-3xl  text-white'
				>
					<div className='flex-col'>
						<div className='text-xs italic'>{props?.area?.name}</div>
						<div className='text-sm font-righteous text-primary-off-white'>{props?.title}</div>
					</div>
				</DirectionAwareHover>

			) : (
				<div
					className={`${bgColor} self-stretch flex flex-col justify-center h-[190px] 2xl:h-[175px]`}
				>
					<img
						src={props?.brandImage ?? "https://res.cloudinary.com/dzmqies6h/image/upload/v1710964546/Image_Container_b2q5nv.png"}
						alt={props?.title}
						className='w-full h-full object-cover object-center'
					/>
				</div>
			)}

			<div
				className='flex flex-col p-4 w-full gap-4'
				id='description-container'
			>
				<div className='flex flex-col'>
					<h2 className={`text-primary-off-white font-righteous ${titleClass} min-h-[30px] text-left font-normal tracking-normal`}>
						{props?.title ?? 'N/A'}
					</h2>

					<div className='flex space-x-2'>
						{props.itemClassifications?.filter(Boolean).map((itemClassification) => {
							return (
								<div key={itemClassification?.id} className='text-sm font-nah text-secondary-corn-yellow'>
									{itemClassification?.tag}
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	);
};