import { User } from '../models/userModels';
import { BaseClient } from './baseClient';

export interface ErrorResponse {
  message?: string;
  status?: number;
  [key: string]: any;
}

export interface CreateOrganizationRequest {
  name: string;
  private_metadata?: Record<string, any>;
  public_metadata?: Record<string, any>;
  slug?: string;
  max_allowed_memberships?: number;
}

export interface AllowListIdentifier {
  created_by: string;
  identifier: string;
  id: string;
  object: string;
  updated_at: string
}

export interface CreateUsersParams {
	userIds: string[];
	orgId: string;
}

export class ClerkClient extends BaseClient {
  public static async addToAllowlist(identifier: string, notify: boolean = false, token: string | null): Promise<any> {
    const payload = { identifier, notify };
    try {
      return await BaseClient.postData('/add_to_allowlist', payload, token, null);
    } catch (error) {
      const typedError = error as ErrorResponse;
      if (typedError.status && typedError.body) {
        if (typedError.status === 400 && typedError.body.errors?.some((err: any) => err.code === 'duplicate_record')) {
          throw new Error(`The identifier ${identifier} already exists.`);
        } else {
          throw new Error(typedError.body.detail || 'An unknown error occurred.');
        }
      } else {
        throw error;
      }
    }
  }

  public static async addDomainsToAllowlist(domains: string[], notify: boolean = false, token: string | null): Promise<void> {
    for (const domain of domains) {
      try {
        await ClerkClient.addToAllowlist(domain, notify, token);
      } catch (error) {
        console.error(`Error adding ${domain} to allowlist: ${(error as ErrorResponse).message}`);
      }
    }
  }

  public static async getAllowList(token: string | null): Promise<AllowListIdentifier[]> {
    return BaseClient.fetchData('/allowlist_identifiers', token, null);
  }

  public static async deleteFromAllowList(identifier_id: string, token: string | null): Promise<any> {
    return BaseClient.deleteData(`/allowlist_identifiers/${identifier_id}`, token, null);
  }

  public static async getIdentifierId(domain: string, token: string | null): Promise<string | null> {
    const allowList = await ClerkClient.getAllowList(token);
    const item = allowList.find((item: AllowListIdentifier) => item.identifier === domain);
    return item?.id ?? null;
  }

  public static async removeDomainsFromAllowlist(domains: string[], token: string | null): Promise<void> {
    for (const domain of domains) {
      const identifier_id = await ClerkClient.getIdentifierId(`*@${domain}`, token);
      if (identifier_id) {
        await ClerkClient.deleteFromAllowList(identifier_id, token);
      } else {
        console.warn(`Identifier for domain ${domain} not found in allowlist.`);
      }
    }
  }

  public static async updateUserRole(organization_id: string, user_id: string, role: 'admin' | 'basic_member', token: string | null): Promise<any> {
    const payload = { role };
    return BaseClient.patchData(`/organizations/${organization_id}/memberships/${user_id}`, payload, token, null);
  }

  public static async addUserToOrg(organization_id: string, user_id: string, role: 'admin' | 'basic_member', token: string | null): Promise<any> {
    const payload = { user_id, role };
    return BaseClient.postData(`/organizations/${organization_id}/memberships`, payload, token, null);
  }

  public static async createOrganization(data: CreateOrganizationRequest, token: string | null): Promise<any> {
    try {
      return await BaseClient.postData('/organizations', data, token, null);
    } catch (error) {
      const typedError = error as ErrorResponse;
      throw new Error(typedError.body?.detail || 'An unknown error occurred.');
    }
  }

  public static async deleteOrganization(orgId: string, token: string | null): Promise<any> {
    return BaseClient.deleteData(`/organizations/${orgId}`, token, null);
  }

  public static async createUsers({ userIds, orgId }: CreateUsersParams, token: string | null): Promise<any> {
    return BaseClient.postData('/create_users', { user_ids: userIds, org_id: orgId }, token, null);
  }

  public static async removeUserFromClerk(userRequest: {clerkId: string}, token: string | null): Promise<any> {
    const response = await BaseClient.deleteData(`/clerk/users/${userRequest.clerkId}`, token, null);
    return response;
  }

  public static async addUsersToOrg(orgId: string, userIds: string[], token: string | null): Promise<any> {
    return BaseClient.postData(`/add_users_to_org/${orgId}`, userIds, token, null);
  }

  public static async getOrgMembers(orgClerkId: string, token: string | null): Promise<User[]> {
    return BaseClient.fetchData(`/organizations/${orgClerkId}/members`, token, null);
  }
}