'use client';

import { useMutation, useQueryClient } from 'react-query';
import { DELIVERY_JOBS_CACHE_KEY, DELIVERY_JOB_CACHE_KEY } from '..';
import { LifeCycleClient } from '../clients/lifeCycleClient';
import { MutationCallbacks } from '../lib/utils';

const useSessionToken = () => {
	const { useSessionToken } = require('./sessionHooks');
	return useSessionToken();
  };

export const useTransferAmountsToRestaurantsForJobs = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    return useMutation(
        async (jobIds: string[]) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return LifeCycleClient.transferAmountsToRestaurantsForJobs(jobIds, token);
        },
        {
            onSuccess: (data) => {
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useChargeOrgForJobs = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    let jobIdsInMutation: string[] = [];

    return useMutation(
        async ({ jobIds, chargeDeliveryFee = false }: { jobIds: string[]; chargeDeliveryFee?: boolean }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            jobIdsInMutation = jobIds;
            return LifeCycleClient.chargeOrgForJobs(jobIds, chargeDeliveryFee, token);
        },
        {
            onSuccess: (data) => {
                jobIdsInMutation.forEach(jobId => {
                    queryClient.invalidateQueries([DELIVERY_JOB_CACHE_KEY, jobId]);
                });
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useCompleteJobs = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    let jobIdsInMutation: string[] = [];

    return useMutation(
        async ({ jobIds, chargeDeliveryFee = false }: { jobIds: string[]; chargeDeliveryFee?: boolean }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            jobIdsInMutation = jobIds;
            return LifeCycleClient.completeJobs(jobIds, chargeDeliveryFee, token);
        },
        {
            onSuccess: (data) => {
                jobIdsInMutation.forEach(jobId => {
                    queryClient.invalidateQueries([DELIVERY_JOB_CACHE_KEY, jobId]);
                    queryClient.invalidateQueries(DELIVERY_JOBS_CACHE_KEY);
                
                });
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useSendOrderToKitchen = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async ({ orderId, sendASAP }: { orderId: string; sendASAP: boolean }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return LifeCycleClient.sendOrderToKitchen(orderId, sendASAP, token);
        },
        {
            onSuccess: (data, variables) => {  // Capture the variables used in the mutation
                const { orderId } = variables;  // Destructure orderId from variables
                queryClient.invalidateQueries(['ORDER', orderId]);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useSendOrdersToKitchens = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    let jobIdsInMutation: string[] = [];

    return useMutation(
        async ({ jobIds, sendASAP }: { jobIds: string[]; sendASAP: boolean }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            jobIdsInMutation = jobIds;
            return LifeCycleClient.sendOrdersToKitchens(jobIds, sendASAP, token);
        },
        {
            onSuccess: (data) => {
                jobIdsInMutation.forEach(jobId => {
                    queryClient.invalidateQueries([DELIVERY_JOB_CACHE_KEY, jobId]);
                });
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useRefundOrder = ({
    onSuccess,
    onError,
}: MutationCallbacks) => {
    const token = useSessionToken();
    return useMutation(
        async ({ orderId, amountInCents = 0 }: { orderId: string; amountInCents?: number }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return LifeCycleClient.refundOrder(orderId, amountInCents, token);
        },
        {
            onSuccess: (data) => {
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useRefundJob = ({
    onSuccess,
    onError,
}: MutationCallbacks) => {
    const token = useSessionToken();
    return useMutation(
        async ({ jobId, amountInCents = 0, onlyCanceledSubOrders = false }: { jobId: string; amountInCents?: number, onlyCanceledSubOrders?: boolean }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return LifeCycleClient.refundJob(jobId, amountInCents, onlyCanceledSubOrders, token);
        },
        {
            onSuccess: (data) => {
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useStartJobs = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    let jobIdsInMutation: string[] = [];

    return useMutation(
        async (jobIds: string[]) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            jobIdsInMutation = jobIds;
            return LifeCycleClient.startJobs(jobIds, token);
        },
        {
            onSuccess: (data) => {
                jobIdsInMutation.forEach(jobId => {
                    queryClient.invalidateQueries([DELIVERY_JOB_CACHE_KEY, jobId]);
                });
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useRebatchAreaLifecycle = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    const queryClient = useQueryClient();

    return useMutation(
        async ({ areaId, basicBatching, date, useDate }: { areaId: string; basicBatching: boolean; date?: string; useDate?: boolean }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            const result = await LifeCycleClient.rebatchAreaLifecycle(areaId, basicBatching, date ?? null, useDate ?? false, token);
            return { result, areaId }; // Pass areaId along with the result
        },
        {
            onSuccess: ({ result, areaId }) => { // Destructure areaId here
                queryClient.invalidateQueries([DELIVERY_JOB_CACHE_KEY, areaId]);
                if (onSuccess) {
                    onSuccess(result);
                }
            },
            onError,
        },
    );
};

export const useSendOrdersDeliveredEmails = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    return useMutation(
        async (jobId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return LifeCycleClient.sendOrdersDeliveredEmails(jobId, token);
        },
        {
            onSuccess: (data) => {
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
}