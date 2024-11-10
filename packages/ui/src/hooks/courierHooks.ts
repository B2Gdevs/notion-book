// packages/ui/src/hooks/courierHooks.ts
'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { CourierClient, CourierQueryParams } from '../clients/courierClient';
import { ColorfullCourier } from '../models/courierModels';
import { MutationCallbacks } from '../lib/utils';

const COURIERS_CACHE_KEY = 'couriers';
const COURIER_CACHE_KEY = 'courier';
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};

export const useCreateCourier = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async (courier: ColorfullCourier) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return CourierClient.createCourier(courier, token);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(COURIER_CACHE_KEY);
                queryClient.invalidateQueries(COURIERS_CACHE_KEY);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useGetCourierById = (courierId: string) => {
    const token = useSessionToken();
    return useQuery(
        [COURIER_CACHE_KEY, courierId],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return CourierClient.getCourierById(courierId, token);
        },
        {
            staleTime: STALE_TIME,
            enabled: !!courierId && !!token,
        },
    );
};

export const useGetCouriersByIds = (courierIds: string[]) => {
    const token = useSessionToken();
    return useQuery(
        [COURIER_CACHE_KEY, courierIds],
        async () => Promise.all(courierIds.map(id => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return CourierClient.getCourierById(id, token);
        })),
        {
            staleTime: STALE_TIME,
            enabled: (courierIds?.length ?? 0) > 0 && !!token,
        },
    );
};

export const useGetCouriers = (params: CourierQueryParams) => {
    const token = useSessionToken();
    return useQuery(
        [COURIERS_CACHE_KEY, params],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return CourierClient.getCouriers(params, token);
        },
        {
            staleTime: STALE_TIME,
            enabled: !!token,
        },
    );
};

export const useUpdateCourier = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async ({
            courierId,
            courierData,
        }: { courierId: string; courierData: ColorfullCourier }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return CourierClient.updateCourier(courierId, courierData, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([COURIER_CACHE_KEY, variables.courierId]);
                queryClient.invalidateQueries(COURIERS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};

export const useDeleteCourier = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async (courierId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return CourierClient.deleteCourier(courierId, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([COURIER_CACHE_KEY, variables]);
                queryClient.invalidateQueries(COURIERS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};