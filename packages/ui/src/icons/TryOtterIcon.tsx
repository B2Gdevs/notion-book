import React from 'react';

interface TryOtterIconProps {
	className?: string;
	onClick?: () => void;
    size?: number;
}

export const TryOtterIcon: React.FC<TryOtterIconProps> = ({
	className = 'text-primary-spinach-green',
	onClick,
    size = 32,
}) => (
	<svg
		className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
		onClick={onClick}
		height={size}
        width={size}
		viewBox='0 0 32 32'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
	>
		<path
			fillRule='evenodd'
			clipRule='evenodd'
			d='M1.37508 2.96795C0 4.86058 0 7.56039 0 12.96L0 19.04C0 24.4396 0 27.1394 1.37508 29.0321C1.81917 29.6433 2.3567 30.1808 2.96795 30.6249C4.86058 32 7.56039 32 12.96 32L19.04 32C24.4396 32 27.1394 32 29.0321 30.6249C29.6433 30.1808 30.1808 29.6433 30.6249 29.0321C32 27.1394 32 24.4396 32 19.04V12.96C32 7.56039 32 4.86058 30.6249 2.96795C30.1808 2.3567 29.6433 1.81917 29.0321 1.37508C27.1394 0 24.4396 0 19.04 0L12.96 0C7.56039 0 4.86058 0 2.96795 1.37508C2.3567 1.81917 1.81917 2.3567 1.37508 2.96795ZM16 5C9.92487 5 5 9.92487 5 16C5 22.0751 9.92487 27 16 27C22.0751 27 27 22.0751 27 16C27 9.92487 22.0751 5 16 5Z'
			fill='black'
		></path>
	</svg>
);
