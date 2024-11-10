import { OrgGroup } from '../models/orgModels';
import { BaseClient } from './baseClient';

export interface OrgGroupQueryParams {
	page?: number;
	pageSize?: number;
	orgGroupIds?: string; // Comma-separated list of organization IDs
	sortBy?: string;
	sortDirection?: 'asc' | 'desc';
}

export class OrgGroupClient extends BaseClient {
	public static async createOrgGroup(
		orgGroup: OrgGroup,
		token: string | null
	): Promise<OrgGroup> {
		const endpoint = `/org_groups`;
		return this.postData(endpoint, orgGroup, token, null);
	}

	public static async getOrgGroupById(
		orgGroupId: string,
		token: string | null
	): Promise<OrgGroup> {
		const endpoint = `/org_groups/${orgGroupId}`;
		return this.fetchData(endpoint, token, null);
	}

	public static async updateOrgGroup(
		orgGroupId: string,
		orgGroupData: OrgGroup,
		token: string | null
	): Promise<OrgGroup> {
		const endpoint = `/org_groups/${orgGroupId}`;
		return this.putData(endpoint, orgGroupData, token, null);
	}

	public static async deleteOrgGroup(
		orgGroupId: string,
		token: string | null
	): Promise<{ message: string }> {
		const endpoint = `/org_groups/${orgGroupId}`;
		return this.deleteData(endpoint, token, null);
	}

	public static async getOrgGroups(
		params: OrgGroupQueryParams,
		token: string | null
	): Promise<OrgGroup[]> {
		const endpoint = `/org_groups?${this.constructQueryString(params)}`;
		return this.fetchData(endpoint, token, null);
	}

	private static constructQueryString(params: OrgGroupQueryParams): string {
		const queries = [];
		if (params.page) {
		  queries.push(`page=${params.page}`);
		}
		if (params.pageSize) {
		  queries.push(`page_size=${params.pageSize}`);
		}
		if (params.orgGroupIds) {
		  queries.push(`org_group_ids=${encodeURIComponent(params.orgGroupIds)}`);
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