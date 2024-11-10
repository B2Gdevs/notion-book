'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ShareClient, ShareParams } from '../clients/shareClient';
import { Share } from '../models/shareModels';
import { useSessionToken } from './sessionHooks';
import { MutationCallbacks } from '..';

const SHARE_CACHE_KEY = 'share';
const SHARES_CACHE_KEY = 'shares';

export const useGetShare = (shareId: string) => {
    const token = useSessionToken(); // Ensure token is retrieved and used
    return useQuery([SHARE_CACHE_KEY, shareId], () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return ShareClient.getShare(shareId, token); // Pass token to the API call
    }, {
        enabled: !!shareId && !!token, // Ensure query is enabled only if shareId and token are available
    });
};

export const useGetShares = (params: ShareParams, enabled: boolean = true) => {
    const token = useSessionToken();
    return useQuery(
        [SHARES_CACHE_KEY, params],
        async () => {
            return ShareClient.getShares(params, token);
        },
        {
            enabled: !!token && enabled, // Combine token existence check with the enabled parameter
        }
    );
};

export const useCreateShare = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation((shareData: Share) => ShareClient.createShare(shareData, token), {
        onSuccess: (data) => {
            // Directly set the new share data in the cache
            queryClient.setQueryData([SHARE_CACHE_KEY, data.id], data);
            queryClient.invalidateQueries(SHARES_CACHE_KEY); // Invalidate list of shares
            if (onSuccess) onSuccess(data);
        },
        onError,
    });
};

export const useUpdateShare = () => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation((share: Share) => ShareClient.updateShare(share, token), {
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries([SHARE_CACHE_KEY, variables.id]); // Invalidate specific share
            queryClient.invalidateQueries(SHARES_CACHE_KEY); // Invalidate list of shares
        },
    });
};

export const useDeleteShare = () => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation((shareId: string) => ShareClient.deleteShare(shareId, token), {
        onMutate: async (shareId) => {
            await queryClient.cancelQueries([SHARE_CACHE_KEY, shareId]);
            const previousShare = queryClient.getQueryData([SHARE_CACHE_KEY, shareId]);
            queryClient.removeQueries([SHARE_CACHE_KEY, shareId], { exact: true });
            return { previousShare };
        },
        onSuccess: () => {
            queryClient.invalidateQueries(SHARES_CACHE_KEY);
            queryClient.refetchQueries(SHARES_CACHE_KEY);
        },
        onError: (error) => {
            console.error('Error deleting share:', error);
        },
        onSettled: () => {
            queryClient.invalidateQueries(SHARES_CACHE_KEY);
        },
    });
};