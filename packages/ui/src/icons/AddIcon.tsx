import React from 'react';
interface AddIconProps {
	className?: string;
	onClick?: () => void;
}

const AddIcon: React.FC<AddIconProps> = ({
	className = 'text-primary-spinach-green',
	onClick,
}) => {
	const handleKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
		if (event.key === 'Enter' || event.key === ' ') {
			onClick?.();
		}
	};

	return (
		<svg
			className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
			width='25'
			height='25'
			viewBox='0 0 34 34'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			onClick={onClick}
			onKeyDown={handleKeyDown}
		>
			<title>AddIcon</title>
			<g clipPath='url(#clip0_716_4540)'>
				<path
					d='M17 0C7.62582 0 0 7.62582 0 17C0 26.3742 7.62582 34 17 34C26.3742 34 34 26.3742 34 17C34 7.62582 26.3742 0 17 0ZM24.4375 18.4166H18.4166V24.4375C18.4166 25.2196 17.7821 25.8541 17 25.8541C16.2179 25.8541 15.5834 25.2196 15.5834 24.4375V18.4166H9.5625C8.78041 18.4166 8.14592 17.7821 8.14592 17C8.14592 16.2179 8.78041 15.5834 9.5625 15.5834H15.5834V9.5625C15.5834 8.78041 16.2179 8.14592 17 8.14592C17.7821 8.14592 18.4166 8.78041 18.4166 9.5625V15.5834H24.4375C25.2196 15.5834 25.8541 16.2179 25.8541 17C25.8541 17.7821 25.2196 18.4166 24.4375 18.4166Z'
					fill='currentColor'
				/>
			</g>
			<defs>
				<clipPath id='clip0_716_4540'>
					<rect width='34' height='34' fill='white' />
				</clipPath>
			</defs>
		</svg>
	);
};

export default AddIcon;
