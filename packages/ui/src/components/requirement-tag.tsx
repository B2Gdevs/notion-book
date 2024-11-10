import React from 'react';

export interface RequirementTagProps {
	label?: string;
	type?: 'optional' | 'required' | string;
}

export const RequirementTag: React.FC<RequirementTagProps> = ({
	label,
	type = 'required',
}) => {
	const validType = type === 'optional' ? 'optional' : 'required';
	return (
		<div className='flex flex-row gap-2 justify-center items-center'>
			<div className='w-fit text-zinc-800 text-sm font-normal font-righteous leading-normal whitespace-nowrap'>
				{label}
			</div>
			<div
				className={`w-14 h-5 px-2 py-1 rounded-sm justify-center items-center inline-flex font-sans ${
					validType === 'required'
						? 'bg-secondary-corn-yellow'
						: 'border border-secondary-corn-yellow'
				}`}
			>
				<div className="text-zinc-800 text-[8px]  font-sans">
					{validType.charAt(0).toUpperCase() + validType.slice(1)}
				</div>
			</div>
		</div>
	);
};
