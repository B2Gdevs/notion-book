'use client'
// WeekDaySelect.tsx
import React from 'react';
import { DayOfWeek } from '../models/hoursModels';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';

interface WeekDaySelectProps {
    selectedDay?: DayOfWeek;
    onSelectDay: (day: DayOfWeek) => void;
}

export const WeekDaySelect: React.FC<WeekDaySelectProps> = ({ selectedDay, onSelectDay }) => {
    return (
        <Select value={selectedDay} onValueChange={onSelectDay}>
            <SelectTrigger aria-label="Day of Week">
                {selectedDay || 'Select Day'}
            </SelectTrigger>
            <SelectContent>
                {Object.values(DayOfWeek).map((day) => (
                    <SelectItem key={day} value={day}>
                        {day}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
