import { Item } from '../../models/menuModels'; // Assuming the structure and path
import { BaseClient } from '../baseClient';

export interface ItemQueryParams {
  page?: number;
  pageSize?: number;
  menuIds?: string[];
  sortBy?: string;
  sortDirection?: string;
}

export class ItemPart extends BaseClient {
  // Items
  public static async createItem(menuId: string, item: Item, token: string | null): Promise<Item> {
    return this.postData(`/menus/${menuId}/items`, item, token || null, null);
  }

  public static async getItemById(itemId: string, token: string | null): Promise<Item> {
    return this.fetchData(`/items/${itemId}`, token || null, null);
  }

  public static async getItemsByIds(
    itemIds: string[],
    token: string | null
  ): Promise<Item[]> {
    const fetchPromises = itemIds.map(itemId => 
      this.fetchData(`/items/${itemId}`, token || null, null)
    );
    
    const items = await Promise.all(fetchPromises);
    return items;
  }
  
  public static async getAllItemsByMenu(menuId: string, token: string | null): Promise<Item[]> {
    return this.fetchData(`/menus/${menuId}/items`, token || null, null);
  }

  public static async getItemsByMenu(menuId: string, token: string | null): Promise<Item[]> {
    return this.fetchData(`/menus/${menuId}/items`, token || null, null);
  }

  public static async updateItem(itemId: string, itemData: Item, token: string | null): Promise<Item> {
    return this.putData(`/items/${itemId}`, itemData, token || null, null);
  }

  public static async deleteItem(itemId: string, token: string | null): Promise<void> {
    return this.deleteData(`/items/${itemId}`, token || null, null);
  }


  public static async getItemsByMenuIds(
    menuIds: string[],
    token: string | null
  ): Promise<Item[]> {
    const menuIdsString = menuIds.join(',');
    return this.fetchData(`/items?menu_ids=${menuIdsString}`, token, null);
  }

  public static async getItems(params: ItemQueryParams, token: string | null): Promise<Item[]> {
    const endpoint = `/items?${this.constructQueryString(params)}`;
    return this.fetchData(endpoint, token, null);
  }

  public static constructQueryString(params: ItemQueryParams): string {
    const queries: string[] = [];
    if (params.page) {
      queries.push(`page=${params.page}`);
    }
    if (params.pageSize) {
      queries.push(`page_size=${params.pageSize}`);
    }
    if (params.menuIds && params.menuIds.length > 0) {
      queries.push(`menu_ids=${params.menuIds.join(',')}`);
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