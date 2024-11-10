import { ItemClassification } from '../models/menuModels';
import { BaseClient } from './baseClient';

/**
 * Query parameters for fetching item classifications.
 */
export interface ItemClassificationQueryParams {
  page?: number;
  pageSize?: number;
  ids?: string;
  sortBy?: string;
  sortDirection?: string;
  default?: boolean;
}

/**
 * Client for interacting with the item classification API.
 */
export class ItemClassificationClient extends BaseClient {
  /**
   * Creates a new item classification.
   * @param itemClassification - The item classification data to create.
   * @param token - The authentication token.
   * @returns The created item classification.
   */
  public static async createItemClassification(itemClassification: ItemClassification, token: string | null): Promise<ItemClassification> {
    const endpoint = `/item-classifications`;
    return this.postData(endpoint, itemClassification, token, null);
  }

  /**
   * Fetches an item classification by its ID.
   * @param itemClassificationId - The ID of the item classification to fetch.
   * @param token - The authentication token.
   * @returns The item classification with the given ID.
   */
  public static async getItemClassificationById(itemClassificationId: string, token: string | null): Promise<ItemClassification> {
    const endpoint = `/item-classifications/${itemClassificationId}`;
    return this.fetchData(endpoint, token, null);
  }

  /**
   * Updates an existing item classification.
   * @param itemClassificationId - The ID of the item classification to update.
   * @param itemClassificationData - The updated item classification data.
   * @param token - The authentication token.
   * @returns The updated item classification.
   */
  public static async updateItemClassification(itemClassificationId: string, itemClassificationData: ItemClassification, token: string | null): Promise<ItemClassification> {
    const endpoint = `/item-classifications/${itemClassificationId}`;
    return this.putData(endpoint, itemClassificationData, token, null);
  }

  /**
   * Deletes an item classification.
   * @param itemClassificationId - The ID of the item classification to delete.
   * @param token - The authentication token.
   * @returns A message indicating that the item classification was deleted.
   */
  public static async deleteItemClassification(itemClassificationId: string, token: string | null): Promise<{ message: string }> {
    const endpoint = `/item-classifications/${itemClassificationId}`;
    return this.deleteData(endpoint, token, null);
  }

  /**
   * Fetches a list of item classifications.
   * @param params - The query parameters for the request.
   * @param token - The authentication token.
   * @returns A list of item classifications.
   */
  public static async getItemClassifications(params: ItemClassificationQueryParams, token: string | null): Promise<ItemClassification[]> {
    const endpoint = `/item-classifications?${this.constructQueryString(params)}`;
    return this.fetchData(endpoint, token, null);
  }

  /**
   * Fetches a list of item classifications based on a list of item classification IDs.
   * @param itemClassificationIds - A list of item classification IDs.
   * @param token - The authentication token.
   * @returns A list of item classifications.
   */
  public static async getItemClassificationsByIds(itemClassificationIds: string[], token: string | null): Promise<ItemClassification[]> {
    if (!itemClassificationIds || itemClassificationIds.length === 0) return [];
    const endpoint = `/item-classifications?ids=${itemClassificationIds.join(',')}`;
    return this.fetchData(endpoint, token, null);
  }

  /**
   * Constructs a query string from the given parameters.
   * @param params - The parameters to construct the query string from.
   * @returns The constructed query string.
   */
  private static constructQueryString(params: ItemClassificationQueryParams): string {
    const queries: string[] = [];
    if (params.page) {
      queries.push(`page=${params.page}`);
    }
    if (params.pageSize) {
      queries.push(`page_size=${params.pageSize}`);
    }
    if (params.ids) {
      queries.push(`ids=${params.ids}`);
    }
    if (params.sortBy) {
      queries.push(`sort_by=${params.sortBy}`);
    }
    if (params.sortDirection) {
      queries.push(`sort_direction=${params.sortDirection}`);
    }
    if (params.default) {
      queries.push(`default=${params.default}`);
    }
    return queries.join('&');
  }
}