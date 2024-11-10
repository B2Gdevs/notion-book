import React, { useState } from 'react';
import { DayOfWeek } from '../models/hoursModels';
import { Checkbox } from './checkbox';
import { Collapsible } from './collapsible';

interface WeekDaysCheckboxProps {
	onSelectDays?: (days: DayOfWeek[]) => void;
}

export const WeekDaysCheckbox: React.FC<WeekDaysCheckboxProps> = ({
	onSelectDays,
}) => {
	const [selectedDays, setSelectedDays] = useState<DayOfWeek[]>([]);

	const handleCheckboxChange = (day: DayOfWeek) => {
		if (selectedDays.includes(day)) {
			setSelectedDays(selectedDays.filter((d) => d !== day));
		} else {
			setSelectedDays([...selectedDays, day]);
		}
	};

	React.useEffect(() => {
		if (onSelectDays) {
			onSelectDays(selectedDays);
		}
	}, [selectedDays, onSelectDays]);

	const capitalize = (s: string) =>
		s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

	const disabledDays = [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY]; // Add the days you want to disable

	return (
		<Collapsible
			className='bg-gray-200'
			stepHeaderProps={{ text: 'Choose day(s)', step: '' }}
			expanded={true}
			chevronOnRight={true}
		>
			<div className='mt-2'>
				{Object.values(DayOfWeek).map((day) => (
					<div key={day} className='mt-1'>
						<Checkbox
							checked={selectedDays.includes(day)}
							onClick={() => handleCheckboxChange(day)}
							disabled={disabledDays.includes(day)} // Disable the checkbox if the day is included in disabledDays
							text={capitalize(day)}
						/>
					</div>
				))}
			</div>
		</Collapsible>
	);
};
