import { PaymentStatus } from "./stripeModels";


export enum DeliveryJobStatus {
	PENDING = 'PENDING',
	IN_PROGRESS = 'IN_PROGRESS',
    SENT_TO_KITCHEN = "SENT_TO_KITCHEN",
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
    COMPLETED_NO_REVENUE = "COMPLETED_NO_REVENUE"
}

export enum TransferStatus {
	PENDING = 'PENDING',
	IN_PROGRESS = 'IN_PROGRESS',
	COMPLETED = 'COMPLETED',
	CANCELLED = 'CANCELLED',
}

export interface DeliveryJob {
	id?: string;
	org_id: string;
	courier_ids: string[];
	batch_ids: string[];
	job_total_id?: string;
	status: DeliveryJobStatus;
	created_at?: string; // ISO date string
	updated_at?: string; // ISO date string
	payment_status?: PaymentStatus;
	payment_intent_id?: string;
	delivery_fee?: number;
	transfer_status?: TransferStatus;
	delivery_date?: string; // ISO date string
	area_id?: string;
	note?: string; // New field added
}
