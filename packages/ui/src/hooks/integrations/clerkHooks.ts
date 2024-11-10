'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ClerkClient, CreateOrganizationRequest, CreateUsersParams } from '../../clients/clerkClient';
import { USERS_CACHE_KEY } from '../userHooks';

const ALLOWLIST_CACHE_KEY = 'allowlist';
const ORGANIZATION_CACHE_KEY = 'organization';

interface MutationCallbacks {
    onSuccess?: () => void;
    onError?: (error: any) => void;
}

const useSessionToken = () => {
    const { useSessionToken } = require('../sessionHooks');
    return useSessionToken();
};

export const useAddToAllowlist = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async ({ identifier, notify }: { identifier: string; notify: boolean }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ClerkClient.addToAllowlist(identifier, notify, token);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(ALLOWLIST_CACHE_KEY);
                if (onSuccess) onSuccess();
            },
            onError,
        },
    );
};

export const useAddDomainsToAllowlist = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async ({ domains, notify }: { domains: string[]; notify: boolean }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ClerkClient.addDomainsToAllowlist(domains, notify, token);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(ALLOWLIST_CACHE_KEY);
                if (onSuccess) onSuccess();
            },
            onError,
        },
    );
};

export const useGetAllowList = () => {
    const token = useSessionToken();
    return useQuery(ALLOWLIST_CACHE_KEY, async () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return ClerkClient.getAllowList(token);
    },
    {
        enabled: !!token,
    });
};

export const useDeleteFromAllowList = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async (identifier_id: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ClerkClient.deleteFromAllowList(identifier_id, token);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(ALLOWLIST_CACHE_KEY);
                if (onSuccess) onSuccess();
            },
            onError,
        },
    );
};

export const useUpdateUserRole = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    return useMutation(
        async ({
            organization_id,
            user_id,
            role,
        }: {
            organization_id: string;
            user_id: string;
            role: 'admin' | 'basic_member';
        }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ClerkClient.updateUserRole(organization_id, user_id, role, token);
        },
        { onSuccess, onError },
    );
};

export const useAddUserToOrg = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    return useMutation(
        async ({
            organization_id,
            user_id,
            role,
        }: {
            organization_id: string;
            user_id: string;
            role: 'admin' | 'basic_member';
        }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ClerkClient.addUserToOrg(organization_id, user_id, role, token);
        },
        { onSuccess, onError },
    );
};

export const useCreateOrganization = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async (data: CreateOrganizationRequest) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ClerkClient.createOrganization(data, token);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(ORGANIZATION_CACHE_KEY);
                if (onSuccess) onSuccess();
            },
            onError,
        },
    );
};

export const useDeleteOrganization = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async (orgId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ClerkClient.deleteOrganization(orgId, token);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(ORGANIZATION_CACHE_KEY);
                if (onSuccess) onSuccess();
            },
            onError,
        },
    );
};

export const useCreateUsers = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async ({ userIds, orgId }: CreateUsersParams) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ClerkClient.createUsers({ userIds, orgId }, token);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(ORGANIZATION_CACHE_KEY);
                queryClient.invalidateQueries(USERS_CACHE_KEY);
                if (onSuccess) onSuccess();
            },
            onError,
        },
    );
};

export const useRemoveUserFromClerk = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async ({ clerkId }: { clerkId: string }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ClerkClient.removeUserFromClerk({ clerkId }, token);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(ORGANIZATION_CACHE_KEY);
                queryClient.invalidateQueries(USERS_CACHE_KEY);
                if (onSuccess) onSuccess();
            },
            onError,
        },
    );
};

export const useAddUsersToOrg = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async ({ orgId, userIds }: { orgId: string; userIds: string[] }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ClerkClient.addUsersToOrg(orgId, userIds, token);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(ORGANIZATION_CACHE_KEY);
                queryClient.invalidateQueries(USERS_CACHE_KEY);
                if (onSuccess) onSuccess();
            },
            onError,
        },
    );
};

export const useGetOrgMembers = (orgClerkId: string) => {
    const token = useSessionToken();
    return useQuery(
        ['orgMembers', orgClerkId],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ClerkClient.getOrgMembers(orgClerkId, token);
        },
        {
            enabled: !!orgClerkId && !!token,
        }
    );
};