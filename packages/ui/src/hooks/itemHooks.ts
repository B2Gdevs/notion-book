'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { MenuClient } from '../clients/menuClient';
import { ItemQueryParams } from '../clients/menuClient/itemPart';
import { MutationCallbacks } from '../lib/utils';
import { Item } from '../models/menuModels';

const ITEMS_CACHE_KEY = 'items';
const ITEM_CACHE_KEY = 'item';
const ITEMS_BY_MENU_IDS_CACHE_KEY = 'itemsByMenuIds';
const STALE_TIME = 5 * 60 * 1000; // 5 minutes

const useSessionToken = () => {
	const { useSessionToken } = require('./sessionHooks');
	return useSessionToken();
  };

export const useCreateItem = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(
		async ({ menuId, item }: { menuId: string; item: Item }) => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.createItem(menuId, item, token);
		},
		{
			onSuccess: (data, { menuId }) => {
				queryClient.invalidateQueries([ITEMS_CACHE_KEY, menuId]);
				if (onSuccess) {
					onSuccess(data);
				}
			},
			onError,
		},
	);
};

export const useGetItemById = (itemId: string) => {
	const token = useSessionToken();
	return useQuery(
		[ITEM_CACHE_KEY, itemId],
		async () => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.getItemById(itemId, token);
		},
		{
			staleTime: STALE_TIME,
			enabled: !!itemId && !!token,
		},
	);
};

export const useGetItemsByIds = (itemIds: string[]) => {
	const token = useSessionToken();
	return useQuery(
		[ITEMS_CACHE_KEY, 'byIds', itemIds],
		async () => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.getItemsByIds(itemIds, token);
		},
		{
			staleTime: STALE_TIME,
			enabled: (itemIds?.length ?? 0) > 0 && !!token,
		},
	);
};

export const useGetAllItemsByMenu = (menuId: string) => {
	const token = useSessionToken();
	return useQuery(
		[ITEMS_CACHE_KEY, 'allByMenu', menuId],
		async () => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.getAllItemsByMenu(menuId, token);
		},
		{
			staleTime: STALE_TIME,
			enabled: !!menuId && !!token,
		},
	);
};

export const useGetItemsByMenu = (menuId: string) => {
	const token = useSessionToken();
	return useQuery(
		[ITEMS_CACHE_KEY, 'byMenu', menuId],
		async () => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.getItemsByMenu(menuId, token);
		},
		{
			staleTime: STALE_TIME,
			enabled: !!menuId && !!token,
		},
	);
};


export const useUpdateItem = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	const mutation = useMutation(
		async ({ itemId, itemData }: { itemId: string; itemData: Item }) => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.updateItem(itemId, itemData, token);
		},
		{
			onSuccess: (data, variables) => {
				queryClient.invalidateQueries([ITEM_CACHE_KEY, variables.itemId]);
				queryClient.invalidateQueries([
					ITEMS_CACHE_KEY,
					'byMenu',
					data.menu_id,
				]);
				queryClient.invalidateQueries([ITEMS_BY_MENU_IDS_CACHE_KEY]);
				if (onSuccess) onSuccess(data);
			},
			onError,
		},
	);

	return { ...mutation, data: mutation.data };
};

export const useDeleteItem = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(
		async (itemId: string) => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.deleteItem(itemId, token);
		},
		{
			onSuccess: (data, variables) => {
				queryClient.invalidateQueries([ITEM_CACHE_KEY, variables]);
				queryClient.invalidateQueries(ITEMS_CACHE_KEY); // Invalidate all items related queries
				if (onSuccess) onSuccess(data);
			},
			onError,
		},
	);
};


export const useGetItemsByMenuIds = (menuIds: string[], returnAsRecord = false) => {
	const token = useSessionToken();
	const queryInfo = useQuery(
	  [ITEMS_BY_MENU_IDS_CACHE_KEY, menuIds.join(',')], // Unique key for the query
	  async () => {
		if (!token) {
		  throw new Error("Session token not available");
		}
		return MenuClient.getItemsByMenuIds(menuIds, token);
	  },
	  {
		enabled: !!menuIds.length && !!token, // Only run the query if menuIds is not empty and token is available
	  },
	);
  
	if (returnAsRecord) {
	  const itemsRecord: Record<string, Item> = {};
	  queryInfo.data?.forEach((item) => {
		if (item?.id) itemsRecord[item.id] = item;
	  });
	  return { ...queryInfo, data: itemsRecord };
	}
  
	return queryInfo;
  };


  export const useGetItems = (params: ItemQueryParams) => {
	const token = useSessionToken();
	return useQuery(
	  [ITEMS_CACHE_KEY, params],
	  async () => {
		if (!token) {
		  throw new Error("Session token not available");
		}
		return MenuClient.getItems(params, token);
	  },
	  {
		enabled: !!token,
	  },
	);
  };