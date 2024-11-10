import { parseISO, isBefore, setHours, setMinutes, startOfDay, isEqual } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { Area } from '..';


/**
 * Determines if the selected date and time is past the order cutoff time.
 * this ignores the time of the selected date and puts the cutoff time on the selected date.
 * 
 * @param cutoffTimeString The cutoff time in "HH:MM" format.
 * @param areaTimezone The timezone of the area, defaults to 'UTC'.
 * @param selectedDateString The selected date in ISO format.
 * @returns true if the selected date and time are past the cutoff time, otherwise false.
 */
export function isPastOrderTime(cutoffTimeString: string, areaTimezone: string = 'UTC', selectedDateString: string): boolean {
    // Get the current date and time in the area's timezone
    const nowInAreaTimezone: Date = utcToZonedTime(new Date(), areaTimezone);

    const isToday: boolean = isTodayInArea(selectedDateString, areaTimezone);

    // Start of the selected day in the area's timezone
    const selectedDayInAreaTimezone: Date = startOfDay(utcToZonedTime(parseISO(selectedDateString), areaTimezone));

    // Extract cutoffHour and cutoffMinute from cutoffTimeString
    const [cutoffHour, cutoffMinute]: number[] = cutoffTimeString.split(':').map(Number);

    // Create a cutoff time date object for the selected day (or today) in the area's timezone
    const cutoffTime: Date = utcToZonedTime(setMinutes(setHours(selectedDayInAreaTimezone, cutoffHour), cutoffMinute), areaTimezone);

    // If the selected date is today, compare now with the cutoff time
    if (isToday) {
        let isCutoffTimeBeforeTheAreasTimezone = isBefore(cutoffTime, nowInAreaTimezone);
        return isCutoffTimeBeforeTheAreasTimezone;
    } else {
        // If the selected date is not today
        // If the selected date is in the future relative to 'now', it's not past the cutoff time yet
        // This comparison ignores the time part, considering only the date part

        if (!isBefore(selectedDayInAreaTimezone, nowInAreaTimezone)) {

            return false;
        } else {
            // If the selected date is in the past, it's technically past the cutoff time of its day
            return true;
        }
    }
}



export function isTodayInArea(selectedDateString: string, areaTimezone: string = 'UTC'): boolean {
    // Get the current date and time in the area's timezone
    const nowInAreaTimezone: Date = utcToZonedTime(new Date(), areaTimezone);

    // Parse the selected date string to a Date object
    const selectedDate: Date = new Date(selectedDateString);

    // Check if the selected date is today in the area's timezone
    const isToday: boolean = isEqual(startOfDay(nowInAreaTimezone), startOfDay(selectedDate));

    return isToday;
}

export const convertTo12HourFormat = (time: string) => {
    const [hour, minute] = time.split(':').map(Number);
    const meridiem = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = ((hour + 11) % 12 + 1); // Converts 0-23 hour format to 1-12 format
    return `${formattedHour}:${minute < 10 ? `0${minute}` : minute} ${meridiem}`;
  };


  export const timeToCronFormat = (time: string, minuteOffset: number = 0, hourOffset: number = 0) => {
    let [hour, minute] = time.split(':').map(Number);

    // Apply minute and hour offsets
    minute += minuteOffset;
    hour += hourOffset;

    // Adjust for overflow or underflow in minutes and hours
    while (minute >= 60) {
        minute -= 60;
        hour++;
    }
    while (minute < 0) {
        minute += 60;
        hour--;
    }

    const daysOfWeek = "1-5";

    // Note: Cron syntax does not support negative values or direct day/month offsets.
    // This implementation assumes the caller adjusts the time parameters within valid ranges.
    return `${minute} ${hour} * * ${daysOfWeek}`;
};


export const createTimezonedDateForArea = (area: Area): Date => {
    const areaTimezone = area?.timezone || 'America/Chicago'; // Default to 'America/Chicago' if timezone is undefined
    const nowInAreaTimezone: Date = utcToZonedTime(new Date(), areaTimezone);
    return nowInAreaTimezone
}