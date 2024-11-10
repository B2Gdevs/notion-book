import { Area, Schedule } from '../models/areaModels';
import { BaseClient } from './baseClient';

export class AreaClient extends BaseClient {
  // Create Area
  public static async createArea(area: Area, token: string | null): Promise<Area> {
    const endpoint = `/areas`;
    return this.postData(endpoint, area, token, null);
  }

  // Read Area by ID
  public static async readArea(areaId: string, token: string | null): Promise<Area> {
    const endpoint = `/areas/${areaId}`;
    return this.fetchData(endpoint, token, null);
  }

  // Read Area by ID
  public static async getArea(areaId: string, token: string | null): Promise<Area> {
    const endpoint = `/areas/${areaId}`;
    return this.fetchData(endpoint, token, null);
  }

  // Update Area by ID
  public static async updateArea(areaId: string, area: Area, token: string | null): Promise<Area> {
    const endpoint = `/areas/${areaId}`;
    return this.putData(endpoint, area, token, null);
  }

  // Delete Area by ID
  public static async deleteArea(areaId: string, token: string | null): Promise<any> {
    const endpoint = `/areas/${areaId}`;
    return this.deleteData(endpoint, token, null);
  }

  // List Areas with optional pagination
  public static async listAreas(
    skip: number = 0,
    limit: number = 10,
    token: string | null
  ): Promise<Area[]> {
    const endpoint = `/areas?skip=${skip}&limit=${limit}`;
    return this.fetchData(endpoint, token, null);
  }

  // Create Schedule for Area
  public static async createScheduleForArea(
    areaId: string,
    schedule: Schedule,
    token: string | null
  ): Promise<Schedule> {
    const endpoint = `/areas/${areaId}/schedule`;
    return this.postData(endpoint, schedule, token, null);
  }

  // Update Schedule by Area ID
  public static async updateScheduleForArea(
    areaId: string,
    schedule: Schedule,
    token: string | null
  ): Promise<Schedule> {
    const endpoint = `/areas/${areaId}/schedule`;
    return this.putData(endpoint, schedule, token, null);
  }

  // Delete Schedule by Area ID
  public static async deleteScheduleForArea(areaId: string, token: string | null): Promise<any> {
    const endpoint = `/areas/${areaId}/schedule`;
    return this.deleteData(endpoint, token, null);
  }
}