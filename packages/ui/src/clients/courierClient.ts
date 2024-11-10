import { ColorfullCourier } from '../models/courierModels';
import { BaseClient } from './baseClient';

export interface CourierQueryParams {
	page?: number;
	pageSize?: number;
	email?: string;
	clerkId?: string;
	// Add other filtering parameters as needed
}

export class CourierClient extends BaseClient {
	public static async createCourier(
		courier: ColorfullCourier,
		token: string | null
	): Promise<ColorfullCourier> {
		const endpoint = `/couriers`;
		return this.postData(endpoint, courier, token, null);
	}

	public static async getCourierById(
		courierId: string,
		token: string | null
	): Promise<ColorfullCourier> {
		const endpoint = `/couriers/${courierId}`;
		return this.fetchData(endpoint, token, null);
	}

	public static async getCouriers(params: {
		page?: number;
		pageSize?: number;
		// Add other filtering parameters as needed
	}, token: string | null): Promise<ColorfullCourier[]> {
		const endpoint = `/couriers?${this.constructQueryString(params)}`;
		return this.fetchData(endpoint, token, null);
	}

	public static constructQueryString(params: CourierQueryParams): string {
		const queries = [];
		if (params.page) {
			queries.push(`page=${params.page}`);
		}
		if (params.pageSize) {
			queries.push(`page_size=${params.pageSize}`);
		}
        if (params.clerkId) {
            queries.push(`clerk_id=${params.clerkId}`);
        }
		if (params.email) {
			queries.push(`email=${params.email}`);
		}
		// Add other query parameters as needed
		return queries.join('&');
	}

	public static async updateCourier(
		courierId: string,
		courierData: ColorfullCourier,
		token: string | null
	): Promise<ColorfullCourier> {
		const endpoint = `/couriers/${courierId}`;
		return this.putData(endpoint, courierData, token, null);
	}

	public static async deleteCourier(
		courierId: string,
		token: string | null
	): Promise<{ message: string }> {
		const endpoint = `/couriers/${courierId}`;
		return this.deleteData(endpoint, token, null);
	}
}