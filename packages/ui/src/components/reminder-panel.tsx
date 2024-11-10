'use client';

import { FC, useState } from 'react';
import { DatePicker } from './date-picker';
import { Label } from './ui/label';
import { Switch } from './ui/switch';

interface ReminderPanelProps {
  // Add any props needed here
}

export const ReminderPanel: FC<ReminderPanelProps> = () => {
  const [toggleReminder, setToggleReminder] = useState(false);
  const [hoursInAdvance, setHoursInAdvance] = useState('1');
  const [unPauseDate, setStartDate] = useState<Date | undefined>();

  return (
    <div className="">
      <div className="space-y-4">
        {/* Reminder to Order */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <Label className="text-primary-spinach-green font-righteous">
              Reminder to Order
            </Label>
            <span className="text-xs text-gray-500">
              Receive a reminder to place your order.
            </span>
          </div>
          <Switch
            className="bg-primary-spinach-green"
            onChange={() => setToggleReminder(!toggleReminder)}
          />
        </div>

        {/* Friendly Reminder Schedule */}
        <div className="flex flex-col">
          <Label className="text-primary-spinach-green font-righteous">
            Friendly Reminder Schedule
          </Label>
          <span className="text-xs text-gray-500 mb-2">
            Select how many hours in advance you&apos;d like to be reminded.
          </span>
          <select
            className="mt-1 p-2 w-96 border rounded-md"
            value={hoursInAdvance}
            onChange={(e) => setHoursInAdvance(e.target.value)}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1)?.map((hour) => (
              <option key={hour} value={hour}>
                {`${hour} Hour${hour > 1 ? 's' : ''}`}
              </option>
            ))}
          </select>
        </div>

        {/* Out of Office */}
        <div className="flex flex-col">
          <Label className="text-primary-spinach-green font-righteous">
            Out of Office
          </Label>
          <span className="text-xs text-gray-500 mb-2">
            Pause reminders until this date.
          </span>
          <div className="flex gap-4">
            <div className="space-y-2 w-96">
              <DatePicker
                className="w-96 text-primary-almost-black border-primary-spinach-green hover:text-secondary-peach-orange"
                selectedDate={unPauseDate}
                onSelect={(date) => setStartDate(date)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
