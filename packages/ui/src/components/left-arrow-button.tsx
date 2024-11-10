'use client';
import React from 'react';
import {LeftArrowIcon} from '../icons/LeftArrowIcon';
// BackButton.tsx
import { cn } from '../lib/utils';

interface LeftArrowButtonProps {
	onClick?: () => void;
	className?: string;
	text?: string;
}

export const LeftArrowButton: React.FC<LeftArrowButtonProps> = ({
	onClick,
	className,
	text,
}) => {
	return (
		<button
			type='button'
			onClick={onClick}
			className={cn(
				'flex items-center px-4 py-2 rounded bg-primary-off-white  ',
				className,
			)}
		>
			<div className='flex group pl-[6px] '>
				<LeftArrowIcon className='text-beige-200 rounded-lg mr-2 group-hover:bg-secondary-peach-orange ' />
				<span className='text-primary-almost-black flex justify-center items-center group-hover:text-secondary-peach-orange pl-1 font-righteous text-[18px]'>
					{text ?? 'Back to Restaurants'}
				</span>
			</div>
		</button>
	);
};
