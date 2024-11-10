import React from 'react';
import BackIcon from '../icons/BackIcon';
import ExitIcon from '../icons/ExitIcon';
import { cn } from '../lib/utils';

interface ExitHeaderProps {
	text?: string; // Optional text to be displayed in the center
	backText?: string; // Optional text to be displayed next to the back button
	onExit?: () => void; // Optional callback for exit button click
	onBack?: () => void; // Optional callback for back button click
	className?: string;
}

export const ExitHeader: React.FC<ExitHeaderProps> = ({
	text,
	onExit,
	onBack,
	backText,
	className,
}) => {
	return (
		<div className={cn('w-full ', className)}>
			<div className='flex items-center justify-center text-center'>
				{/* Optional Back Button */}
				{onBack && (
					<BackIcon
						onClick={onBack}
						className='text-primary-spinach-green hover:text-secondary-peach-orange mr-8'
					/>
				)}
				{/* Optional backText */}
				{backText && (
					<div className='text-primary-spinach-green '>{backText}</div>
				)}
			</div>

			{/* Optional Text */}
			{text && (
				<h2 className="text-center font-righteous text-2xl">{text}</h2>
			)}

			{/* Optional Exit Button */}
			{onExit && (
				<ExitIcon
					onClick={onExit}
					className='hover:text-secondary-peach-orange ml-8'
				/>
			)}
		</div>
	);
};

export default ExitHeader;
