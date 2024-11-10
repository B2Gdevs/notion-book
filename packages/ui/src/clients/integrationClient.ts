import { Integration } from '../models/integrationModels';
import { BaseClient } from './baseClient';


export interface IntegrationQueryParams {
    page?: number;
    pageSize?: number;
    name?: string;
    orgId?: string;
    integrationIds?: string[];
    state?: string;
  }
  

export class IntegrationClient extends BaseClient {

    private static constructQueryString(params: IntegrationQueryParams): string {
        const queries: string[] = [];
        if (params.page) queries.push(`page=${params.page}`);
        if (params.pageSize) queries.push(`page_size=${params.pageSize}`);
        if (params.name) queries.push(`name=${encodeURIComponent(params.name)}`);
        if (params.orgId) queries.push(`org_id=${params.orgId}`);
        if (params.integrationIds && params.integrationIds.length > 0) {
          queries.push(`integration_ids=${params.integrationIds.join(',')}`);
        }
        if (params.state) queries.push(`state=${params.state}`);
        return queries.join('&');
      }
    public static async getIntegrations(params: IntegrationQueryParams, token: string | null): Promise<Integration[]> {
        const endpoint = `/integrations?${this.constructQueryString(params)}`;
        return this.fetchData(endpoint, token, null);
      }

    public static async getIntegration(id: string, token: string | null): Promise<Integration | null> {
        if (!id) return null;
        const endpoint = `/integrations/${id}`;
        return this.fetchData(endpoint, token, null);
    }

    public static async createIntegration(integration: Integration, token: string | null): Promise<Integration> {
        const endpoint = `/integrations`;
        return this.postData(endpoint, integration, token, null);
    }

    public static async updateIntegration(id: string, integration: Integration, token: string | null): Promise<Integration> {
        if (!id) throw new Error("Integration ID is required for updating.");
        const endpoint = `/integrations/${id}`;
        return this.putData(endpoint, integration, token, null);
    }

    public static async deleteIntegration(id: string, token: string | null): Promise<void> {
        if (!id) throw new Error("Integration ID is required for deletion.");
        const endpoint = `/integrations/${id}`;
        return this.deleteData(endpoint, token, null);
    }
}