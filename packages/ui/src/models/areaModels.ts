
export type LoweredDayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

// export interface LoweredDayOfWeek {
//   monday: 'monday';
//   tuesday: 'tuesday';
//   wednesday: 'wednesday';
//   thursday: 'thursday';
//   friday: 'friday';
//   saturday: 'saturday';
//   sunday: 'sunday';
// }

export interface StoreSchedule {
  schedules: Record<string, LoweredDayOfWeek[]>;
  brand_schedules: Record<string, LoweredDayOfWeek[]>;
}

export interface ScheduledOrg {
  orgId: string; // Organization ID
  // Deprecated: days: DayOfWeek[]; // List of days the organization has scheduled deliveries
  store_schedule: StoreSchedule; // The store schedule for the org
}

export interface Schedule {
  id?: string; // Schedule ID
  organizations: ScheduledOrg[]; // List of scheduled organizations
  // Removed: store_ids: string[]; // This is now part of StoreSchedule within ScheduledOrg
}

export interface Area {
  id?: string;
  name?: string;
  description?: string;
  image_url?: string;
  schedule?: Schedule;
  radius?: number;
  address?: string; // Address of the area
  is_active?: boolean; // Status of the area's activity
  kitchen_address?: string; // Address of the kitchen, not in the US
  org_ids?: string[]; // List of organization IDs associated with the area
  timezone?: string; // Timezone of the area
  order_cutoff_time?: string; // Expected to be in the format "HH:MM"
  order_rebatch_cutoff_time?: string;

  // area_delivery_time: Optional[str] = Field(default=time(12, 00).strftime('%H:%M'), description="Default delivery time for the area")
  area_delivery_time?: string; // Expected to be in the format "HH:MM"
  
  //  ============= DEPRECATED
  cron_schedule?: string; // The cron string for the schedule
  scheduler_job_name?: string; // The cloud scheduler job id
  scheduler_job_status?: string; // The cloud scheduler job status
  scheduler_http_target?: string; // The cloud scheduler http target
  rebatch_cron_schedule?: string;
  rebatch_scheduler_job_name?: string;
  rebatch_scheduler_job_status?: string;
  rebatch_scheduler_http_target?: string;
  // DEPRECATED =============

  order_cutoff_scheduler_id?: string;
  order_rebatch_cutoff_scheduler_id?: string;
  daily_reminders_scheduler_id?: string;

  // delivery_time_window_off_set: Optional[int] = Field(default=30, description="Default time offset for the dropoff window")
  delivery_time_window_off_set?: number;
  delivery_window_ids?: string[]; // List of ids delivery windows for the area
  // kitchen_prep_time_offset: Optional[int] = Field(default=30, description="The amount of time the kitchen needs to prepare the order against the delivery time.  such as 10 minutes")
  kitchen_prep_time?: string;

}