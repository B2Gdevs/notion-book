import { describe, it, expect } from 'vitest';
import { getMenuHoursByDay } from '../menuUtils';
import { Menu } from '../../models/menuModels';
import { DayOfWeek } from '../../models/hoursModels';

describe('getMenuHoursByDay', () => {
  it('should return the correct hours for a given day', () => {
    const menu: Menu = {
      id: '1',
      store_id: '1',
      name: 'Test Menu',
      is_active: true,
      hours: {
        regular_hours: [
          { days: [DayOfWeek.MONDAY], time_ranges: [{ start: '09:00', end: '17:00' }] },
          { days: [DayOfWeek.TUESDAY], time_ranges: [{ start: '10:00', end: '18:00' }] }
        ],
        time_zone: 'America/New_York' // Add the required time_zone property
      }
    };

    const result = getMenuHoursByDay(menu, 'monday');
    expect(result).toEqual([{ days: [DayOfWeek.MONDAY], time_ranges: [{ start: '09:00', end: '17:00' }] }]);
  });

  it('should handle case sensitivity', () => {
    const menu: Menu = {
      id: '1',
      is_active: true,
      store_id: '1',
      name: 'Test Menu',
      hours: {
        regular_hours: [
          { days: [DayOfWeek.MONDAY], time_ranges: [{ start: '09:00', end: '17:00' }] }
        ],
        time_zone: 'America/New_York' // Add the required time_zone property
      }
    };

    const result = getMenuHoursByDay(menu, 'Monday');
    expect(result).toEqual([{ days: ['MONDAY'], time_ranges: [{ start: '09:00', end: '17:00' }] }]);
  });

  it('should return an empty array if no hours match the day', () => {
    const menu: Menu = {
      id: '1',
      is_active: true,
      store_id: '1',
      name: 'Test Menu',
      hours: {
        regular_hours: [
          { days: [DayOfWeek.WEDNESDAY], time_ranges: [{ start: '09:00', end: '17:00' }] }
        ],
        time_zone: 'America/New_York' // Add the required time_zone property
      }
    };

    const result = getMenuHoursByDay(menu, 'monday');
    expect(result).toEqual([]);
  });

  it('should return undefined if the menu has no hours defined', () => {
    const menu: Menu = {
      id: '1',
      is_active: true,
      store_id: '1',
      name: 'Test Menu',
      hours: undefined
    };

    const result = getMenuHoursByDay(menu, 'monday');
    expect(result).toBeUndefined();
  });
});