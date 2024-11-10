'use client'

import { eachMonthOfInterval, endOfMonth, format, startOfYear } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { SelectedDateRange, cn } from '..';
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select';

interface MonthPickerProps {
    selectedMonth?: SelectedDateRange;
    onSelect: (month: SelectedDateRange) => void;
    className?: string;
}

export const MonthPicker: React.FC<MonthPickerProps> = ({ selectedMonth, onSelect, className }) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    let months = [
      ...eachMonthOfInterval({
        start: startOfYear(new Date((currentYear - 1).toString())),
        end: endOfMonth(currentDate),
      }),
    ];
  
    // Reorder months from latest to earliest
    months = months.sort((a, b) => b.getTime() - a.getTime());
  
    const [value, setValue] = useState<SelectedDateRange | undefined>(selectedMonth);
    const [search, setSearch] = useState('');
    const [filteredMonths, setFilteredMonths] = useState(months);
  
    useEffect(() => {
      setFilteredMonths(
        months.filter((month) =>
          format(month, 'MM/yyyy').includes(search)
        )
      );
    }, [search]); 

    return (
        <Select
            value={`${format(value?.start ?? new Date(), 'MM/yyyy')}`}
            onValueChange={(monthString: string) => {
                const [month, year] = monthString.split('/');
                const start = new Date(parseInt(year), parseInt(month) - 1, 1);
                const end = endOfMonth(start);
                let monthObj = { start, end } as SelectedDateRange;
                setValue(monthObj);
                onSelect(monthObj);
            }}
        >
            <SelectTrigger>
                {format(value?.start ?? new Date(), 'MM/yyyy')}
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
                {filteredMonths.map((monthStart, index) => {
                    return (
                        <SelectItem key={index} value={`${format(monthStart, 'MM/yyyy')}`}>
                            {format(monthStart, 'MMMM yyyy')}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
};