import { DeliveryWindow } from '../models/deliveryWindowModels';
import { BaseClient } from './baseClient';

export interface DeliveryWindowQueryParams {
	page?: number;
	pageSize?: number;
	areaId?: string;
	isActive?: boolean;
	sortBy?: string;
	sortDirection?: 'asc' | 'desc';
	ids?: string[];
}

export class DeliveryWindowClient extends BaseClient {
	public static async createDeliveryWindow(
		deliveryWindow: DeliveryWindow,
		token: string | null
	): Promise<DeliveryWindow> {
		const endpoint = `/delivery-windows`;
		return this.postData(endpoint, deliveryWindow, token, null);
	}

	public static async getDeliveryWindowById(
		deliveryWindowId: string,
		token: string | null
	): Promise<DeliveryWindow> {
		const endpoint = `/delivery-windows/${deliveryWindowId}`;
		return this.fetchData(endpoint, token, null);
	}

	public static async updateDeliveryWindow(
		deliveryWindowId: string,
		deliveryWindowData: DeliveryWindow,
		token: string | null
	): Promise<DeliveryWindow> {
		const endpoint = `/delivery-windows/${deliveryWindowId}`;
		return this.putData(endpoint, deliveryWindowData, token, null);
	}

	public static async deleteDeliveryWindow(
		deliveryWindowId: string,
		token: string | null
	): Promise<{ message: string }> {
		const endpoint = `/delivery-windows/${deliveryWindowId}`;
		return this.deleteData(endpoint, token, null);
	}

	public static async getDeliveryWindows(params: DeliveryWindowQueryParams, token: string | null): Promise<DeliveryWindow[]> {
		const endpoint = `/delivery-windows?${this.constructQueryString(params)}`;
		return this.fetchData(endpoint, token, null);
	}

	private static constructQueryString(params: DeliveryWindowQueryParams): string {
		const queries = [];
		if (params.page) {
			queries.push(`page=${params.page}`);
		}
		if (params.pageSize) {
			queries.push(`page_size=${params.pageSize}`);
		}
		if (params.areaId) {
			queries.push(`area_id=${params.areaId}`);
		}
		if (params.isActive !== undefined) {
			queries.push(`is_active=${params.isActive}`);
		}
		if (params.sortBy) {
			queries.push(`sort_by=${params.sortBy}`);
		}
		if (params.sortDirection) {
			queries.push(`sort_direction=${params.sortDirection}`);
		}
		if (params.ids) {
			queries.push(`ids=${params.ids.join(',')}`);
		}
		return queries.join('&');
	}
}