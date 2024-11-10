import * as React from 'react';
import { Item } from '..';
import { cn } from '../lib/utils';
import { DietaryClassifications } from './dietary-classifications'; // Adjust the path based on your structure
import { MenuItemCardDescription } from './menu-item-card-description';
import { MenuItemCardUnavailableOverlay } from './menu-item-card-unavailable-overlay';
import { MenuItemPrice } from './menu-item-price';

export interface MenuItemCardProps {
	layout?: 'vertical' | 'horizontal';
	variant?: 'lime' | 'corn' | 'peach' | 'creamer';
	selected?: boolean;
	imageSrc: string;
	price?: number;
	onClick?: () => void;
	name?: string;
	description?: string;
	className?: string;
	isAvailable?: boolean;
	previewMode?: boolean;
	item?: Item;
}

const VARIANT_COLORS = {
	lime: 'bg-primary-lime-green',
	corn: 'bg-secondary-corn-yellow',
	peach: 'bg-secondary-peach-orange',
	creamer: 'bg-secondary-creamer-beige',
};

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
	layout = 'vertical',
	variant = 'lime',
	selected = false,
	imageSrc,
	onClick = () => { },
	price = 0,
	name,
	description = '',
	className,
	isAvailable = true,
	previewMode = false,
	item
}) => {
	const bgColor = VARIANT_COLORS[variant] || VARIANT_COLORS.lime;
	const selectedBorder = selected
		? 'border-secondary-peach-orange '
		: 'border-primary-almost-black';

	const truncateVerticalLayoutName = (name: string) =>
		name.length > 28 ? `${name.substring(0, 28)}...` : name;
	const truncateHorizontalLayoutName = (name: string) =>
		name.length > 34 ? `${name.substring(0, 34)}...` : name;
	const upperCaseFirstLetterDescription = description.charAt(0).toUpperCase() + description.slice(1);

	const imageClasses = cn(
		'w-[200px] h-[160px] rounded-2xl object-cover transition-transform duration-300',
		!isAvailable && 'filter grayscale',
		'hover:scale-110' // This will scale the image to 110% of its size on hover
	);

	const handleClick = () => {
		if (previewMode) return; // Prevent click event in preview mode

		if (isAvailable && onClick) {
			onClick();
		}
	};

	const VerticalMenuItemCardVariant = () => (
		<div
			className={cn(
				`group rounded-2xl flex flex-col justify-between w-full h-full lg:w-72 overflow-hidden ${bgColor} ${selectedBorder} ${selected ? 'border-2' : ''}`,
				className,
			)}
		>
			{!isAvailable && <MenuItemCardUnavailableOverlay className='lg:w-72' />}
			{imageSrc && (
				<div className={cn(
					'bg-off-white group-hover:bg-primary-off-white-darker p-2 flex items-center justify-center h-[200px] relative overflow-hidden'
				)}>
					<img
						className={imageClasses}
						src={imageSrc}
						alt='Favorite Item'
					/>
				</div>
			)}

			<div className='bg-primary-almost-black group-hover:bg-primary-almost-black-darker p-4 pt-2 flex flex-col justify-start grow'>
				<MenuItemPrice
					layout='vertical'
					name={truncateVerticalLayoutName(name ?? '')}
					price={price}
				/>
				<DietaryClassifications
					previewMode={previewMode}
					layout='horizontal'
					className={`${layout === 'vertical'
						? 'text-secondary-creamer-beige'
						: 'text-primary-spinach-green'
						}`}
					item={item}
				/>
				<MenuItemCardDescription
					layout='vertical'
					description={upperCaseFirstLetterDescription} />
			</div>
		</div>
	);

	const HorizontalMenuItemCardVariant = () => (
		<div className='max-w-2xl'>
			<div
				className={cn(
					`w-full 2xl:w-[400px]
                    h-48 md:h-40 lg:h-64 2xl:h-56
                    px-4 py-4  
                    gap-3 md:gap-5  
                    lg:px-6 lg:py-6 lg:pt-4
                    ${VARIANT_COLORS[variant]}
                    rounded-2xl
                    inline-flex
                    relative
                    hover:bg-primary-lime-green-darker 
                    `,
					className,
				)}
			>
				{!isAvailable && <MenuItemCardUnavailableOverlay />}
				<div className='md:max-w-xs max-h-48'>
					<div className='text-md md:text-lg lg:text-xl font-righteous leading-tight'>
						{truncateHorizontalLayoutName(name ?? '')}
					</div>

					<div className='text-base text-secondary-peach-orange font-righteous'>
						${price.toFixed(2)}
					</div>

					<div className="text-xs font-sans max-h-[100px] lg:max-h-[120px] overflow-y-auto no-scrollbar">
						<MenuItemCardDescription
							layout='horizontal'
							description={upperCaseFirstLetterDescription}
						/>
					</div>
				</div>

				{imageSrc && (
					<img
						className={imageClasses}
						src={imageSrc}
						alt='Dish'
					/>
				)}

				<div className='absolute bottom-4 left-4'>
					<DietaryClassifications
						previewMode={previewMode}
						layout={layout}
						item={item}
						className={`
                        ${layout === 'vertical'
								? 'text-secondary-creamer-beige'
								: 'text-primary-spinach-green'
							}
                        `}
					/>
				</div>
			</div>
		</div>
	);


	return (
		<div
			onClick={handleClick}
			className={cn(
				'w-full h-full transform transition-transform duration-300 group',
				previewMode ? 'cursor-default' : 'cursor-pointer', // Change cursor style based on preview mode
				!isAvailable && 'cursor-not-allowed',
			)}
		>
			{layout === 'vertical' ? <VerticalMenuItemCardVariant /> : <HorizontalMenuItemCardVariant />}
		</div>
	);
};