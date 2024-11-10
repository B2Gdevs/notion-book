'use client'
import { StorefrontTimeRange } from '../models/hoursModels';
// TimeRangeInput.tsx
import React from 'react';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface TimeRangeInputProps {
  timeRange: StorefrontTimeRange;
  onChange: (updatedTimeRange: StorefrontTimeRange) => void;
}

export const TimeRangeInput: React.FC<TimeRangeInputProps> = ({ timeRange, onChange }) => {
  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...timeRange, start_time: e.target.value });
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...timeRange, end_time: e.target.value });
  };

  return (
    <div className="flex space-x-2 bg-primary-almost-black/20 justify-center items-center p-2 rounded-xl">
      <div className='flex flex-col space-y-2'>
        <Label>Start</Label>
        <Input
          type="time"
          value={timeRange.start_time}
          onChange={handleStartChange}
          className="px-4 py-2 border rounded"
        />
      </div>
      <div className='flex flex-col space-y-2'>
        <Label>End</Label>
        <Input
          type="time"
          value={timeRange.end_time}
          onChange={handleEndChange}
          className="px-4 py-2 border rounded"
        />
      </div>
    </div>
  );
};
