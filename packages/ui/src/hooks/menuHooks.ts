'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { MenuClient } from '../clients/menuClient';
import { Menu } from '../models/menuModels';
import { MutationCallbacks } from '../lib/utils';
import { GetMenusQueryParams } from '../clients/menuClient/menuPart';

export const MENU_CACHE_KEY = 'menu';
export const MENUS_BY_STORE_CACHE_KEY = 'menusByStore';

const useSessionToken = () => {
	const { useSessionToken } = require('./sessionHooks');
	return useSessionToken();
  };

export const useCreateMenu = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(
		async (menu: Menu) => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.createMenu(menu, token);
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(MENUS_BY_STORE_CACHE_KEY);
				if (onSuccess) onSuccess();
			},
			onError,
		}
	);
};

export const useGetMenu = (menuId: string) => {
	const token = useSessionToken();
	return useQuery(
		[MENU_CACHE_KEY, menuId],
		async () => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.getMenu(menuId, token);
		},
		{
			enabled: !!menuId && !!token,
		}
	);
};

export const useGetMenus = (queryParams?: GetMenusQueryParams) => {
	const token = useSessionToken();
	return useQuery<Menu[], Error>(
	  ['menus', queryParams],
	  async () => {
		if (!token) {
		  throw new Error("Session token not available");
		}
		try {
		  return await MenuClient.getMenus(queryParams, token);
		} catch (error) {
		  if (error instanceof Error) {
			return [];  // Return an empty array if no items are found
		  }
		  throw error;  // Re-throw other errors to be handled by onError
		}
	  },
	  {
		enabled: !!queryParams && !!token
		,
		onError: (error) => {
		  console.error("Failed to fetch menus:", error);
		}
	  },
	);
};

export const useGetMenusByStore = (storeId: string, returnAsRecord = false) => {
	const token = useSessionToken();
	const queryInfo = useQuery(
	  [MENUS_BY_STORE_CACHE_KEY, storeId],
	  async () => {
		if (!token) {
		  throw new Error("Session token not available");
		}
		return MenuClient.getMenusByStore(storeId, token);
	  },
	  {
		enabled: !!storeId && !!token,
	  }
	);
  
	if (returnAsRecord) {
	  const menusRecord: Record<string, Menu> = {};
	  queryInfo.data?.forEach((menu) => {
		if (menu?.id) menusRecord[menu.id] = menu;
	  });
	  return { ...queryInfo, data: menusRecord };
	}
  
	return queryInfo;
};

export const useUpdateMenu = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(
		async ({ menuId, menu }: { menuId: string; menu: Menu }) => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.updateMenu(menuId, menu, token);
		},
		{
			onSuccess: (_, variables) => {
				queryClient.invalidateQueries([MENU_CACHE_KEY, variables.menuId]);
				queryClient.invalidateQueries(MENUS_BY_STORE_CACHE_KEY);
				if (onSuccess) onSuccess();
			},
			onError,
		}
	);
};

export const useDeleteMenu = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(
		async (menuId: string) => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.deleteMenu(menuId, token);
		},
		{
			onSuccess: (data, variables) => {
				console.debug('useDeleteMenu onSuccess', data, variables);
				queryClient.invalidateQueries([MENU_CACHE_KEY, variables]);
				queryClient.invalidateQueries(MENUS_BY_STORE_CACHE_KEY);
				if (onSuccess) onSuccess();
			},
			onError,
		}
	);
};