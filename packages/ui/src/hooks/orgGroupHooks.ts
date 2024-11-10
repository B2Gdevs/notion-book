'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { OrgGroupClient, OrgGroupQueryParams } from '../clients/orgGroupClient';
import { OrgGroup } from '../models/orgModels';
import { MutationCallbacks } from '../lib/utils';

const ORG_GROUPS_CACHE_KEY = 'orgGroups';
export const ORG_GROUP_CACHE_KEY = 'orgGroup';

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};


export const useCreateOrgGroup = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async (orgGroup: OrgGroup) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return OrgGroupClient.createOrgGroup(orgGroup, token);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(ORG_GROUPS_CACHE_KEY);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useGetOrgGroupById = (orgGroupId: string) => {
    const token = useSessionToken();

    return useQuery(
        [ORG_GROUP_CACHE_KEY, orgGroupId],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return OrgGroupClient.getOrgGroupById(orgGroupId, token);
        },
        {
            enabled: !!orgGroupId && !!token,
        },
    );
};

export const useGetOrgGroups = (params: OrgGroupQueryParams) => {
    const token = useSessionToken();

    return useQuery([ORG_GROUPS_CACHE_KEY, params], async () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return OrgGroupClient.getOrgGroups(params, token);
    },
    {
        enabled: !!token,
    });
};

export const useUpdateOrgGroup = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async ({
            orgGroupId,
            orgGroupData,
        }: { orgGroupId: string; orgGroupData: OrgGroup }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return OrgGroupClient.updateOrgGroup(orgGroupId, orgGroupData, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([
                    ORG_GROUP_CACHE_KEY,
                    variables.orgGroupId,
                ]);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};

export const useDeleteOrgGroup = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async (orgGroupId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return OrgGroupClient.deleteOrgGroup(orgGroupId, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([ORG_GROUP_CACHE_KEY, variables]);
                queryClient.invalidateQueries(ORG_GROUPS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};