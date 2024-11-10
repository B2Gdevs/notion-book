import React from 'react';

interface ExitIconProps {
	className?: string;
	onClick?: () => void;
}

const ExitIcon: React.FC<ExitIconProps> = ({
	className = 'text-primary-spinach-green',
	onClick,
}) => {
	const handleKeyDown = (event: React.KeyboardEvent<SVGSVGElement>) => {
		// Trigger onClick when Enter or Space key is pressed
		if (event.key === 'Enter' || event.key === ' ') {
			onClick?.();
		}
	};

	return (
		<svg
			className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
			width='16'
			height='16'
			viewBox='0 0 22 22'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			onClick={onClick}
			onKeyDown={handleKeyDown}
			role='img'
			aria-label='Exit' // Aria-label for accessibility
		>
			<title>Exit</title> {/* Add title element for accessibility */}
			<g clipPath='url(#clip0_748_18126)'>
				<path
					d='M12.8298 11.0003L21.6205 2.20961C22.1265 1.70362 22.1265 0.885779 21.6205 0.379794C21.1145 -0.126191 20.2967 -0.126191 19.7907 0.379794L11 9.17047L2.2093 0.379794C1.70332 -0.126191 0.885474 -0.126191 0.379489 0.379794C-0.126496 0.885779 -0.126496 1.70362 0.379489 2.20961L9.17017 11.0003L0.379489 19.791C-0.126496 20.2969 -0.126496 21.1148 0.379489 21.6208C0.631837 21.8731 0.963116 21.9999 1.2944 21.9999C1.62567 21.9999 1.95695 21.8731 2.2093 21.6208L11 12.8301L19.7907 21.6208C20.043 21.8731 20.3743 21.9999 20.7056 21.9999C21.0368 21.9999 21.3681 21.8731 21.6205 21.6208C22.1265 21.1148 22.1265 20.2969 21.6205 19.791L12.8298 11.0003Z'
					fill='currentColor'
				/>
			</g>
			<defs>
				<clipPath id='clip0_748_18126'>
					<rect width='22' height='22' fill='white' />
				</clipPath>
			</defs>
		</svg>
	);
};

export default ExitIcon;
