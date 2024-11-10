// src/models/brandModels.ts

export interface Brand {
	id?: string;
	name: string;
	otter_id: string;
	store_ids: string[];
	org_id?: string;
	is_active?: boolean;
	brand_image_url: string;
	item_classification_ids: string[];
}