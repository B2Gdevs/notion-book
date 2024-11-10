import { Photo } from '../../models/menuModels'; // Assuming the structure and path
import { BaseClient } from '../baseClient';

export class PhotoPart extends BaseClient {
  // Photo methods
  public static async createPhoto(
    menuId: string,
    photo: Photo,
    token: string | null
  ): Promise<Photo> {
    return this.postData(`/menus/${menuId}/photos`, photo, token, null);
  }

  public static async getPhotoById(
    photoId: string,
    token: string | null
  ): Promise<Photo> {
    return this.fetchData(`/photos/${photoId}`, token, null);
  }

  public static async getAllPhotosByMenu(
    menuId: string,
    token: string | null
  ): Promise<Photo[]> {
    return this.fetchData(`/menus/${menuId}/photos`, token, null);
  }

  public static async getPhotosByMenu(
    menuId: string,
    token: string | null
  ): Promise<Photo[]> {
    return this.fetchData(`/menus/${menuId}/photos`, token, null);
  }

  public static async updatePhoto(
    photoId: string,
    photo: Photo,
    token: string | null
  ): Promise<Photo> {
    return this.putData(`/photos/${photoId}`, photo, token, null);
  }

  public static async deletePhoto(
    photoId: string,
    token: string | null
  ): Promise<void> {
    return this.deleteData(`/photos/${photoId}`, token, null);
  }

  public static async getPhotosByMenuIds(
    menuIds: string[],
    token: string | null
  ): Promise<Photo[]> {
    const menuIdsString = menuIds.join(',');
    return this.fetchData(`/photos?menu_ids=${menuIdsString}`, token, null);
  }
}