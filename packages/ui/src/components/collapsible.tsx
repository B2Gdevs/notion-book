'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { StepHeader, StepHeaderProps } from './step-header';

interface CollapsibleProps {
	stepHeaderProps: StepHeaderProps;
	children: React.ReactNode;
	endComponent?: React.ReactNode; // Components with their own actions
	imageSrc?: string; // Optional image URL
	className?: string;
	expanded?: boolean;
	disabled?: boolean;
	chevronOnRight?: boolean;
	isCheckout?: boolean;
	subHeaderText?: string; // Store name for item in cart/checkout
}

export const Collapsible: React.FC<CollapsibleProps> = ({
	className,
	stepHeaderProps,
	children,
	endComponent,
	imageSrc,
	expanded,
	disabled = false,
	chevronOnRight = false,
	isCheckout,
	subHeaderText,
}: CollapsibleProps) => {
	const [isOpen, setIsOpen] = useState(expanded);
	const [imgSrc, setImgSrc] = useState<string | null | undefined>(imageSrc); // [TODO]: Handle image loading errors

	const handleEndComponentClick = (e: React.MouseEvent) => {
		if (disabled) {
			e.preventDefault();
			return;
		}
		e.stopPropagation(); // Prevent click from propagating to parent elements
	};

	const handleClick = () => {
		if (!disabled) {
			setIsOpen(!isOpen);
		}
	};

	return (
		<div
			className={`border-b ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
				}`}
		>
			<button
				type='button' // Specify the button type
				className={`flex ${isCheckout && 'flex-col'
					} justify-between items-center w-full border-b-2 border-b-primary-almost-black`}
				onClick={handleClick}
				disabled={disabled}
			>
				<div
					className={`flex space-x-0 w-full gap-2 ${imgSrc ? 'items-start justify-start' : 'items-center justify-center'
						}`}
				>
					{/* Chevron on the left */}
					{!chevronOnRight && (
						<motion.div
							initial={{ rotate: 0 }}
							animate={{ rotate: isOpen ? 180 : 0 }}
							transition={{ duration: 0.2 }}
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								role='img'
								aria-label={isOpen ? 'Collapse' : 'Expand'}
								className={`h-6 w-6 ${disabled
									? 'cursor-not-allowed'
									: 'hover:text-secondary-peach-orange cursor-pointer'
									}`}
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M19 9l-7 7-7-7'
								/>
							</svg>
						</motion.div>
					)}

					{/* Optional Image */}
					{imgSrc && (
						<img
							className='w-12 h-12 px-2 py-1 rounded-md'
							src={imgSrc}
							alt='Collapsible'
							onError={() => setImgSrc(null)}
						/>
					)}

					{/* Step Header */}
					<StepHeader
						{...stepHeaderProps}
						disabled={disabled}
						isCheckout={isCheckout}
					/>

					{/* Chevron on the right; used in weekdays-checkbox & timeoptions-checkbox for BudgetModal */}
					{chevronOnRight && (
						<motion.div
							initial={{ rotate: 0 }}
							animate={{ rotate: isOpen ? 180 : 0 }}
							transition={{ duration: 0.2 }}
							style={{ marginRight: '10px' }} // Add this line
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								role='img'
								aria-label={isOpen ? 'Collapse' : 'Expand'}
								className={`h-6 w-6 ${disabled
									? 'cursor-not-allowed'
									: 'hover:text-secondary-peach-orange cursor-pointer'
									}`}
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth='2'
									d='M19 9l-7 7-7-7'
								/>
							</svg>
						</motion.div>
					)}
				</div>

				{/* Store name for cart/checkout */}
				{(isCheckout && subHeaderText) && (
					<div className='relative flex justify-start items-center gap-2 w-full'>
						{/* H & O are space holders to match chevron SVG & stepHeader's stepNumber*/}
						<span className='h-6 w-6 opacity-0'>H</span>
						<div className='flex flex-row items-center font-righteous text-secondary-peach-orange'>
							<span className='h-[28px] w-[28px] lg:h-[24px] lg:w-[24px] opacity-0'>O</span>
							<span className='ml-4 opacity-20 font-righteous text-black'>{subHeaderText}</span>
						</div>
					</div>)
				}

				{/* New line for secondaryText and endComponent in checkout cart */}
				{isCheckout ? (
					<div className='relative flex justify-start items-center gap-2 w-full pb-4'>
						{/* H & O are space holders to match chevron SVG & stepHeader's stepNumber*/}
						<span className='h-6 w-6 opacity-0'>H</span>
						<div className='flex flex-row items-center font-righteous text-secondary-peach-orange'>
							<span className='h-[28px] w-[28px] lg:h-[24px] lg:w-[24px] opacity-0'>
								O
							</span>
							<div className='ml-4 flex items-center'>
								{stepHeaderProps.secondaryText}
								{endComponent && (
									<div
										onClick={handleEndComponentClick}
										role='button' // Indicate that the div acts as a button
										aria-disabled={disabled} // Indicate if the "button" is disabled
										style={{ outline: 'none' }} // Optionally remove the focus outline
										className='absolute right-2'
									>
										{endComponent}
									</div>
								)}
							</div>
						</div>
					</div>
				) : (
					// endComponent in all other cases
					<div
						onClick={handleEndComponentClick}
						role='button' // Indicate that the div acts as a button
						aria-disabled={disabled} // Indicate if the "button" is disabled
						style={{ outline: 'none' }} // Optionally remove the focus outline
					>
						{endComponent}
					</div>
				)}
			</button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						className={`overflow-hidden ${stepHeaderProps.orderPopup ? '' : 'ml-4'
							}  mb-4 mt-3 gap-y-2 flex flex-col`}
					>
						{children}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
