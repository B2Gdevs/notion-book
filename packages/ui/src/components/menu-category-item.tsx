// packages/ui/src/components/menu-category-item.tsx
'use client';

import { motion } from 'framer-motion';
import React from 'react';
import { cn } from '../lib/utils';

interface MenuCategoryItemProps {
	categoryId: string;
	categoryName: string;
	isSelected?: boolean;
	onClick?: (categoryId: string) => void;
	className?: string;
}

export const MenuCategoryItem: React.FC<MenuCategoryItemProps> = ({
	className,
	categoryId,
	categoryName,
	isSelected,
	onClick,
}) => {
	return (
		<div>
			<div
				className={cn(
					'w-fit flex-none cursor-pointer whitespace-nowrap',
					className,
				)}
				onClick={() => onClick?.(categoryId)}
			>
				{categoryName}
			</div>
			{isSelected && (
				<motion.span
					layoutId='menu-category-underline'
					className='block h-[6px] w-full bg-secondary-pink-salmon'
				/>
			)}
		</div>
	);
};
