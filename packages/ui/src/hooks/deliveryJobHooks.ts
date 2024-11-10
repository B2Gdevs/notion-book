'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { DeliveryJobClient, DeliveryJobQueryParams } from '../clients/deliveryJobClient';
import { DeliveryJob } from '../models/deliveryJobModels';
import { MutationCallbacks } from '../lib/utils';

export const DELIVERY_JOBS_CACHE_KEY = 'deliveryJobs';
export const DELIVERY_JOB_CACHE_KEY = 'deliveryJob';
const BATCH_ORDERS_BY_JOB_ID_CACHE_KEY = 'batchOrdersByJobId';

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};

export const useCreateDeliveryJob = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async (deliveryJob: DeliveryJob) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return DeliveryJobClient.createDeliveryJob(deliveryJob, token);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(DELIVERY_JOBS_CACHE_KEY);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useGetDeliveryJobById = (deliveryJobId: string) => {
    const token = useSessionToken();
    return useQuery(
        [DELIVERY_JOB_CACHE_KEY, deliveryJobId],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return DeliveryJobClient.getDeliveryJobById(deliveryJobId, token);
        },
        {
            enabled: !!deliveryJobId && !!token,
        },
    );
};

export const useGetDeliveryJobs = (params: DeliveryJobQueryParams) => {
    const token = useSessionToken();
    return useQuery([DELIVERY_JOBS_CACHE_KEY, params], async () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return DeliveryJobClient.getDeliveryJobs(params, token);
    },
    {
        enabled: !!token,
    });
};

export const useUpdateDeliveryJob = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async ({
            deliveryJobId,
            deliveryJobData,
        }: { deliveryJobId: string; deliveryJobData: DeliveryJob }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return DeliveryJobClient.updateDeliveryJob(deliveryJobId, deliveryJobData, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([
                    DELIVERY_JOB_CACHE_KEY,
                    variables.deliveryJobId,
                ]);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};

export const useDeleteDeliveryJob = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async (deliveryJobId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return DeliveryJobClient.deleteDeliveryJob(deliveryJobId, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([DELIVERY_JOB_CACHE_KEY, variables]);
                queryClient.invalidateQueries(DELIVERY_JOBS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};

export const useGetBatchOrdersByJobId = (jobId: string) => {
    const token = useSessionToken();
    return useQuery(
        [BATCH_ORDERS_BY_JOB_ID_CACHE_KEY, jobId],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return DeliveryJobClient.getBatchOrdersByJobId(jobId, token);
        },
        {
            enabled: !!jobId && !!token,
        },
    );
};