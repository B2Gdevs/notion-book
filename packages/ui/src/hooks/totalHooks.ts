'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { DeliveryJobTotalQueryParams, OrderTotalQueryParams, TotalClient } from '../clients/totalClient';
import { OrderTotal, DeliveryJobTotal } from '../models/totalModels';
import { MutationCallbacks } from '../lib/utils';

const ORDER_TOTALS_CACHE_KEY = 'orderTotals';
const DELIVERY_JOB_TOTALS_CACHE_KEY = 'deliveryJobTotals';

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};


export const useCreateOrderTotal = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async (orderTotal: OrderTotal) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return TotalClient.createOrderTotal(orderTotal, token);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(ORDER_TOTALS_CACHE_KEY);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useGetOrderTotalById = (orderTotalId: string) => {
    const token = useSessionToken();
    return useQuery(
        [ORDER_TOTALS_CACHE_KEY, orderTotalId],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return TotalClient.getOrderTotalById(orderTotalId, token);
        },
        {
            enabled: !!orderTotalId && !!token,
        },
    );
};

export const useUpdateOrderTotal = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async ({
            orderTotalId,
            orderTotalData,
        }: { orderTotalId: string; orderTotalData: OrderTotal }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return TotalClient.updateOrderTotal(orderTotalId, orderTotalData, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([
                    ORDER_TOTALS_CACHE_KEY,
                    variables.orderTotalId,
                ]);
                queryClient.invalidateQueries(ORDER_TOTALS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};

export const useDeleteOrderTotal = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async (orderTotalId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return TotalClient.deleteOrderTotal(orderTotalId, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([ORDER_TOTALS_CACHE_KEY, variables]);
                queryClient.invalidateQueries(ORDER_TOTALS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};

export const useGetOrderTotals = (
    queryParams?: OrderTotalQueryParams,
    requireCompleteParams: boolean = false,
    enabled: boolean = true,
) => {
    const token = useSessionToken();
    let shouldFetchData = requireCompleteParams
        ? queryParams?.start_date && queryParams?.end_date && (queryParams?.store_id || queryParams?.org_id)
        : true;
    shouldFetchData = shouldFetchData && enabled;

    return useQuery(
        [ORDER_TOTALS_CACHE_KEY, queryParams],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return TotalClient.getOrderTotals(queryParams, token);
        },
        {
            keepPreviousData: true,
            enabled: !!shouldFetchData && !!token,
            initialData: (): any => {
                return requireCompleteParams && !shouldFetchData ? [] : undefined;
            },
        },
    );
};

export const useGetDeliveryJobTotals = (queryParams?: DeliveryJobTotalQueryParams, enabled: boolean =true) => {
    const token = useSessionToken();
    return useQuery(
        [DELIVERY_JOB_TOTALS_CACHE_KEY, queryParams],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return TotalClient.getDeliveryJobTotals(queryParams, token);
        },
        {
            keepPreviousData: true,
            enabled: !!token && enabled,
        },
    );
};

export const useCreateDeliveryJobTotal = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async (deliveryJobTotal: DeliveryJobTotal) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return TotalClient.createDeliveryJobTotal(deliveryJobTotal, token);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(DELIVERY_JOB_TOTALS_CACHE_KEY);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useGetDeliveryJobTotalById = (deliveryJobTotalId: string) => {
    const token = useSessionToken();
    return useQuery(
        [DELIVERY_JOB_TOTALS_CACHE_KEY, deliveryJobTotalId],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return TotalClient.getDeliveryJobTotalById(deliveryJobTotalId, token);
        },
        {
            enabled: !!deliveryJobTotalId && !!token,
        },
    );
};

export const useRecalculateDeliveryJobTotal = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async (jobTotalId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return TotalClient.recalculateDeliveryJobTotal(jobTotalId, token);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries([DELIVERY_JOB_TOTALS_CACHE_KEY, data.id]);
                queryClient.invalidateQueries(DELIVERY_JOB_TOTALS_CACHE_KEY);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useDeleteDeliveryJobTotal = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async (deliveryJobTotalId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return TotalClient.deleteDeliveryJobTotal(deliveryJobTotalId, token);
        },
        {
            onSuccess: (data, variables) => {
                // Invalidate and refetch queries related to delivery job totals
                queryClient.invalidateQueries([DELIVERY_JOB_TOTALS_CACHE_KEY, variables]);
                queryClient.invalidateQueries(DELIVERY_JOB_TOTALS_CACHE_KEY);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useUpdateDeliveryJobTotal = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async ({
            deliveryJobTotalId,
            deliveryJobTotalData,
        }: { deliveryJobTotalId: string; deliveryJobTotalData: DeliveryJobTotal }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return TotalClient.updateDeliveryJobTotal(deliveryJobTotalId, deliveryJobTotalData, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([
                    DELIVERY_JOB_TOTALS_CACHE_KEY,
                    variables.deliveryJobTotalId,
                ]);
                queryClient.invalidateQueries(DELIVERY_JOB_TOTALS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};