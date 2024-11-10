'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CreateStoreParams, GetStoresParams, StoreClient } from '../clients/storeClient';
import { MutationCallbacks } from '../lib/utils';
import { Store } from '../models/storeModels';

const STORES_CACHE_KEY = 'stores';
const STORE_CACHE_KEY = 'store';
const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};


export const useGetStores = ({ orgId, page, pageSize, storeIds: store_ids }: GetStoresParams = {}, enabled: boolean= true) => {
    const token = useSessionToken();
    const fetchStores = async () => {
        return StoreClient.getStores({ orgId, page, pageSize, storeIds: store_ids }, token);
    };

    return useQuery(
        [STORES_CACHE_KEY, orgId, page, pageSize, store_ids],
        fetchStores,
        {
            enabled: !!enabled && !!token,
        }
    );
};

export const useGetStore = (storeId: string) => {
    const token = useSessionToken();
    const fetchStore = async () => {
        return StoreClient.getStore(storeId, token);
    };

    return useQuery(
        [STORE_CACHE_KEY, storeId],
        fetchStore,
        {
            enabled: !!storeId && !!token
        }
    );
};


export const useGetStoresByIds = (storeIds: string[] = []) => {
    const { data, isLoading, isError } = useGetStores({
        page: 1,
        pageSize: 100,
        storeIds: storeIds,
    }, !!storeIds.length);

    return {
        isLoading,
        isError,
        data
    };
};

export const useCreateStore = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async ({ orgId, storeData, brandId }: CreateStoreParams) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return StoreClient.createStore(orgId, brandId, storeData, token);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(STORES_CACHE_KEY);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        }
    );
};

export const useDeleteStore = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async (storeId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return StoreClient.deleteStore(storeId, token);
        }, {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([STORE_CACHE_KEY, variables]);
                queryClient.invalidateQueries(STORES_CACHE_KEY);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        }
    );
};

export const useGetMenusByStoreId = (
    storeId: string,
    page?: number,
    pageSize?: number,
) => {
    const token = useSessionToken();
    const fetchMenus = async () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return StoreClient.getMenus(storeId, page, pageSize, token);
    };

    return useQuery(
        [STORES_CACHE_KEY, 'menus', storeId, page, pageSize],
        fetchMenus,
        {
            enabled: !!storeId && !!token,
        },
    );
};

export const useGetStoreByOrgId = (orgId: string) => {
    const token = useSessionToken();
    const fetchStoresByOrgId = async () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return StoreClient.getStoresByOrgId(orgId, token);
    };

    return useQuery(
        [STORE_CACHE_KEY, 'byOrgId', orgId],
        fetchStoresByOrgId,
        {
            enabled: !!orgId && !!token,
        },
    );
};

export const useUpdateStore = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async (store: Store) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return StoreClient.updateStore(store, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([STORE_CACHE_KEY, variables.id]);
                queryClient.invalidateQueries(STORES_CACHE_KEY);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const usePauseStore = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async (storeId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return StoreClient.pauseStore(storeId, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([STORE_CACHE_KEY, variables]);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useUnpauseStore = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async (storeId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return StoreClient.unpauseStore(storeId, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([STORE_CACHE_KEY, variables]);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useGetStoresByOtterId = (otterId: string) => {
    const token = useSessionToken();
    const fetchStoresByOtterId = async () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return StoreClient.getStoresByOtterId(otterId, token);
    };
    return useQuery(
        [STORES_CACHE_KEY, 'byOtterId', otterId],
        fetchStoresByOtterId,
        {
            enabled: !!otterId && !!token,
        },
    );
};