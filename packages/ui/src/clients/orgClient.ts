import { Budget, Org } from '../models/orgModels';
import { BaseClient } from './baseClient';

export interface OrgQueryParams {
  orgName?: string;
  orgIds?: string[];
  externalId?: string;
  orgType?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: string;
  areaId?: string;
  externalIds?: string[];
}

export class OrgClient extends BaseClient {
  private static constructQueryString(params: OrgQueryParams): string {
    const queries = Object.entries(params).flatMap(([key, value]) => {
      if (!value) return [];
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      if (Array.isArray(value)) {
        return `${snakeKey}=${value.join(',')}`;
      }
      return `${snakeKey}=${value}`;
    });
    return queries.join('&');
  }

  public static async getOrgs(params: OrgQueryParams = {}, token: string | null): Promise<Org[]> {
    const endpoint = `/orgs?${this.constructQueryString(params)}`;
    return this.fetchData(endpoint, token, null);
  }

  public static async getOrg(orgId: string, token: string | null): Promise<Org> {
    if (!orgId) throw new Error("orgId is required");
    const endpoint = `/orgs/${orgId}`;
    return this.fetchData(endpoint, token, null);
  }

  public static async getOrgsByQuery(params: OrgQueryParams, token: string | null): Promise<Org[]> {
    const endpoint = `/orgs?${this.constructQueryString(params)}`;
    return this.fetchData(endpoint, token, null);
  }

  public static async updateOrg(org: Org, token: string | null): Promise<{ message: string }> {
    if (!org?.id) throw new Error("org.id is required");
    const endpoint = `/orgs/${org.id}`;
    return this.putData(endpoint, org, token, null);
  }

  public static async updateNotificationPreferences(
    orgId: string,
    notificationPreferences: any,
    token: string | null
  ): Promise<{ message: string }> {
    if (!orgId) throw new Error("orgId is required");
    const endpoint = `/orgs/${orgId}/notification_preferences`;
    return this.putData(endpoint, notificationPreferences, token, null);
  }

  public static async createOrg(orgData: Org, token: string | null): Promise<Org> {
    const endpoint = `/orgs`;
    return this.postData(endpoint, orgData, token, null);
  }

  public static async deleteOrg(orgId: string, token: string | null): Promise<{ message: string }> {
    if (!orgId) throw new Error("orgId is required");
    const endpoint = `/orgs/${orgId}`;
    return this.deleteData(endpoint, token, null);
  }

  public static async updateOrgBudget(
    orgId: string,
    budget: Budget,
    token: string | null
  ): Promise<{ message: string }> {
    if (!orgId) throw new Error("orgId is required");
    const endpoint = `/orgs/${orgId}/budget`;
    return this.putData(endpoint, budget, token, null);
  }

  public static async getOrgsByIds(orgIds: string[], token: string | null): Promise<Org[]> {
    if (!orgIds || orgIds.length === 0) return [];
    const endpoint = `/orgs?org_ids=${orgIds.join(',')}`;
    return this.fetchData(endpoint, token, null);
  }
}