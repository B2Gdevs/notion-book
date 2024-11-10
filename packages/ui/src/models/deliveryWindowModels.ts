// src/models/deliveryWindowModels.ts

export interface DeliveryWindow {
	id?: string;
	area_id: string;
	org_ids: string[];
	timezone?: string;
	order_rebatch_cutoff_scheduler_id?: string;
	order_cutoff_scheduler_id?: string;
	delivery_time?: string; // Time string in 'HH:MM' format
	delivery_time_window_off_set?: number;
	kitchen_prep_time?: string; // Time string in 'HH:MM' format
	order_cutoff_time?: string; // Time string in 'HH:MM' format
	is_active?: boolean;
	reminders_scheduler_id?: string;
	is_default?: boolean;
}