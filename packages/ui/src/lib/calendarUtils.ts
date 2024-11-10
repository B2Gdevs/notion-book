import { CalendarEvent } from '../models/calendarModels';


/**
 * Checks if the given date is a holiday.
 * @param dateStr The date string in 'YYYY-MM-DD' format.
 * @param holidays Array of CalendarEvent representing holidays.
 * @returns boolean indicating if the date is a holiday.
 */
export const getHolidayOfDate = (dateStr?: string, holidays?: CalendarEvent[]): CalendarEvent | null => {
  if (!dateStr || !holidays) {
    return null;
  }

  const date = new Date(dateStr);
  const holiday = holidays.find(holiday => {
    const holidayDate = new Date(holiday.start.date);
    return holidayDate.toDateString() === date.toDateString();
  });

  return holiday || null;
};


