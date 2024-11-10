import React from 'react';
import { cn } from '../lib/utils';

export interface StepHeaderProps {
	text: string;
	step?: string;
	options?: string[];
	secondaryText?: string;
	subHeaderText?: string;
	disabled?: boolean;
	className?: string;
	orderPopup?: boolean;
	fontSize?: string;
	logoUrl?: string;
	logoAlternative?: string;
	isCheckout?: boolean;
	textFontFamily?: string;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
	text,
	className,
	step: stepNumber,
	options,
	secondaryText,
	disabled = false,
	orderPopup = false,
	fontSize = 'text-base', // default font size
	logoUrl,
	logoAlternative,
	isCheckout,
	textFontFamily,
}) => (
	<div
		className={cn(
			`py-2 flex justify-start text-start items-center w-full 
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${fontSize}
      `,
			className,
		)}
	>
		{stepNumber && (
			<div
				className={`bg-primary-almost-black rounded-full flex items-center justify-center h-[28px] w-[28px] ${
					orderPopup ? 'lg:h-[24px] lg:w-[24px]' : 'lg:h-[40px] lg:w-[40px]'
				}`}
			>
				<span
					className={`text-white font-righteous ${fontSize} ${
						orderPopup ? 'text-base' : 'text-lg'
					}`}
				>
					{stepNumber}
				</span>
			</div>
		)}

		<div className='ml-4 w-fit'>
			<span
				className={`${textFontFamily ? textFontFamily : 'font-righteous'}  text-primary-almost-black text-[18px] lg:text-xl ${fontSize} ${
					!disabled //&& 'hover:text-secondary-peach-orange'
				}`}
			>
				{text}
			</span>
		</div>

		{(logoUrl || logoAlternative) && (
			<div className='ml-4 lg:ml-12'>
				{logoUrl ? (
					<img src={logoUrl} alt='Organization Logo' />
				) : (
					<div className='p-4 lg:p-6 font-righteous bg-primary-spinach-green text-primary-cucumber-green rounded-md lg:text-2xl'>
						{logoAlternative}
					</div>
				)}
			</div>
		)}
		{/* This is the secondary text that will be peach orange and only be displayed if it is available */}
		{!isCheckout && (
			<div
				className={`flex flex-row ml-2 font-sans text-secondary-peach-orange ${fontSize}`}
			>
				{secondaryText}
			</div>
		)}
		{options && options.length > 0 && (
			<div
				className={`flex flex-row ml-2 font-sans text-primary-almost-black ${fontSize}`}
			>
				({options.join(', ')})
			</div>
		)}
	</div>
);
