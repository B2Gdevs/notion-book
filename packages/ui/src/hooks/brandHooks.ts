// src/hooks/brandHooks.ts
'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { BrandClient, BrandQueryParams } from '../clients/brandClient';
import { Brand } from '../models/brandModels';
import { MutationCallbacks } from '../lib/utils';

const BRANDS_CACHE_KEY = 'brands';
const BRAND_CACHE_KEY = 'brand';

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};

export const useCreateBrand = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    const queryClient = useQueryClient();

    return useMutation(
        async (brand: Brand) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return BrandClient.createBrand(brand, token);
        },
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(BRANDS_CACHE_KEY);
                if (onSuccess) {
                    onSuccess(data);
                }
            },
            onError,
        },
    );
};

export const useGetBrandById = (brandId: string) => {
    const token = useSessionToken();
    return useQuery(
        [BRAND_CACHE_KEY, brandId],
        async () => {
            return BrandClient.getBrandById(brandId, token);
        },
        {
            enabled: !!brandId && !!token,
        },
    );
};

export const useGetBrands = (params: BrandQueryParams) => {
    const token = useSessionToken();
    return useQuery([BRANDS_CACHE_KEY, params], async () => {
        if (!token) {
            throw new Error("Session token not available");
        }
        return BrandClient.getBrands(params, token);
    }, {
        enabled: !!token,
    });
};

export const useGetBrandsByIds = (brandIds: string[]) => {
    const token = useSessionToken();
    return useQuery(
        [BRANDS_CACHE_KEY, brandIds],
        async () => {
            return BrandClient.getBrandsByIds(brandIds, token);
        },
        {
            enabled: ((brandIds?.length ?? 0) > 0) && !!token,
        },
    );
}

export const useUpdateBrand = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    const queryClient = useQueryClient();

    return useMutation(
        async ({
            brandId,
            brandData,
        }: { brandId: string; brandData: Brand }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return BrandClient.updateBrand(brandId, brandData, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([
                    BRAND_CACHE_KEY,
                    variables.brandId,
                ]);
                queryClient.invalidateQueries(BRANDS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};

export const useDeleteBrand = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const token = useSessionToken();
    const queryClient = useQueryClient();

    return useMutation(
        async (brandId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return BrandClient.deleteBrand(brandId, token);
        },
        {
            onSuccess: (data, variables) => {
                queryClient.invalidateQueries([BRAND_CACHE_KEY, variables]);
                queryClient.invalidateQueries(BRANDS_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};