import { BaseClient } from './baseClient';
import { OrderTotal, DeliveryJobTotal } from '../models/totalModels';

export interface OrderTotalQueryParams {
    [key: string]: any; // Allows for additional properties not explicitly defined here
    org_id?: string;
    order_id?: string;
    ids?: string[]; 
    store_id?: string; // Filter by the store ID the order totals belong to
    start_date?: Date;
    end_date?: Date;
    sort_by?: string;
    sort_direction?: string;
    page?: number;
    page_size?: number;
    datetime_field?: string; 
    is_sub_order_total?: boolean;
}

export interface DeliveryJobTotalQueryParams {
    [key: string]: any;
    org_id?: string;
    job_id?: string;
    start_date?: Date;
    end_date?: Date;
    sort_by?: string;
    sort_direction?: string;
    page?: number;
    page_size?: number;
    datetime_field?: string; 
    job_total_ids?: string[];
}

export class TotalClient extends BaseClient {
    public static async createOrderTotal(orderTotal: OrderTotal, token: string | null): Promise<OrderTotal> {
        const endpoint = `/order-totals`;
        return this.postData(endpoint, orderTotal, token, null);
    }

    public static async getOrderTotalById(orderTotalId: string, token: string | null): Promise<OrderTotal> {
        const endpoint = `/order-totals/${orderTotalId}`;
        return this.fetchData(endpoint, token, null);
    }

    public static async updateOrderTotal(orderTotalId: string, orderTotalData: OrderTotal, token: string | null): Promise<OrderTotal> {
        const endpoint = `/order-totals/${orderTotalId}`;
        return this.putData(endpoint, orderTotalData, token, null);
    }

    public static async deleteOrderTotal(orderTotalId: string, token: string | null): Promise<{ message: string }> {
        const endpoint = `/order-totals/${orderTotalId}`;
        return this.deleteData(endpoint, token, null);
    }

    // Token should always be passed and at least an empty object should be passed for query params
    public static async getOrderTotals(queryParams?: OrderTotalQueryParams, token?: string | null): Promise<OrderTotal[]> {
        const endpoint = `/order-totals?${this.constructQueryString(queryParams)}`;
        return this.fetchData(endpoint, token ?? '', null);
    }

    public static async createDeliveryJobTotal(deliveryJobTotal: DeliveryJobTotal, token: string | null): Promise<DeliveryJobTotal> {
        const endpoint = `/delivery-job-totals`;
        return this.postData(endpoint, deliveryJobTotal, token, null);
    }

    public static async getDeliveryJobTotalById(deliveryJobTotalId: string, token: string | null): Promise<DeliveryJobTotal> {
        const endpoint = `/delivery-job-totals/${deliveryJobTotalId}`;
        return this.fetchData(endpoint, token, null);
    }

    public static async updateDeliveryJobTotal(deliveryJobTotalId: string, deliveryJobTotalData: DeliveryJobTotal, token: string | null): Promise<DeliveryJobTotal> {
        const endpoint = `/delivery-job-totals/${deliveryJobTotalId}`;
        return this.putData(endpoint, deliveryJobTotalData, token, null);
    }

    public static async deleteDeliveryJobTotal(deliveryJobTotalId: string, token: string | null): Promise<{ message: string }> {
        const endpoint = `/delivery-job-totals/${deliveryJobTotalId}`;
        return this.deleteData(endpoint, token, null);
    }

    // Token should always be passed and at least an empty object should be passed for query params
    public static async getDeliveryJobTotals(queryParams?: DeliveryJobTotalQueryParams, token?: string | null): Promise<DeliveryJobTotal[]> {
        const endpoint = `/delivery-job-totals?${this.constructQueryString(queryParams)}`;
        return this.fetchData(endpoint, token ?? '', null);
    }

    private static constructQueryString(params?: OrderTotalQueryParams | DeliveryJobTotalQueryParams): string {
        const queries: any = [];
        
        const toSnakeCase = (str: string): string => {
            return str.replace(/([A-Z])/g, letter => `_${letter.toLowerCase()}`);
        };
    
        Object.keys(params ?? {}).forEach(key => {
            const snakeKey = toSnakeCase(key);
            const value = params![key];
            if (value instanceof Date) {
                queries.push(`${snakeKey}=${value.toISOString()}`);
            } else if (Array.isArray(value)) {
                queries.push(`${snakeKey}=${value.join(',')}`);
            } else if (value !== undefined) {
                queries.push(`${snakeKey}=${encodeURIComponent(value.toString())}`);
            }
        });
    
        return queries.join('&');
    }

    public static async recalculateDeliveryJobTotal(jobTotalId: string, token: string | null): Promise<DeliveryJobTotal> {
        const endpoint = `/delivery-job-totals/${jobTotalId}/recalculate`;
        return this.fetchData(endpoint, token, null);
    }
}