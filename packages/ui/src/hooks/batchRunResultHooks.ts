'use client'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BatchRunResultClient, BatchRunResultParams, CreateBatchRunRequest } from '../clients/batchRunResultClient';
import { MutationCallbacks } from '../lib/utils';
import { BatchRunResult } from '../models/processingModels';

const BATCH_RUN_RESULTS_CACHE_KEY = 'batchRunResults';
const BATCH_RUN_RESULT_CACHE_KEY = 'batchRunResult';

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};

export const useCreateBatchRunResult = ({ onSuccess, onError }: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation<unknown, unknown, CreateBatchRunRequest>(
        async (batchRunData: CreateBatchRunRequest) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return BatchRunResultClient.createBatchRunResult(batchRunData, token);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(BATCH_RUN_RESULTS_CACHE_KEY);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useGetBatchRunResultById = (batchRunResultId: string) => {
    const token = useSessionToken();
    return useQuery(
        [BATCH_RUN_RESULT_CACHE_KEY, batchRunResultId],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return BatchRunResultClient.getBatchRunResultById(batchRunResultId, token);
        },
        {
            enabled: !!batchRunResultId && !!token,
        },
    );
};

export const useUpdateBatchRunResult = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async ({
            batchRunResultId,
            batchRunResultData,
        }: { batchRunResultId: string; batchRunResultData: BatchRunResult }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return BatchRunResultClient.updateBatchRunResult(batchRunResultId, batchRunResultData, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([
                    BATCH_RUN_RESULT_CACHE_KEY,
                    variables.batchRunResultId,
                ]);
                queryClient.invalidateQueries(BATCH_RUN_RESULTS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};

export const useDeleteBatchRunResult = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();

    return useMutation(
        async (batchRunResultId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return BatchRunResultClient.deleteBatchRunResult(batchRunResultId, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([BATCH_RUN_RESULT_CACHE_KEY, variables]);
                queryClient.invalidateQueries(BATCH_RUN_RESULTS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};

export const useGetBatchRunResults = (params: BatchRunResultParams) => {
    const token = useSessionToken();
    return useQuery([BATCH_RUN_RESULTS_CACHE_KEY, params], async () => {
        if (!token) {
                throw new Error("Session token not available");
            }
        return BatchRunResultClient.getBatchRunResults(params, token);
    }, {
        enabled: !!params && !!token,
    });
};