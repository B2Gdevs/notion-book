'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BatchOrderClient, BatchOrderQueryParams } from '../clients/batchOrderClient';
import { BatchOrder } from '../models/batchOrderModels';
import { MutationCallbacks } from '../lib/utils';

const BATCH_ORDERS_CACHE_KEY = 'batchOrders';
const BATCH_ORDER_CACHE_KEY = 'batchOrder';

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};

export const useCreateBatchOrder = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async (batchOrder: BatchOrder) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return BatchOrderClient.createBatchOrder(batchOrder, token);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(BATCH_ORDERS_CACHE_KEY);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useGetBatchOrderById = (batchOrderId: string) => {
    const token = useSessionToken();
    return useQuery(
        [BATCH_ORDER_CACHE_KEY, batchOrderId],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return BatchOrderClient.getBatchOrderById(batchOrderId, token);
        },
        {
            enabled: !!batchOrderId && !!token,
        },
    );
};

export const useGetBatchOrders = (params: BatchOrderQueryParams) => {
    const token = useSessionToken();
    return useQuery([BATCH_ORDERS_CACHE_KEY, params], async () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return BatchOrderClient.getBatchOrders(params, token);
    },
    {
        enabled: !!token,
    });
};

export const useUpdateBatchOrder = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async ({
            batchOrderId,
            batchOrderData,
        }: { batchOrderId: string; batchOrderData: BatchOrder }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return BatchOrderClient.updateBatchOrder(batchOrderId, batchOrderData, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([
                    BATCH_ORDER_CACHE_KEY,
                    variables.batchOrderId,
                ]);
                queryClient.invalidateQueries(BATCH_ORDERS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};

export const useDeleteBatchOrder = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async (batchOrderId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return BatchOrderClient.deleteBatchOrder(batchOrderId, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([BATCH_ORDER_CACHE_KEY, variables]);
                queryClient.invalidateQueries(BATCH_ORDERS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};

export const useGetBatchOrdersByIds = (batchOrderIds: string[]) => {
    const token = useSessionToken();
    return useQuery(
        [BATCH_ORDERS_CACHE_KEY, { ids: batchOrderIds }],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return BatchOrderClient.getBatchOrdersByIds(batchOrderIds, token);
        },
        {
            enabled: (batchOrderIds?.length ?? 0) > 0 && !!token,
        },
    );
};

export const useStartBatchOrderProcessing = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(async () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return BatchOrderClient.startBatchOrderProcessing(token);
    }, {
        onSuccess: async () => {
            // Refetch all batch orders after the processing is complete
            await queryClient.refetchQueries([BATCH_ORDERS_CACHE_KEY]);
            if (onSuccess) {
                // Assuming onSuccess callback expects the list of all batch orders
                const batchOrders = queryClient.getQueryData<BatchOrder[]>(
                    BATCH_ORDERS_CACHE_KEY,
                );
                onSuccess(batchOrders);
            }
        },
        onError,
    });
};