export interface MenuTimeRange {
    start?: string; // Start time of the range in 24-hour format, e.g., "08:00"
    end?: string; // End time of the range in 24-hour format, e.g., "17:00"
  }
  
  export interface MenuRegularHours {
    days: DayOfWeek[]; // Array of days of the week
    time_ranges: MenuTimeRange[]; // Array of time ranges
  }


export interface MenuSpecialHours {
    date: string; // Day of the week
    time_ranges: MenuTimeRange[]; // Array of time ranges
    type: string; // Store state that should be applied during the configured special hour
  }
  
  export interface MenuHoursConfiguration {
    regular_hours?: MenuRegularHours[]; // Optional array of regular hours configurations
    special_hours?: MenuSpecialHours[]; // Optional array of special hours configurations
    time_zone: string; // Time zone identifier, e.g., "America/Chicago"
  }

export enum DayOfWeek {
    MONDAY = 'MONDAY',
    TUESDAY = 'TUESDAY',
    WEDNESDAY = 'WEDNESDAY',
    THURSDAY = 'THURSDAY',
    FRIDAY = 'FRIDAY',
    SATURDAY = 'SATURDAY',
    SUNDAY = 'SUNDAY'
}

export interface StorefrontTimeRange {
    start_time?: string;
    end_time?: string;
}

export enum SpecialHourType {
    OPEN = 'OPEN',
    CLOSED = 'CLOSED'
}

export interface StorefrontSpecialHours {
    date: Date;
    time_ranges: StorefrontTimeRange[];
    special_hour_type: SpecialHourType;
}

export interface StorefrontRegularHours {
    day_of_week: DayOfWeek;
    time_ranges: StorefrontTimeRange[];
}

export interface StoreHours {
    regular_hours?: StorefrontRegularHours[];
    special_hours?: StorefrontSpecialHours[];
}

export interface StoreHoursConfiguration {
    delivery_hours?: StoreHours;
    pickup_hours?: StoreHours;
    timezone: string;
}