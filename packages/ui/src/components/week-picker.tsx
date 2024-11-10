'use client'

import { eachWeekOfInterval, endOfWeek, format, startOfYear } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { SelectedDateRange, cn } from '..';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';
interface WeekPickerProps {
  selectedWeek?: SelectedDateRange
  onSelect: (week: { start: Date; end: Date }) => void;
  className?: string;
}

export const WeekPicker: React.FC<WeekPickerProps> = ({ selectedWeek, onSelect, className }) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  let weeks = [
    ...eachWeekOfInterval({
      start: startOfYear(new Date((currentYear - 1).toString())),
      end: endOfWeek(currentDate),
    }),
  ];

  // Reorder weeks from latest to earliest
  weeks = weeks.sort((a, b) => b.getTime() - a.getTime());

  const [value, setValue] = useState<SelectedDateRange | undefined>(selectedWeek);
  const [search, setSearch] = useState('');
  const [filteredWeeks, setFilteredWeeks] = useState(weeks);

  useEffect(() => {
    setFilteredWeeks(
      weeks.filter((week) =>
        format(week, 'MM/dd/yyyy').includes(search)
      )
    );
  }, [search]); // Added weeks as a dependency to useEffect

  return (
    <Select
      value={`${format(value?.start ?? new Date(), 'MM/dd/yyyy')}-${format(value?.end ?? new Date(), 'MM/dd/yyyy')}`}
      onValueChange={(week: string) => {
        const [start, end] = week.split('-').map((date) => new Date(date));
        let weekObj = { start, end } as SelectedDateRange;
        setValue(weekObj);
        onSelect(weekObj);
      }}
    >
      <SelectTrigger>
        {value?.start.toLocaleDateString()}-{value?.end.toLocaleDateString()}
      </SelectTrigger>
      <SelectContent className={cn("max-h-48 overflow-y-auto", className)}>
        <div className="p-2">
      <input
          className='w-full p-2 border rounded'
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search month..."
        />
        </div>
        {filteredWeeks.map((weekStart, index) => {
          const weekEnd = endOfWeek(weekStart);
          return (
            <SelectItem key={index} value={`${format(weekStart, 'MM/dd/yyyy')}-${format(weekEnd, 'MM/dd/yyyy')}`}>
              {weekStart.toLocaleDateString()}-{weekEnd.toLocaleDateString()}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};