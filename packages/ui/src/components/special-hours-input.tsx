'use client';
import React, { useState, useEffect } from 'react';
import { StorefrontSpecialHours, StorefrontTimeRange, SpecialHourType } from '../models/hoursModels';
import { TimeRangeInput } from './time-range-input';
import { Button } from './ui/button';
import { DatePicker } from './date-picker';

interface SpecialHoursInputProps {
  specialHours?: StorefrontSpecialHours;
  onChange: (updatedSpecialHours: StorefrontSpecialHours) => void;
}

export const SpecialHoursInput: React.FC<SpecialHoursInputProps> = ({ specialHours, onChange }) => {
  // Default time range values
  const defaultTimeRange = { start_time: '', end_time: '' };
  
  // States with default values or values from props
  const [date, setDate] = useState<Date>(specialHours?.date || new Date());
  const [specialHourType, setSpecialHourType] = useState<SpecialHourType>(specialHours?.special_hour_type || SpecialHourType.OPEN);
  const [timeRanges, setTimeRanges] = useState<StorefrontTimeRange[]>(specialHours?.time_ranges || [defaultTimeRange]);

  // Whenever the local state changes, propagate the changes upwards
  useEffect(() => {
    onChange({
      date: date,
      time_ranges: timeRanges.length > 0 ? timeRanges : [defaultTimeRange], // Ensure we always have at least one time range
      special_hour_type: specialHourType,
    });
  }, [date, timeRanges, specialHourType, onChange]);

  // Handlers for each type of change
  const handleDateChange = (selectedDate: Date) => setDate(selectedDate);
  const handleSpecialHourTypeChange = (type: SpecialHourType) => setSpecialHourType(type);
  const handleTimeRangeChange = (index: number, updatedTimeRange: StorefrontTimeRange) => {
    const updatedTimeRanges = timeRanges.map((range, i) => (i === index ? updatedTimeRange : range));
    setTimeRanges(updatedTimeRanges);
  };

  // Add or remove time range
  const handleAddTimeRange = () => setTimeRanges([...timeRanges, defaultTimeRange]);
  const handleRemoveTimeRange = (index: number) => setTimeRanges(timeRanges.filter((_, i) => i !== index));

  // JSX for the component
  return (
    <div className="space-y-2">
      <DatePicker
        selectedDate={date}
        onSelect={handleDateChange}
      />
      <select
        value={specialHourType}
        onChange={(e) => handleSpecialHourTypeChange(e.target.value as SpecialHourType)}
        className="px-4 py-2 border rounded"
      >
        {Object.values(SpecialHourType).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      {timeRanges.map((timeRange, index) => (
        <div key={index} className="flex items-center space-x-2">
          <TimeRangeInput
            timeRange={timeRange}
            onChange={(updatedTimeRange) => handleTimeRangeChange(index, updatedTimeRange)}
          />
          {timeRanges.length > 1 && (
            <Button
              className="bg-secondary-pink-salmon py-1 px-3 rounded"
              onClick={() => handleRemoveTimeRange(index)}
            >
              Remove
            </Button>
          )}
        </div>
      ))}
      <Button onClick={handleAddTimeRange} className="mt-2 rounded">
        Add Time Range
      </Button>
    </div>
  );
};
