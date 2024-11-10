// courierModels.ts

import { User } from "./userModels";

export enum ColorfullCourierStatus {
	COURIER_ASSIGNED = 'COURIER_ASSIGNED',
	COURIER_ON_ROUTE_TO_PICKUP = 'COURIER_ON_ROUTE_TO_PICKUP',
	COURIER_ARRIVED = 'COURIER_ARRIVED',
	COURIER_PICKED_UP_FOOD = 'COURIER_PICKED_UP_FOOD',
	COURIER_COMPLETED = 'COURIER_COMPLETED',
}

export interface ColorfullPersonalIdentifiers {
	taxIdentificationNumber?: string;
}

export interface ColorfullCourier extends User {
	area_id?: string;
	order_count?: number;
	order_capacity?: number;
	status?: ColorfullCourierStatus;
	last_location?: string;
	last_location_time?: string;
	last_location_latitude?: number;
	last_location_longitude?: number;
	current_order_capacity?: number;
	current_batch_ids?: string[];
	current_job_id?: string;
}
