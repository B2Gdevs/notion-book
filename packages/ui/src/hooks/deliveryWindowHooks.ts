'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { DeliveryWindowClient, DeliveryWindowQueryParams } from '../clients/deliveryWindowClient';
import { DeliveryWindow } from '../models/deliveryWindowModels';
import { MutationCallbacks } from '../lib/utils';

const DELIVERY_WINDOWS_CACHE_KEY = 'deliveryWindows';
const DELIVERY_WINDOW_CACHE_KEY = 'deliveryWindow';

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};

export const useCreateDeliveryWindow = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async (deliveryWindow: DeliveryWindow) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return DeliveryWindowClient.createDeliveryWindow(deliveryWindow, token);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(DELIVERY_WINDOWS_CACHE_KEY);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useGetDeliveryWindowById = (deliveryWindowId: string, enabled: boolean = true) => {
    const token = useSessionToken();
    return useQuery(
        [DELIVERY_WINDOW_CACHE_KEY, deliveryWindowId],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return DeliveryWindowClient.getDeliveryWindowById(deliveryWindowId, token);
        },
        {
            enabled: !!deliveryWindowId && !!token && enabled,
        },
    );
};

export const useGetDeliveryWindows = (params: DeliveryWindowQueryParams, enabled: boolean = true ) => {
    const token = useSessionToken();
    return useQuery(
        [DELIVERY_WINDOWS_CACHE_KEY, params.areaId, params], // Include areaId in the cache key
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return DeliveryWindowClient.getDeliveryWindows(params, token);
        },
        {
            enabled: !!token && enabled,
        },
    );
};
export const useUpdateDeliveryWindow = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async ({
            deliveryWindowId,
            deliveryWindowData,
        }: { deliveryWindowId: string; deliveryWindowData: DeliveryWindow }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return DeliveryWindowClient.updateDeliveryWindow(deliveryWindowId, deliveryWindowData, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([
                    DELIVERY_WINDOW_CACHE_KEY,
                    variables.deliveryWindowId,
                ]);
                queryClient.invalidateQueries(DELIVERY_WINDOWS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};

export const useDeleteDeliveryWindow = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async (deliveryWindowId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return DeliveryWindowClient.deleteDeliveryWindow(deliveryWindowId, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([DELIVERY_WINDOW_CACHE_KEY, variables]);
                queryClient.invalidateQueries(DELIVERY_WINDOWS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};