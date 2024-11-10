// OrderClient.ts

import { Order } from '../models/orderModels';
import { BaseClient } from './baseClient';

export interface OrderParams {
	userId?: string;
	orgId?: string;
	orderIds?: string;
	page?: number;
	pageSize?: number;
	sortBy?: string;
	sortDirection?: string;
	startDate?: Date;
	endDate?: Date;
    is_sub_order?: boolean;
	share_guest_id?: string;
	share_id?: string;
}

export class OrderClient extends BaseClient {
	public static async createOrder(order: Order, token: string | null, guestUserEmail: string | null): Promise<Order> {
		try {
			let endpoint = `/orders`;
			if (guestUserEmail) {
				endpoint += `?guest_user_email=${encodeURIComponent(guestUserEmail)}`;
			}
			return this.postData(endpoint, order, token ?? null, null); 
		} catch (error) {
			console.error("Failed to create order:", error);
			throw error; 
		}
	}

	public static async getOrderById(orderId: string, token: string | null): Promise<Order> {
		const endpoint = `/orders/${orderId}`;
		return this.fetchData(endpoint, token, null);
	}

	public static async getOrders(params: OrderParams, token: string | null): Promise<Order[]> {
		const endpoint = `/orders?${this.constructQueryString(params)}`;
		return this.fetchData(endpoint, token, null);
	}

	public static constructQueryString(params: OrderParams): string {
		const queries = [];
		if (params.userId) {
			queries.push(`user_id=${params.userId}`);
		}
		if (params.orgId) {
			queries.push(`org_id=${params.orgId}`);
		}
		if (params.orderIds) {
			queries.push(`order_ids=${params.orderIds}`);
		}
		if (params.page) {
			queries.push(`page=${params.page}`);
		}
		if (params.pageSize) {
			queries.push(`page_size=${params.pageSize}`);
		}
		if (params.sortBy) {
			queries.push(`sort_by=${params.sortBy}`);
		}
		if (params.sortDirection) {
			queries.push(`sort_direction=${params.sortDirection}`);
		}
		if (params.startDate && params.startDate instanceof Date && !isNaN(params.startDate.getTime())) {
			queries.push(`start_date=${params.startDate.toISOString()}`);
		}
		if (params.endDate && params.endDate instanceof Date && !isNaN(params.endDate.getTime())) {
			queries.push(`end_date=${params.endDate.toISOString()}`);
		}
		if (params.is_sub_order !== undefined) {
			queries.push(`is_sub_order=${params.is_sub_order}`);
		}
		if (params.share_guest_id) {
			queries.push(`share_guest_id=${params.share_guest_id}`);
		}
		if (params.share_id) {
			queries.push(`share_id=${params.share_id}`);
		}
		return queries.join('&');
	}

	public static async getOrdersByIds(orderIds: string[], token: string | null): Promise<Order[]> {
		const params: OrderParams = { orderIds: orderIds.join(',') };
		return this.getOrders(params, token);
	}

	public static async updateOrder(
		orderId: string,
		orderData: Order,
		token: string | null
	): Promise<Order> {
		const endpoint = `/orders/${orderId}`;
		return this.putData(endpoint, orderData, token, null);
	}

	public static async deleteOrder(
		orderId: string,
		token: string | null
	): Promise<{ message: string }> {
		const endpoint = `/orders/${orderId}`;
		return this.deleteData(endpoint, token, null);
	}

	public static async cancelOrder(
		orderId: string,
		token: string | null
	): Promise<Order> {
		const endpoint = `/orders/${orderId}/cancel`;
		return this.putData(endpoint, {}, token, null);
	}
}