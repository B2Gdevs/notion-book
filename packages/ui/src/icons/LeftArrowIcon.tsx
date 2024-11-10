import React from 'react';

interface LeftArrowIconProps {
	onClick?: () => void;
	className?: string;
}

export const LeftArrowIcon: React.FC<LeftArrowIconProps> = ({
	onClick,
	className,
}) => (
	<svg
		className={className}
		width='30'
		height='30'
		viewBox='0 0 30 30'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		onClick={onClick}
	>
		<title>LeftArrowIcon</title>
		<path
			d='M25 15H5M5 15L13 22M5 15L13 08'
			stroke='#292D32'
			strokeWidth='2'
			strokeLinecap='round'
			strokeLinejoin='round'
		/>
	</svg>
);

