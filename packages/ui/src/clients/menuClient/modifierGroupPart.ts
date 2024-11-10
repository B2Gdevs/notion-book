import { ModifierGroup } from '../../models/menuModels'; // Assuming the structure and path
import { BaseClient } from '../baseClient';

export class ModifierGroupPart extends BaseClient {
  // ModifierGroups
  public static async createModifierGroup(
    menuId: string,
    modifierGroup: ModifierGroup,
    token: string | null
  ): Promise<ModifierGroup> {
    return this.postData(`/menus/${menuId}/modifier-groups`, modifierGroup, token, null);
  }

  public static async getModifierGroupById(
    modifierGroupId: string,
    token: string | null
  ): Promise<ModifierGroup> {
    return this.fetchData(`/modifier-groups/${modifierGroupId}`, token, null);
  }

  public static async getModifierGroupsByIds(
    modifierGroupIds: string[],
    token: string | null
  ): Promise<ModifierGroup[]> {
    const fetchPromises = modifierGroupIds.map(id => 
      this.fetchData(`/modifier-groups/${id}`, token, null)
    );
    
    const modifierGroups = await Promise.all(fetchPromises);
    return modifierGroups;
  }
  
  public static async getAllModifierGroupsByMenu(
    menuId: string,
    token: string | null
  ): Promise<ModifierGroup[]> {
    return this.fetchData(`/menus/${menuId}/modifier-groups`, token, null);
  }

  public static async updateModifierGroup(
    modifierGroupId: string,
    modifierGroupData: ModifierGroup,
    token: string | null
  ): Promise<ModifierGroup> {
    return this.putData(`/modifier-groups/${modifierGroupId}`, modifierGroupData, token, null);
  }

  public static async deleteModifierGroup(
    modifierGroupId: string,
    token: string | null
  ): Promise<void> {
    return this.deleteData(`/modifier-groups/${modifierGroupId}`, token, null);
  }

  public static async getModifierGroupsByMenuIds(
    menuIds: string[],
    token: string | null
  ): Promise<ModifierGroup[]> {
    const menuIdsString = menuIds.join(',');
    return this.fetchData(`/modifier_groups?menu_ids=${menuIdsString}`, token, null);
  }
}