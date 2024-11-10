'use client';

import {
	QueryObserverResult,
	useMutation,
	useQuery,
	useQueryClient,
} from 'react-query';
import { OrgClient, OrgQueryParams } from '../clients/orgClient';
import { MutationCallbacks } from '../lib/utils';
import { Org } from '../models/orgModels';
import { useGetBrandsByIds } from './brandHooks';
import { useGetStoresByIds } from './storeHooks';
import { useGetCurrentColorfullUser } from './userHooks';

const ORG_CACHE_KEY = 'org';
const ORGS_CACHE_KEY = 'orgs';

interface QueryCallbacks {
	onSuccess?: (data: any) => void;
	onError?: (error: any) => void;
}


const useSessionToken = () => {
	const { useSessionToken } = require('./sessionHooks');
	return useSessionToken();
};


export const useGetOrg = (orgId: string, enabled: boolean = true) => {
	const token = useSessionToken();
	return useQuery([ORG_CACHE_KEY, orgId], async () => {
		if (!token) {
			throw new Error("Session token not available");
		}
		return OrgClient.getOrg(orgId, token);
	}, {
		enabled: !!orgId 
		&& !!token
		&& enabled
		,
	});
};

export const useGetOrgs = (orgName?: string) => {
	const token = useSessionToken();
	return useQuery([ORGS_CACHE_KEY, orgName], async () => {
		if (!token) {
			throw new Error("Session token not available");
		}
		return OrgClient.getOrgs({ orgName }, token);
	}, {
		enabled: !!token,
	});
};

export const useGetOrgsByIds = (orgIds: string[]) => {
	const token = useSessionToken();
	return useQuery([ORGS_CACHE_KEY, { ids: orgIds }], async () => {
		if (!token) {
			throw new Error("Session token not available");
		}
		return OrgClient.getOrgsByIds(orgIds, token);
	}, {
		enabled: (orgIds?.length ?? 0) > 0 
		&& !!token
		,
	});
};

export const useUpdateOrg = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(async (org: Org) => {
		if (!token) {
			throw new Error("Session token not available");
		}
		return OrgClient.updateOrg(org, token);
	}, {
		onSuccess: (data, variables) => {
			// Invalidate and refetch individual org data
			queryClient.invalidateQueries([ORG_CACHE_KEY, variables.id]);
			// Invalidate and refetch all orgs data
			queryClient.invalidateQueries(ORGS_CACHE_KEY);
			if (onSuccess) onSuccess(data);
		},
		onError,
	});
};

export const useCreateOrg = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(async (orgData: Org) => {
		if (!token) {
			throw new Error("Session token not available");
		}
		return OrgClient.createOrg(orgData, token);
	}, {
		onSuccess: (data) => {
			queryClient.invalidateQueries(ORGS_CACHE_KEY);
			if (onSuccess) onSuccess(data);
		},
		onError,
	});
};

export const useDeleteOrg = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(async (orgId: string) => {
		if (!token) {
			throw new Error("Session token not available");
		}
		return OrgClient.deleteOrg(orgId, token);
	}, {
		onSuccess: (data, variables) => {
			queryClient.invalidateQueries([ORG_CACHE_KEY, variables]);
			queryClient.invalidateQueries(ORGS_CACHE_KEY);
			if (onSuccess) onSuccess(data);
		},
		onError,
	});
};

export const useGetOrgsByQuery = (
	params: OrgQueryParams,
	{ onSuccess, onError }: QueryCallbacks = {},
	enabled: boolean = true,
): QueryObserverResult<Org[], Error> => {
	const token = useSessionToken();

	return useQuery(
		[ORGS_CACHE_KEY, params],
		async () => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return OrgClient.getOrgsByQuery(params, token);
		},
		{
			enabled: !!token && enabled, // Only enable the query if the token is available
			onSuccess,
			onError,
		},
	);
};

export const useGetOrgBrands = (org: Org) => {
	const brandIds = org?.brand_ids ?? [];
	return useGetBrandsByIds(brandIds);
};

export const useGetOrgStores = (org: Org) => {
	// Assuming org has a property like store_ids which is an array of string IDs
	const storeIds = org?.store_ids ?? [];
	return useGetStoresByIds(storeIds);
};

export const useGetCurrentUserColorfullOrg = () => {
	const { data: user, isError } = useGetCurrentColorfullUser();
	const orgId = user?.org_id;
	const { data: org } = useGetOrg(orgId ?? '');
	return { data: org, isError };
}