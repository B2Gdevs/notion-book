import { Area, LoweredDayOfWeek } from 'ui';

/**
 * Retrieves store and brand IDs scheduled for a given day.
 * 
 * @param areas - Array of Area objects.
 * @param day - The day of the week to filter schedules by.
 * @returns An object containing arrays of store IDs and brand IDs.
 */
export function getStoresAndBrandsByDay(areas: Area[], day: LoweredDayOfWeek) {
  const storeIds: string[] = [];

  areas?.forEach(area => {
    area.schedule?.organizations.forEach(org => {
      const { store_schedule } = org;

      // Check if the day is in the schedules for stores
      Object.entries(store_schedule.schedules ?? {}).some(([storeId, days]) => {
        if (days.includes(day)) {
          storeIds.push(storeId);
        }
      });


    });
  });

  return { storeIds};
}

