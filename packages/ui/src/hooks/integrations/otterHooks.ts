'use client'

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { OtterClient } from '../../clients/integrationClients/otterClient';
import { MutationCallbacks } from '../../lib/utils';
import { OtterConnectionSubmissionResponse } from '../../models/otterModels';

const AUTH_DATA_CACHE_KEY = 'authData';
const BRANDS_CACHE_KEY = 'brands';
const STORES_CACHE_KEY = 'stores';
const STORE_CONNECTION_CACHE_KEY = 'storeConnection';
const AUTHORIZATION_STATUS_CACHE_KEY = 'authorizationStatus';

interface SubmitStoreConnectionParams {
    sessionId: string;
    externalBrandId: string;
    storeId: string;
    externalStoreId: string;
    orgId: string; // orgId is not optional
}

interface DeleteStoreConnectionParams {
    sessionId: string;
    brandId: string;
    storeId: string;
    orgId: string; // orgId is not optional
}

const useSessionToken = () => {
    const { useSessionToken } = require('../sessionHooks');
    return useSessionToken();
};

export const useGetAuthData = (redirectUri: string, orgId: string) => {
    const token = useSessionToken();
    return useQuery([AUTH_DATA_CACHE_KEY, redirectUri, orgId], async () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return OtterClient.getAuthData(redirectUri, orgId, token);
    },
    {
        enabled: !!token
    });
};

export const useListBrands = ( orgId: string, offsetToken?: string) => {
    const token = useSessionToken();
    return useQuery([BRANDS_CACHE_KEY, orgId, offsetToken], async () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return OtterClient.listBrands(orgId, offsetToken, token);
    },
    {
        enabled: !!token
    });
};

export const useListStores = (
    brandId: string,
    orgId: string,
    offsetToken?: string,
) => {
    const token = useSessionToken();
    return useQuery([STORES_CACHE_KEY, brandId, orgId, offsetToken], async () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return OtterClient.listStores(brandId, orgId, offsetToken, token);
    },
    {
        enabled: !!token
    });
};

export const useGetStoreConnection = (
    brandId: string,
    storeId: string,
    orgId: string,
    { onSuccess, onError }: MutationCallbacks = {},
    enabled: boolean = true
) => {
    const token = useSessionToken();
    return useQuery(
        [STORE_CONNECTION_CACHE_KEY, brandId, storeId, orgId],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return OtterClient.getStoreConnection(brandId, storeId, orgId, token);
        },
        {
            onSuccess: (data) => {
                if (onSuccess) onSuccess(data);
            },
            onError: (error) => {
                if (onError) onError(error);
            },
            enabled: !!token && enabled
        }
    );
};

export const useHandleCallback = (
    orgId: string,
    code: string,
    error: string | null,
    state: string,
    redirectUri: string,
    { onSuccess, onError }: MutationCallbacks = {}
) => {
    const token = useSessionToken();
    return useMutation(
        async () => {
            // if (!token) {
            //     throw new Error("Session token not available");
            // }
            return OtterClient.handleCallback(orgId, code, error, state, redirectUri, token);
        },
        {
            onSuccess: (data) => {
                console.log('Callback handled successfully', data);
                if (onSuccess) onSuccess(data);
            },
            onError: (error) => {
                console.error('Error handling callback:', error);
                if (onError) onError(error);
            },
        }
    );
};

export const useSubmitStoreConnection = ({ onSuccess, onError }: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async (params: SubmitStoreConnectionParams) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return OtterClient.submitStoreConnection(
                params.externalBrandId,
                params.storeId,
                params.externalStoreId,
                params.orgId,
                token
            );
        },
        {
            onSuccess: (data: OtterConnectionSubmissionResponse, variables: SubmitStoreConnectionParams) => {
                console.debug('useSubmitStoreConnection onSuccess', data, variables);
                queryClient.invalidateQueries([
                    STORES_CACHE_KEY,
                    variables.externalBrandId,
                    variables.orgId,
                ]);
                queryClient.invalidateQueries([
                    STORE_CONNECTION_CACHE_KEY,
                    variables.externalBrandId,
                    variables.storeId,
                    variables.orgId,
                ]);
                if (onSuccess) onSuccess(data);
            },
            onError: (error) => {
                console.error('Error in useSubmitStoreConnection:', error);
                if (onError) onError(error);
            },
        },
    );
};

export const useDeleteStoreConnection = ({ onSuccess, onError }: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async (params: DeleteStoreConnectionParams) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return OtterClient.deleteStoreConnection(
                params.brandId,
                params.storeId,
                params.orgId,
                token
            );
        },
        {
            onSuccess: (data, variables: DeleteStoreConnectionParams) => {
                console.debug('useDeleteStoreConnection onSuccess', data, variables);
                queryClient.invalidateQueries([
                    STORES_CACHE_KEY,
                    variables.brandId,
                    variables.orgId,
                ]);
                queryClient.invalidateQueries([
                    STORE_CONNECTION_CACHE_KEY,
                    variables.brandId,
                    variables.storeId,
                    variables.orgId,
                ]);
                if (onSuccess) onSuccess(data);
            },
            onError: (error) => {
                console.error('Error in useDeleteStoreConnection:', error);
                if (onError) onError(error);
            },
        },
    );
};

export const useIsAuthorized = (orgId: string) => {
    const token = useSessionToken();

    return useQuery([AUTHORIZATION_STATUS_CACHE_KEY, orgId], async () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return OtterClient.isAuthorized(orgId, token);
    }, {
        onError: (error) => {
            console.error('Authorization check failed:', error);
        },
        enabled: !!token
    },);
};