'use client';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import * as React from 'react';

import { cn } from '../lib/utils';

interface CheckboxProps
	extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
	currencyValue?: number;
	className?: string;
	text?: string;
	checked?: boolean;
	onClick?: () => void;
	orderPopup?: boolean;
	isCheckout?: boolean;
}

export const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	CheckboxProps
>(
	(
		{
			className,
			currencyValue,
			text,
			checked,
			onClick,
			disabled,
			orderPopup,
			isCheckout,
			...props
		},
		ref,
	) => {
		const [isChecked, setIsChecked] = React.useState(checked ?? false);

		// Update isChecked state when checked prop changes
		React.useEffect(() => {
			setIsChecked(checked ?? false);
		}, [checked]);

		const handleClick = (e: React.MouseEvent) => {
			if (disabled) {
				return; // Return early if the checkbox is disabled
			}

			e.preventDefault();
			setIsChecked((prevState) => !prevState); // Toggle the checkbox state

			// Call the passed onClick callback if provided
			if (onClick) {
				onClick();
			}
		};

		const handleKeyDown = (e: React.KeyboardEvent) => {
			if (disabled) {
				return; // Return early if the checkbox is disabled
			}

			// Only trigger the event when the Enter key is pressed
			if (e.key === 'Enter') {
				e.preventDefault();
				setIsChecked((prevState) => !prevState); // Toggle the checkbox state
				// Call the passed onClick callback if provided
				if (onClick) {
					onClick();
				}
			}
		};


		return (
			<label
				className={cn(
					'flex items-center',
					disabled ? '' : 'cursor-pointer',
					isCheckout ? 'ml-8 my-1' : '',
					className,
				)}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
			>
				<CheckboxPrimitive.Root
					ref={ref}
					checked={isChecked}
					disabled={disabled} // Pass the disabled prop if isCheckout is false
					className={cn(
						'peer shrink-0 rounded-md ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed ',
						orderPopup
							? 'h-[18px] w-[18px] bg-primary-spinach-green-lighter'
							: 'h-6 w-6 border border-primary',
						isChecked ? 'bg-primary-spinach-green' : '',
						isCheckout ? 'opacity-100' : 'disabled:opacity-50',
						className,
					)}
					{...props}
				>
					<CheckboxPrimitive.Indicator
						className={cn(
							'flex items-center justify-center',
							isChecked ? 'text-primary-off-white' : 'text-current',
						)}
					>
						{isChecked && <Check className='h-4 w-4' />}
					</CheckboxPrimitive.Indicator>
				</CheckboxPrimitive.Root>
				{text && (
					<div
						className={`ml-2 
              ${
								orderPopup
									? 'font-righteous text-xs font-normal'
									: "font-sans"
							}
                            ${
															isCheckout
																? 'opacity-100 font-righteous leading-none'
																: disabled
																  ? 'opacity-50'
																  : ''
														}
            `}
					>
						{text}
					</div>
				)}
				{typeof currencyValue !== 'undefined' && currencyValue !== 0 && (
					<span
						className={`ml-6 text-secondary-peach-orange
            ${
							orderPopup
								? 'font-righteous text-xs font-normal'
								: "font-sans"
						}
			${isCheckout && 'font-righteous text-[14px]'}
          `}
					>
						{currencyValue >= 0 ? '+' : '-'}${Math.abs(currencyValue).toFixed(2)}
					</span>
				)}
			</label>
		);
	},
);

Checkbox.displayName = CheckboxPrimitive.Root.displayName;
