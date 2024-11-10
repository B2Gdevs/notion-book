'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { MenuClient } from '../clients/menuClient';
import { Category } from '../models/menuModels';
import { MutationCallbacks } from '../lib/utils';

const CATEGORY_CACHE_KEY = 'category';
const CATEGORIES_CACHE_KEY = 'categories';
const CATEGORIES_BY_MENU_IDS_CACHE_KEY = 'categoriesByMenuIds';
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};

export const useCreateCategory = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async ({ menuId, category }: { menuId: string; category: Category }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return MenuClient.createCategory(menuId, category, token);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(CATEGORIES_CACHE_KEY);
                if (onSuccess) onSuccess();
            },
            onError,
        },
    );
};

export const useGetCategoryById = (categoryId: string) => {
    const token = useSessionToken();
    return useQuery(
        [CATEGORY_CACHE_KEY, categoryId],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return MenuClient.getCategoryById(categoryId, token);
        },
        {
            staleTime: STALE_TIME,
            enabled: !!categoryId && !!token,
        },
    );
};

export const useGetCategoriesByIds = (categoryIds: string[], returnAsRecord = false) => {
    const token = useSessionToken();
    const queryInfo = useQuery(
        [CATEGORIES_CACHE_KEY, 'byIds', categoryIds],
        async () => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return MenuClient.getCategoriesByIds(categoryIds, token);
        },
        {
            staleTime: STALE_TIME,
            enabled: (categoryIds?.length ?? 0) > 0 && !!token,
        },
    );

    if (returnAsRecord) {
        const categoriesRecord: Record<string, Category> = {};
        queryInfo.data?.forEach((category) => {
            if (category?.id) categoriesRecord[category.id] = category;
        });
        return { ...queryInfo, data: categoriesRecord };
    }

    return queryInfo;
};


export const useUpdateCategory = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async ({
            categoryId,
            categoryData,
        }: { categoryId: string; categoryData: Category }) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return MenuClient.updateCategory(categoryId, categoryData, token);
        },
        {
            onSuccess: (data, variables) => {
                console.debug('useUpdateCategory onSuccess', data, variables);
                queryClient.invalidateQueries([
                    CATEGORY_CACHE_KEY,
                    variables.categoryId,
                ]);
                queryClient.invalidateQueries(CATEGORIES_CACHE_KEY);
                if (onSuccess) onSuccess();
            },
            onError,
        },
    );
};

export const useDeleteCategory = ({
    onSuccess,
    onError,
}: MutationCallbacks = {}) => {
    const queryClient = useQueryClient();
    const token = useSessionToken();
    return useMutation(
        async (categoryId: string) => {
            if (!token) {
                throw new Error("Session token not available");
            }
            return MenuClient.deleteCategory(categoryId, token);
        },
        {
            onSuccess: (data, variables) => {
                console.debug('useDeleteCategory onSuccess', data, variables);
                queryClient.invalidateQueries(                [CATEGORY_CACHE_KEY, variables]);
                queryClient.invalidateQueries(CATEGORIES_CACHE_KEY);
                if (onSuccess) onSuccess(data);
            },
            onError,
        },
    );
};

export const useGetCategoriesByMenuIds = (menuIds: string[]) => {
    const token = useSessionToken();
    return useQuery(
      [CATEGORIES_BY_MENU_IDS_CACHE_KEY, menuIds.join(',')], // Unique key for the query
      async () => {
        if (!token) {
          throw new Error("Session token not available");
        }
        return MenuClient.getCategoriesByMenuIds(menuIds, token);
      },
      {
        enabled: !!menuIds.length && !!token, // Only run the query if menuIds is not empty and token is available
      },
    );
  };