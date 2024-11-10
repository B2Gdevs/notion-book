'use client'
// RegularHoursInput.tsx
import React, { useState } from 'react';
import { DayOfWeek, StorefrontRegularHours, StorefrontTimeRange } from '../models/hoursModels';
import { WeekDaySelect } from './week-day-select';
import { TimeRangeInput } from './time-range-input';
import { Button } from './ui/button';
import { Label } from '@radix-ui/react-label';

interface RegularHoursInputProps {
    regularHours?: StorefrontRegularHours; // regularHours is optional
    onChange: (updatedRegularHours: StorefrontRegularHours) => void; // Must always receive a StorefrontRegularHours object
}

export const RegularHoursInput: React.FC<RegularHoursInputProps> = ({ regularHours, onChange }) => {
    // Provide a default day_of_week if regularHours is not defined
    const defaultDayOfWeek = regularHours?.day_of_week || DayOfWeek.MONDAY;

    // Initialize state with existing time ranges or a default time range
    const [timeRanges, setTimeRanges] = useState<StorefrontTimeRange[]>(
        regularHours && regularHours.time_ranges.length > 0 ? regularHours.time_ranges : []
    );

    const handleDayChange = (day: DayOfWeek) => {
        // Ensure that a day_of_week is always defined when calling onChange
        onChange({ day_of_week: day, time_ranges: timeRanges });
    };

    const handleTimeRangeChange = (index: number, updatedTimeRange: StorefrontTimeRange) => {
        const updatedTimeRanges = timeRanges.map((range, i) =>
            i === index ? updatedTimeRange : range
        );
        setTimeRanges(updatedTimeRanges);
        // Use the defaultDayOfWeek or the existing day when updating
        onChange({ day_of_week: defaultDayOfWeek, time_ranges: updatedTimeRanges });
    };

    const handleAddTimeRange = () => {
        const newTimeRange = { start_time: '09:00', end_time: '17:00' };
        const updatedTimeRanges = [...timeRanges, newTimeRange];
        setTimeRanges(updatedTimeRanges);
        // Use the defaultDayOfWeek or the existing day when updating
        onChange({ day_of_week: defaultDayOfWeek, time_ranges: updatedTimeRanges });
    };

    const handleRemoveTimeRange = (index: number) => {
        const updatedTimeRanges = timeRanges.filter((_, i) => i !== index);
        setTimeRanges(updatedTimeRanges);
        // Use the defaultDayOfWeek or the existing day when updating
        onChange({ day_of_week: defaultDayOfWeek, time_ranges: updatedTimeRanges });
    };

    return (
        <div className="space-y-2">
            <Label className='border-b-2 border-black'>Day of Week</Label>
            <WeekDaySelect
                selectedDay={defaultDayOfWeek}
                onSelectDay={handleDayChange}
            />
            <Label className='border-b-2 border-black'>Store Hours</Label>
            {timeRanges.map((timeRange, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <TimeRangeInput
                        timeRange={timeRange}
                        onChange={(updatedTimeRange) => handleTimeRangeChange(index, updatedTimeRange)}
                    />
                    <Button
                        className="bg-secondary-pink-salmon py-1 px-3 rounded"
                        onClick={() => handleRemoveTimeRange(index)}
                    >
                        Remove
                    </Button>
                </div>
            ))}
            <Button onClick={handleAddTimeRange} className="mt-2 rounded">
                Add Time Range
            </Button>
        </div>
    );
};
