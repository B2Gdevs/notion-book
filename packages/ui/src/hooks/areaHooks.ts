'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AreaClient } from '../clients/areaClient';
import { MutationCallbacks } from '../lib/utils';
import { Area } from '../models/areaModels';

const AREA_CACHE_KEY = 'area';
const AREAS_CACHE_KEY = 'areas';
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};

export const useCreateArea = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    const queryClient = useQueryClient();

    return useMutation(async (area: Area) => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return AreaClient.createArea(area, token);
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(AREAS_CACHE_KEY);
            if (onSuccess) onSuccess();
        },
        onError,
    });
};

export const useGetArea = (areaId: string) => {
    const token = useSessionToken();
    return useQuery([AREA_CACHE_KEY, areaId], async () => {
        return AreaClient.readArea(areaId, token);
    }, {
        staleTime: STALE_TIME,
        enabled: !!areaId && !!token,
    });
};

export const useUpdateArea = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    const queryClient = useQueryClient();
    return useMutation(
        async ({ areaId, area }: { areaId: string; area: Area }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return AreaClient.updateArea(areaId, area, token);
        },
        {
            onSuccess: (_, variables) => {
                queryClient.invalidateQueries([AREA_CACHE_KEY, variables.areaId]);
                queryClient.invalidateQueries(AREAS_CACHE_KEY);
                if (onSuccess) onSuccess();
            },
            onError,
        },
    );
};

export const useDeleteArea = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    const queryClient = useQueryClient();
    return useMutation(async (areaId: string) => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return AreaClient.deleteArea(areaId, token);
    }, {
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries([AREA_CACHE_KEY, variables]);
            queryClient.invalidateQueries(AREAS_CACHE_KEY);
            if (onSuccess) onSuccess(data);
        },
        onError,
    });
};
export const useGetAreas = (skip = 0, limit = 10) => {
    const token = useSessionToken();
    return useQuery(
        [AREAS_CACHE_KEY, 'list', skip, limit],
        async () => {
            try {
                if (!token) {
                    throw new Error("Session token not available");
                }
                return await AreaClient.listAreas(skip, limit, token);
            } catch (error) {
                throw error;
            }
        },
        { staleTime: STALE_TIME, enabled: !!token },
    );
};