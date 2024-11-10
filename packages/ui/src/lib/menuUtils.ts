'use client';
import moment from 'moment-timezone';
import { Area, DayOfWeek, Menu } from '..';

export const areMenusAvailableAtThisTime = (selectedDate: Date, menus: Menu[], area: Area): Record<string, boolean> => {
    const areaTimezone = area?.timezone || 'America/Chicago'; // Default to 'America/Chicago' if timezone is undefined
    const currentTime = moment().tz(areaTimezone);

    // if currentTime is not the same Date as the selected, check if the day is listed in the menu hours
    if (!moment(selectedDate).isSame(currentTime, 'day')) {
        return isDayListedInMenuHours(menus, currentTime.format('dddd').toUpperCase());
    }

    return menus.reduce((acc, menu) => {
        // Explicitly check if menu.id is undefined or null and skip this menu
        if (menu.id === undefined || menu.id === null) {
            return acc;
        }

        const currentDay = currentTime.format('dddd').toUpperCase();
        const isActive = menu.is_active && (
            !menu.hours || !menu.hours.regular_hours ||
            menu.hours.regular_hours.some(regularHours => {
                if (regularHours.days.includes(DayOfWeek[currentDay as keyof typeof DayOfWeek])) {
                    return regularHours.time_ranges.some(timeRange => {
                        const startTime = moment(timeRange.start, 'HH:mm').tz(areaTimezone);
                        const endTime = moment(timeRange.end, 'HH:mm').tz(areaTimezone);
                        return currentTime.isBetween(startTime, endTime, null, '[]'); // Inclusive of start and end times
                    });
                } else {
                    // If the day listed in the menu's hours is not today, assume it's a future day and return true
                    return true;
                }
            })
        );

        // Use a non-null assertion operator (!) to assure TypeScript that menu.id is not null or undefined
        acc[menu.id] = isActive ?? true;
        return acc;
    }, {} as Record<string, boolean>);
}

export const isMenuAvailableAtThisTime = (selectedDate: Date, menu: Menu, area?: Area, timezone?: string): boolean => {
    if (!menu) return false;

    if (!menu.id) {
        console.error('Menu ID is required to check if the menu is available at this time');
        return false;
    }

    if (!menu.is_active) return false;

    if (!menu.hours || !menu.hours.regular_hours) return true;

    if (!area && !timezone) {
        console.error('Area or timezone is required to check if the menu is available at this time');
        return false;
    }

    const usedTimezone = timezone || area?.timezone || 'America/Chicago'; // Default to 'America/Chicago' if timezone is undefined
    const currentTime = moment().tz(usedTimezone);
    const currentDay = currentTime.format('dddd').toUpperCase();

    // Check if today is Saturday or Sunday
    if (currentDay === 'SATURDAY' || currentDay === 'SUNDAY') {
        return false;
    }

    // Check if the selected date is the same as the current date
    if (!moment(selectedDate).isSame(currentTime, 'day')) {
        const selectedDay = moment(selectedDate).format('dddd').toUpperCase();
        return menu.is_active && menu.hours && menu.hours.regular_hours &&
            menu.hours.regular_hours.some(regularHours => {
                return regularHours.days.includes(DayOfWeek[selectedDay as keyof typeof DayOfWeek]);
            }) || false; // Ensure a boolean is returned
    }

    return Boolean(menu.is_active && (
        !menu.hours || !menu.hours.regular_hours ||
        menu.hours.regular_hours.some(regularHours => {
            if (regularHours.days.includes(DayOfWeek[currentDay as keyof typeof DayOfWeek])) {
                return regularHours.time_ranges.some(timeRange => {
                    const startTime = moment(timeRange.start, 'HH:mm').tz(usedTimezone);
                    const endTime = moment(timeRange.end, 'HH:mm').tz(usedTimezone);
                    return currentTime.isBetween(startTime, endTime, null, '[]'); // Inclusive of start and end times
                }) || false; // Ensure a boolean is returned
            } else {
                // If the day listed in the menu's hours is not today, assume it's a future day and return true
                return true;
            }
        }) || true // Ensure a boolean is returned
    ));
}

export const isDayListedInMenuHours = (menus: Menu[], dayOfWeek: string): Record<string, boolean> => {
    const day = dayOfWeek.toUpperCase(); // Ensure the day of week is in uppercase to match keys in DayOfWeek

    return menus.reduce((acc, menu) => {
        // Explicitly check if menu.id is undefined or null and skip this menu
        if (menu.id === undefined || menu.id === null) {
            return acc;
        }

        const isDayListed = menu.is_active && (
            menu.hours && menu.hours.regular_hours &&
            menu.hours.regular_hours.some(regularHours => regularHours.days.includes(DayOfWeek[day as keyof typeof DayOfWeek]))
        );

        // Use a non-null assertion operator (!) to assure TypeScript that menu.id is not null or undefined
        acc[menu.id] = isDayListed ?? true;
        return acc;
    }, {} as Record<string, boolean>);
}


export const getMenuHoursByDay = (menu: Menu, dayOfWeek: string) => {
    const day = dayOfWeek.toUpperCase();
    return menu.hours?.regular_hours?.filter(regularHours => regularHours.days.includes(DayOfWeek[day as keyof typeof DayOfWeek]));
}

