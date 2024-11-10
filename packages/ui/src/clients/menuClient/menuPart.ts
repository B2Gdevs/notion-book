import { Menu } from '../../models/menuModels';
import { BaseClient } from '../baseClient';

export interface GetMenusQueryParams {
  page?: number;
  pageSize?: number;
  storeId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  storeIds?: string[];
}

export class MenuPart extends BaseClient {
  // Menus
  public static async createMenu(menu: Menu, token: string | null): Promise<Menu> {
    return this.postData(`/menus`, menu, token || null, null);
  }

  public static async getMenu(menuId: string, token: string | null): Promise<Menu> {
    return this.fetchData(`/menus/${menuId}`, token || null, null);
  }

  public static async getMenus(filters: GetMenusQueryParams = {}, token: string | null): Promise<Menu[]> {
    const queryString = this.constructQueryString(filters);
    return this.fetchData(`/menus?${queryString}`, token, null);
  }

  public static async getAllMenusByStore(storeId: string, token: string | null): Promise<Menu[]> {
    return this.fetchData(`/menus?store_id=${storeId}`, token || null, null);
  }

  public static async getMenusByStore(storeId: string, token: string | null): Promise<Menu[]> {
    return this.fetchData(`/menus?store_id=${storeId}`, token || null, null);
  }

  public static async updateMenu(menuId: string, menu: Menu, token: string | null): Promise<Menu> {
    return this.putData(`/menus/${menuId}`, menu, token || null, null);
  }

  public static async deleteMenu(menuId: string, token: string | null): Promise<void> {
    return this.deleteData(`/menus/${menuId}`, token || null, null);
  }

  public static constructQueryString(params: GetMenusQueryParams): string {
    const queries = [];
    if (params.storeId) queries.push(`store_id=${params.storeId}`);
    if (params.startDate) queries.push(`start_date=${params.startDate}`);
    if (params.endDate) queries.push(`end_date=${params.endDate}`);
    if (params.page) queries.push(`page=${params.page}`);
    if (params.pageSize) queries.push(`page_size=${params.pageSize}`);
    if (params.sortBy) queries.push(`sort_by=${params.sortBy}`);
    if (params.sortDirection) queries.push(`sort_direction=${params.sortDirection}`);
    if (params.storeIds) queries.push(`store_ids=${params.storeIds}`);
    return queries.join('&');
  }
}