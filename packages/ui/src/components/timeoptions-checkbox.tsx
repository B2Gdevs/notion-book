import React, { useState } from 'react';
import { Checkbox } from './checkbox';
import { Collapsible } from './collapsible';

export enum TimeOption {
	ANYTIME = 'Anytime',
	TWELVE_HOURS_BEFORE = '12 hours before next day',
}

interface TimeOptionsCheckboxProps {
	onSelectOption?: (option: TimeOption) => void;
}

export const TimeOptionsCheckbox: React.FC<TimeOptionsCheckboxProps> = ({
	onSelectOption,
}) => {
	const [selectedOption, setSelectedOption] = useState<TimeOption | null>(null);

	const handleCheckboxChange = (option: TimeOption) => {
		setSelectedOption(option);
	};

	React.useEffect(() => {
		if (onSelectOption && selectedOption) {
			onSelectOption(selectedOption);
		}
	}, [selectedOption, onSelectOption]);

	return (
		<Collapsible
			className='bg-gray-200'
			stepHeaderProps={{ text: 'Choose time', step: '' }}
			expanded={true}
			chevronOnRight={true}
		>
			<div className='mt-2'>
				{Object.values(TimeOption).map((option) => (
					<div key={option} className='mt-1'>
						<Checkbox
							checked={selectedOption === option}
							onClick={() => handleCheckboxChange(option)}
							text={option}
						/>
					</div>
				))}
			</div>
		</Collapsible>
	);
};
