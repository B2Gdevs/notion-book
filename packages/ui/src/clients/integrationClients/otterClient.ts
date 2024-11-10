import { OtterBrand, OtterConnection, Organization, PaginatedResult, OtterStore, OtterConnectionSubmissionResponse } from '../../models/otterModels';
import { BaseClient } from '../baseClient';

export interface AuthData {
  authorize_endpoint: string;
  client_id: string;
  redirect_uri: string;
  response_type: string;
  scopes: string[];
  state: string;
  code_challenge: string;
  code_challenge_method: string;
  org_id: string;
}

export class OtterClient extends BaseClient {
  public static async getAuthData(redirectUri: string, orgId: string, token?: string | null): Promise<AuthData> {
    const endpoint = `/otter/auth/data?redirect_uri=${encodeURIComponent(redirectUri)}&org_id=${orgId}`;
    return this.fetchData(endpoint, token ?? '', null);
  }

  public static async handleCallback(orgId: string, code: string, error: string | null, state: string, redirectUri: string, token: string | null): Promise<any> {
    const endpoint = `/otter/callback`;
    const body = {
      org_id: orgId, 
      code,
      error: error ?? null,
      state,
      redirect_uri: redirectUri
    };
    return this.postData(endpoint, body, token, null);
  }

  public static async listBrands(orgId: string, offsetToken?: string, token?: string | null): Promise<{ organization: Organization, paginatedResult: PaginatedResult<OtterBrand>, nextPageToken: string }> {
    const endpoint = `/otter/organization/brands?org_id=${orgId}` + (offsetToken ? `&offset_token=${offsetToken}` : '');
    return this.fetchData(endpoint, token ?? '', null);
  }
  
  public static async listStores(brandId: string, orgId: string, offsetToken?: string, token?: string | null): Promise<{ brand: OtterBrand, paginatedResult: PaginatedResult<OtterStore>, nextPageToken: string }> {
    const endpoint = `/otter/organization/brands/${brandId}/stores?org_id=${orgId}` + (offsetToken ? `&offset_token=${offsetToken}` : '');
    return this.fetchData(endpoint, token ?? '', null);
  }
  
  public static async getStoreConnection(brandId: string, storeId: string, orgId: string, token: string | null): Promise<OtterConnection> {
    const endpoint = `/otter/organization/brands/${brandId}/stores/${storeId}/connection?org_id=${orgId}`;
    return this.fetchData(endpoint, token, null);
  }
  
  public static async submitStoreConnection(brandId: string, storeId: string, externalStoreId: string, orgId: string, token: string | null): Promise<OtterConnectionSubmissionResponse> {
    const endpoint = `/otter/organization/brands/${brandId}/stores/${storeId}/connection/submit?external_store_id=${externalStoreId}&org_id=${orgId}`;
    return this.postData(endpoint, {}, token, null);
  }
  
  public static async deleteStoreConnection(brandId: string, storeId: string, orgId: string, token: string | null): Promise<{ message: string }> {
    const endpoint = `/otter/organization/brands/${brandId}/stores/${storeId}/connection?org_id=${orgId}`;
    return this.deleteData(endpoint, token, null);
  }

  public static async isAuthorized(orgId: string, token: string | null): Promise<{ message: string }> {
    const endpoint = `/otter/oauth/is-authorized?org_id=${orgId}`;
    return this.fetchData(endpoint, token, null);
  }
}