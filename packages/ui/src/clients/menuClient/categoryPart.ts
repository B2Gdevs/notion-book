import { Category } from '../../models/menuModels'; // Assuming the structure and path
import { BaseClient } from '../baseClient';

export class CategoryPart extends BaseClient {
  // Categories

  public static async createCategory(menuId: string, category: Category, token: string | null): Promise<Category> {
    return this.postData(`/menus/${menuId}/categories`, category, token, null);
  }

  public static async getCategoryById(categoryId: string, token: string | null): Promise<Category> {
    return this.fetchData(`/categories/${categoryId}`, token, null);
  }

  public static async getCategoriesByIds(categoryIds: string[], token: string | null): Promise<Category[]> {
    const fetchPromises = categoryIds.map(categoryId =>
      this.fetchData(`/categories/${categoryId}`, token, null)
    );

    const categories = await Promise.all(fetchPromises);
    return categories;
  }


  public static async getCategoriesByMenu(menuId: string, token: string | null): Promise<Category[]> {
    return this.fetchData(`/menus/${menuId}/categories`, token, null);
  }

  public static async updateCategory(categoryId: string, categoryData: Category, token: string | null): Promise<Category> {
    return this.putData(`/categories/${categoryId}`, categoryData, token, null);
  }

  public static async deleteCategory(categoryId: string, token: string | null): Promise<void> {
    return this.deleteData(`/categories/${categoryId}`, token, null);
  }

  public static async getCategoriesByMenuIds(
    menuIds: string[],
    token: string | null
  ): Promise<Category[]> {
    const menuIdsString = menuIds.join(',');
    return this.fetchData(`/categories?menu_ids=${menuIdsString}`, token, null);
  }
}