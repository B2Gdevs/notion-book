import { Brand } from '../models/brandModels';
import { BaseClient } from './baseClient';

/**
 * Query parameters for fetching brands.
 */
export interface BrandQueryParams {
  page?: number;
  pageSize?: number;
  orgId?: string;
  ids?: string;
  sortBy?: string;
  sortDirection?: string;
}

/**
 * Client for interacting with the brand API.
 */
export class BrandClient extends BaseClient {
  /**
   * Creates a new brand.
   * @param brand - The brand data to create.
   * @param token - The authentication token.
   * @returns The created brand.
   */
  public static async createBrand(brand: Brand, token: string | null): Promise<Brand> {
    const endpoint = `/brands`;
    return this.postData(endpoint, brand, token, null);
  }

  /**
   * Fetches a brand by its ID.
   * @param brandId - The ID of the brand to fetch.
   * @param token - The authentication token.
   * @returns The brand with the given ID.
   */
  public static async getBrandById(brandId: string, token: string | null): Promise<Brand> {
    const endpoint = `/brands/${brandId}`;
    return this.fetchData(endpoint, token, null);
  }

  /**
   * Updates an existing brand.
   * @param brandId - The ID of the brand to update.
   * @param brandData - The updated brand data.
   * @param token - The authentication token.
   * @returns The updated brand.
   */
  public static async updateBrand(brandId: string, brandData: Brand, token: string | null): Promise<Brand> {
    const endpoint = `/brands/${brandId}`;
    return this.putData(endpoint, brandData, token, null);
  }

  /**
   * Deletes a brand.
   * @param brandId - The ID of the brand to delete.
   * @param token - The authentication token.
   * @returns A message indicating that the brand was deleted.
   */
  public static async deleteBrand(brandId: string, token: string | null): Promise<{ message: string }> {
    const endpoint = `/brands/${brandId}`;
    return this.deleteData(endpoint, token, null);
  }

  /**
   * Fetches a list of brands.
   * @param params - The query parameters for the request.
   * @param token - The authentication token.
   * @returns A list of brands.
   */
  public static async getBrands(params: BrandQueryParams, token: string | null): Promise<Brand[]> {
    const endpoint = `/brands?${this.constructQueryString(params)}`;
    return this.fetchData(endpoint, token, null);
  }

  /**
   * Fetches a list of brands based on a list of brand IDs.
   * @param brandIds - A list of brand IDs.
   * @param token - The authentication token.
   * @returns A list of brands.
   */
  public static async getBrandsByIds(brandIds: string[], token: string | null): Promise<Brand[]> {
    if (!brandIds || brandIds.length === 0) return [];
    const endpoint = `/brands?ids=${brandIds.join(',')}`;
    return this.fetchData(endpoint, token, null);
  }

  /**
   * Constructs a query string from the given parameters.
   * @param params - The parameters to construct the query string from.
   * @returns The constructed query string.
   */
  private static constructQueryString(params: BrandQueryParams): string {
    const queries: string[] = [];
    if (params.page) {
      queries.push(`page=${params.page}`);
    }
    if (params.pageSize) {
      queries.push(`page_size=${params.pageSize}`);
    }
    if (params.orgId) {
      queries.push(`org_id=${params.orgId}`);
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
    return queries.join('&');
  }
}