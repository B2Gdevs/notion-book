export interface BatchRunResult {
	id: string;
	batch_ids: string[];
	job_ids: string[];
	order_ids: string[];
	org_ids: string[];
    job_total_ids: string[];
	store_org_ids: string[];
	created_at: string;
	updated_at: string;
	area_id: string;
}
