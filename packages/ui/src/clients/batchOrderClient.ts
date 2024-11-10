import { BatchOrder, BatchOrderStatus } from '../models/batchOrderModels';
import { BaseClient } from './baseClient';

export interface BatchOrderQueryParams {
	page?: number;
	pageSize?: number;
	status?: BatchOrderStatus;
	orderIds?: string; // Comma-separated list of order IDs
	startDate?: string; // ISO 8601 format
	endDate?: string; // ISO 8601 format
	sortBy?: string;
	sortDirection?: 'asc' | 'desc';
}

export class BatchOrderClient extends BaseClient {
	public static async createBatchOrder(
		batchOrder: BatchOrder,
		token: string | null
	): Promise<BatchOrder> {
		const endpoint = `/batch-orders`;
		return this.postData(endpoint, batchOrder, token, null);
	}

	public static async getBatchOrderById(
		batchOrderId: string,
		token: string | null
	): Promise<BatchOrder> {
		const endpoint = `/batch-orders/${batchOrderId}`;
		return this.fetchData(endpoint, token, null);
	}

	public static async updateBatchOrder(
		batchOrderId: string,
		batchOrderData: BatchOrder,
		token: string | null
	): Promise<BatchOrder> {
		const endpoint = `/batch-orders/${batchOrderId}`;
		return this.putData(endpoint, batchOrderData, token, null);
	}

	public static async deleteBatchOrder(
		batchOrderId: string,
		token: string | null
	): Promise<{ message: string }> {
		const endpoint = `/batch-orders/${batchOrderId}`;
		return this.deleteData(endpoint, token, null);
	}

	public static async getBatchOrders(params: BatchOrderQueryParams, token: string | null): Promise<BatchOrder[]> {
		const endpoint = `/batch-orders?${this.constructQueryString(params)}`;
		return this.fetchData(endpoint, token, null);
	}

	private static constructQueryString(params: BatchOrderQueryParams): string {
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
		if (params.orderIds) {
			queries.push(`order_ids=${encodeURIComponent(params.orderIds)}`);
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
		return queries.join('&');
	}

	public static async getBatchOrdersByIds(
		batchOrderIds: string[],
		token: string | null
	): Promise<BatchOrder[]> {
		if (!batchOrderIds || batchOrderIds.length === 0) return [];
		const endpoint = `/batch-orders?ids=${batchOrderIds.join(',')}`;
		return this.fetchData(endpoint, token, null);
	}

	public static async startBatchOrderProcessing(
		token: string | null
	): Promise<{ message: string; }> {
		const endpoint = `/batch-orders/process`;
		return this.postData(endpoint, {}, token, null);
	}
}