// src/hooks/itemClassificationHooks.ts
'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ItemClassificationClient, ItemClassificationQueryParams } from '../clients/itemClassificationClient';
import { ItemClassification } from '../models/menuModels';
import { MutationCallbacks } from '../lib/utils';

const ITEM_CLASSIFICATIONS_CACHE_KEY = 'itemClassifications';
const ITEM_CLASSIFICATION_CACHE_KEY = 'itemClassification';

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};

export const useCreateItemClassification = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    const queryClient = useQueryClient();

    return useMutation(
        async (itemClassification: ItemClassification) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ItemClassificationClient.createItemClassification(itemClassification, token);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(ITEM_CLASSIFICATIONS_CACHE_KEY);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useGetItemClassificationById = (itemClassificationId: string) => {
    const token = useSessionToken();
    return useQuery(
        [ITEM_CLASSIFICATION_CACHE_KEY, itemClassificationId],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ItemClassificationClient.getItemClassificationById(itemClassificationId, token);
        },
        {
            enabled: !!itemClassificationId && !!token,
        },
    );
};

export const useGetItemClassifications = (params: ItemClassificationQueryParams, enabled: boolean = true) => {
    const token = useSessionToken();
    return useQuery([ITEM_CLASSIFICATIONS_CACHE_KEY, params], async () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return ItemClassificationClient.getItemClassifications(params, token);
    }, {
        enabled: !!token && enabled,
    });
};

export const useGetItemClassificationsByIds = (itemClassificationIds: string[], returnAsRecord = false) => {
    const token = useSessionToken();
    const queryInfo = useQuery(
        [ITEM_CLASSIFICATIONS_CACHE_KEY, { ids: itemClassificationIds }],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ItemClassificationClient.getItemClassificationsByIds(itemClassificationIds, token);
        },
        {
            enabled: (itemClassificationIds?.length ?? 0) > 0 && !!token,
        },
    );

    if (returnAsRecord) {
        const classificationsRecord: Record<string, ItemClassification> = {};
        queryInfo.data?.forEach((classification) => {
            if (classification?.id) classificationsRecord[classification.id] = classification;
        });
        return { ...queryInfo, data: classificationsRecord };
    }

    return queryInfo;
}

export const useUpdateItemClassification = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    const queryClient = useQueryClient();

    return useMutation(
        async ({
            itemClassificationId,
            itemClassificationData,
        }: { itemClassificationId: string; itemClassificationData: ItemClassification }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ItemClassificationClient.updateItemClassification(itemClassificationId, itemClassificationData, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([
                    ITEM_CLASSIFICATION_CACHE_KEY,
                    variables.itemClassificationId,
                ]);
                queryClient.invalidateQueries(ITEM_CLASSIFICATIONS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};

export const useDeleteItemClassification = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    const queryClient = useQueryClient();

    return useMutation(
        async (itemClassificationId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ItemClassificationClient.deleteItemClassification(itemClassificationId, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([ITEM_CLASSIFICATION_CACHE_KEY, variables]);
                queryClient.invalidateQueries(ITEM_CLASSIFICATIONS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};

export const useGetItemClassificationsAsRecord = (itemClassificationIds: string[]) => {
    const token = useSessionToken();
    const queryInfo = useQuery(
        [ITEM_CLASSIFICATIONS_CACHE_KEY, { ids: itemClassificationIds }],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ItemClassificationClient.getItemClassificationsByIds(itemClassificationIds, token);
        },
        {
            enabled: (itemClassificationIds?.length ?? 0) > 0 && !!token,
        },
    );

    const classificationsRecord: Record<string, ItemClassification> = {};
    if (queryInfo.data) {
        queryInfo.data.forEach((classification) => {
            if (classification?.id) classificationsRecord[classification.id] = classification;
        });
    }

    return { ...queryInfo, data: classificationsRecord };
}

export const useGetItemClassificationsList = (itemClassificationIds: string[]) => {
    const token = useSessionToken();
    const queryInfo = useQuery(
        [ITEM_CLASSIFICATIONS_CACHE_KEY, { ids: itemClassificationIds }],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return ItemClassificationClient.getItemClassificationsByIds(itemClassificationIds, token);
        },
        {
            enabled: (itemClassificationIds?.length ?? 0) > 0 && !!token,
        },
    );

    const classificationsList: ItemClassification[] = queryInfo.data ?? [];
    return { ...queryInfo, data: classificationsList };
}