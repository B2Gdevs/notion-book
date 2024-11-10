// src/models/batchOrderModels.ts

export enum BatchOrderStatus {
	PREPARING = 'UNASSIGNED',
	READY = 'READY',
	ASSIGNED = 'ASSIGNED',
	DELIVERED = 'DELIVERED',
	CANCELLED = 'CANCELLED',
}

export interface BatchOrder {
	id?: string;
	org_id: string;
	area_id: string;
	courier_id?: string;
	order_ids: string[];
	created_at?: string; // ISO date string
	scheduled_delivery_time?: string; // ISO date string
	status?: BatchOrderStatus;
}
