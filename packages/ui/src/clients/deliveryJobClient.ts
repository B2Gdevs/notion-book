// src/clients/deliveryJobClient.ts

import { BatchOrder } from '../models/batchOrderModels';
import { DeliveryJob, DeliveryJobStatus } from '../models/deliveryJobModels';
import { BaseClient } from './baseClient';

export interface DeliveryJobQueryParams {
	page?: number;
	pageSize?: number;
	status?: DeliveryJobStatus;
	jobIds?: string[]; 
	startDate?: string; // ISO 8601 format
	endDate?: string; // ISO 8601 format
	sortBy?: string;
	sortDirection?: 'asc' | 'desc';
	area_id?: string;
	dateTimeField?: string; // New filter parameter for date time field
}

export class DeliveryJobClient extends BaseClient {
	public static async createDeliveryJob(
		deliveryJob: DeliveryJob,
		token: string | null
	): Promise<DeliveryJob> {
		const endpoint = `/delivery-jobs`;
		return this.postData(endpoint, deliveryJob, token, null);
	}

	public static async getDeliveryJobById(
		deliveryJobId: string,
		token: string | null
	): Promise<DeliveryJob> {
		const endpoint = `/delivery-jobs/${deliveryJobId}`;
		return this.fetchData(endpoint, token, null);
	}

	public static async updateDeliveryJob(
		deliveryJobId: string,
		deliveryJobData: DeliveryJob,
		token: string | null
	): Promise<DeliveryJob> {
		const endpoint = `/delivery-jobs/${deliveryJobId}`;
		return this.putData(endpoint, deliveryJobData, token, null);
	}

	public static async deleteDeliveryJob(
		deliveryJobId: string,
		token: string | null
	): Promise<{ message: string }> {
		const endpoint = `/delivery-jobs/${deliveryJobId}`;
		return this.deleteData(endpoint, token, null);
	}

	public static async getDeliveryJobs(
		params: DeliveryJobQueryParams,
		token: string | null
	): Promise<DeliveryJob[]> {
		const endpoint = `/delivery-jobs?${this.constructQueryString(params)}`;
		return this.fetchData(endpoint, token, null);
	}

	private static constructQueryString(params: DeliveryJobQueryParams): string {
		const queries = [];
		if (params.page) {
			queries.push(`page=${params.page}`);
		}
		if (params.pageSize) {
			queries.push(`page_size=${params.pageSize}`);
		}
		if (params.status) {
			queries.push(`status=${params.status}`);
		}
		if (params.jobIds) {
			queries.push(`job_ids=${encodeURIComponent(params.jobIds.join(','))}`);
		}
		if (params.startDate) {
			queries.push(`start_date=${encodeURIComponent(params.startDate)}`);
		}
		if (params.endDate) {
			queries.push(`end_date=${encodeURIComponent(params.endDate)}`);
		}
		if (params.sortBy) {
			queries.push(`sort_by=${params.sortBy}`);
		}
		if (params.sortDirection) {
			queries.push(`sort_direction=${params.sortDirection}`);
		}
		if (params.area_id) {
			queries.push(`area_id=${params.area_id}`);
		}
		if (params.dateTimeField) {
			queries.push(`datetime=${params.dateTimeField}`);
		}
		return queries.join('&');
	}

	public static async getBatchOrdersByJobId(
		jobId: string,
		token: string | null
	): Promise<BatchOrder[]> {
		const endpoint = `/delivery-jobs/${jobId}/batch-orders`;
		return this.fetchData(endpoint, token, null);
	}
}