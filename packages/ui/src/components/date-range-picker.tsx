import React from 'react';
import { DatePicker } from './date-picker';
import { startOfDay, endOfDay } from 'date-fns';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onStartDateSelected: (date: Date) => void;
  onEndDateSelected: (date: Date) => void;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateSelected,
  onEndDateSelected,
}) => {
  return (
    <div className='flex flex-col lg:flex-row justify-center items-center gap-2'>
      <DatePicker
        selectedDate={startDate}
        onSelect={(date: Date) => {
          // using datefns we set the start of the day start date
          onStartDateSelected?.(startOfDay(date))
        }}
        className='text-black w-[165px] lg:w-[280px]'
      />
      <DatePicker
        selectedDate={endDate}
        onSelect={(date: Date) => {onEndDateSelected?.(endOfDay(date))}}
        className='text-black w-[165px] lg:w-[280px]'
      />
    </div>
  );
};