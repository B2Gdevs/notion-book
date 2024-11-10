import React from 'react';


interface SpeechBubbleProps {
	text: string;
	direction: 'top' | 'bottom' | 'left' | 'right';
	bubbleColor?: string;
    textColor?: string;
    cursor?: string;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ text, direction, bubbleColor = 'gray', textColor = 'black', cursor = 'pointer' }) => {
	const bubbleStyles = {
		position: 'relative' as 'relative',
		backgroundColor: bubbleColor,
		cursor: cursor,
		border: `3px solid ${bubbleColor}`,
		borderRadius: '10px',
		color: textColor,
		padding: '10px',
	};

	const triangleStyles = {
		content: '""',
		position: 'absolute' as 'absolute',
		width: '20px',
		height: '20px',
		backgroundColor: bubbleColor,
		transform: 'rotate(45deg)',
	};

	const directionStyles = {
		top: {
			...triangleStyles,
			bottom: '-10px',
			left: '50%',
			transform: 'translateX(-50%) rotate(45deg)',
			borderBottom: `3px solid ${bubbleColor}`,
			borderRight: `3px solid ${bubbleColor}`,
		},
		bottom: {
			...triangleStyles,
			top: '-10px',
			left: '50%',
			transform: 'translateX(-50%) rotate(45deg)',
			borderTop: `3px solid ${bubbleColor}`,
			borderLeft: `3px solid ${bubbleColor}`,
		},
		left: {
			...triangleStyles,
			right: '-10px',
			top: '50%',
			transform: 'translateY(-50%) rotate(45deg)',
			borderTop: `3px solid ${bubbleColor}`,
			borderRight: `3px solid ${bubbleColor}`,
		},
		right: {
			...triangleStyles,
			left: '-10px',
			top: '50%',
			transform: 'translateY(-50%) rotate(45deg)',
			borderBottom: `3px solid ${bubbleColor}`,
			borderLeft: `3px solid ${bubbleColor}`,
		},
	};

	return (
		<div style={bubbleStyles} className='text-xs md:text-sm w-[170px] md:w-[200px]'>
			{text}
			<div style={directionStyles[direction]}></div>
		</div>
	);
};