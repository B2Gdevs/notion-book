import { OrderItem } from '../models/orderModels';
import { BaseClient } from './baseClient';

export interface GetOrderItemsQueryParams {
  page?: number;
  pageSize?: number;
  userId?: string;
  storeId?: string;
  startDate?: string; // Assuming ISO 8601 format
  endDate?: string; // Assuming ISO 8601 format
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  orderItemIds?: string[]; // New filter parameter for order item IDs
  dateTimeField?: string; // New filter parameter for date time field
  share_guest_id?: string; // New filter parameter for share guest ID
  delivery_window_id?: string;
}

export class OrderItemClient extends BaseClient {
  public static async createOrderItem(orderItem: OrderItem, token: string | null): Promise<OrderItem> {
    return this.postData(`/order-items`, orderItem, token, null);
  }

  public static async getOrderItem(orderItemId: string, token: string | null): Promise<OrderItem> {
    return this.fetchData(`/order-items/${orderItemId}`, token, null);
  }

  public static async getOrderItems(filters: GetOrderItemsQueryParams = {}, token: string | null): Promise<OrderItem[]> {
    const queryString = this.constructQueryString(filters);
    return this.fetchData(`/order-items?${queryString}`, token, null);
  }

  public static async getAllOrderItems(token: string | null): Promise<OrderItem[]> {
    return this.fetchData(`/order-items`, token, null);
  }

  public static async updateOrderItem(orderItemId: string, orderItem: OrderItem, token: string | null): Promise<OrderItem> {
    return this.putData(`/order-items/${orderItemId}`, orderItem, token, null);
  }

  public static async deleteOrderItem(orderItemId: string, token: string | null): Promise<OrderItem> {
    return this.deleteData(`/order-items/${orderItemId}`, token, null);
  }

  private static constructQueryString(params: GetOrderItemsQueryParams): string {
    const queries = [];
    if (params.userId) queries.push(`user_id=${params.userId}`);
    if (params.storeId) queries.push(`store_id=${params.storeId}`);
    if (params.startDate) queries.push(`start_date=${params.startDate}`);
    if (params.endDate) queries.push(`end_date=${params.endDate}`);
    if (params.page) queries.push(`page=${params.page}`);
    if (params.pageSize) queries.push(`page_size=${params.pageSize}`);
    if (params.sortBy) queries.push(`sort_by=${params.sortBy}`);
    if (params.sortDirection) queries.push(`sort_direction=${params.sortDirection}`);
    if (params.orderItemIds) queries.push(`order_item_ids=${params.orderItemIds.join(',')}`); // Handle multiple IDs
    if (params.dateTimeField) queries.push(`datetime_field=${params.dateTimeField}`);
    if (params.share_guest_id) queries.push(`share_guest_id=${params.share_guest_id}`); // Add share guest ID filter
    if (params.delivery_window_id) queries.push(`delivery_window_id=${params.delivery_window_id}`);
    return queries.join('&');
  }
}