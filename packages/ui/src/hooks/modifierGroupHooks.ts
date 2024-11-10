'use client'
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { MenuClient } from '../clients/menuClient';
import { ModifierGroup } from '../models/menuModels';
import { MutationCallbacks } from '../lib/utils';

const MODIFIER_GROUP_CACHE_KEY = 'modifierGroup';
const MODIFIER_GROUPS_BY_MENU_CACHE_KEY = 'allModifierGroupsByMenu';
const MODIFIER_GROUPS_BY_MENU_IDS_CACHE_KEY = 'modifierGroupsByMenuIds';

const useSessionToken = () => {
	const { useSessionToken } = require('./sessionHooks');
	return useSessionToken();
  };

export const useCreateModifierGroup = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(
		async ({
			menuId,
			modifierGroup,
		}: { menuId: string; modifierGroup: ModifierGroup }) => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.createModifierGroup(menuId, modifierGroup, token);
		},
		{
			onSuccess: () => {
				queryClient.invalidateQueries(MODIFIER_GROUPS_BY_MENU_CACHE_KEY);
				if (onSuccess) onSuccess();
			},
			onError,
		},
	);
};

export const useGetModifierGroupById = (modifierGroupId: string) => {
	const token = useSessionToken();
	return useQuery(
		[MODIFIER_GROUP_CACHE_KEY, modifierGroupId],
		async () => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.getModifierGroupById(modifierGroupId, token);
		},
		{
			enabled: !!modifierGroupId && !!token,
		},
	);
};

export const useGetModifierGroupsByIds = (modifierGroupIds: string[]) => {
	const token = useSessionToken();
	return useQuery(
		[MODIFIER_GROUP_CACHE_KEY, 'byIds', modifierGroupIds],
		async () => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.getModifierGroupsByIds(modifierGroupIds, token);
		},
		{
			enabled: (modifierGroupIds?.length ?? 0) > 0 && !!token,
		},
	);
};

export const useGetModifierGroupsByMenu = (menuId: string) => {
	const token = useSessionToken();
	return useQuery(
		[MODIFIER_GROUPS_BY_MENU_CACHE_KEY, menuId],
		async () => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.getAllModifierGroupsByMenu(menuId, token);
		},
		{
			enabled: !!menuId && !!token,
		},
	);
};

export const useUpdateModifierGroup = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(
		async ({
			modifierGroupId,
			modifierGroupData,
		}: { modifierGroupId: string; modifierGroupData: ModifierGroup }) => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.updateModifierGroup(modifierGroupId, modifierGroupData, token);
		},
		{
			onSuccess: (data, variables) => {
				console.debug('useUpdateModifierGroup onSuccess', data, variables);
				queryClient.invalidateQueries([
					MODIFIER_GROUP_CACHE_KEY,
					variables.modifierGroupId,
				]);
				queryClient.invalidateQueries(MODIFIER_GROUPS_BY_MENU_CACHE_KEY);
				if (onSuccess) onSuccess();
			},
			onError,
		},
	);
};

export const useDeleteModifierGroup = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(
		async (modifierGroupId: string) => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.deleteModifierGroup(modifierGroupId, token);
		},
		{
			onSuccess: (data, variables) => {
				console.debug('useDeleteModifierGroup onSuccess', data, variables);
				queryClient.invalidateQueries([MODIFIER_GROUP_CACHE_KEY, variables]);
				queryClient.invalidateQueries(MODIFIER_GROUPS_BY_MENU_CACHE_KEY);
				if (onSuccess) onSuccess();
			},
			onError,
		}
	);
};

export const useGetModifierGroupsByMenuIds = (menuIds: string[], returnAsRecord = false) => {
	const token = useSessionToken();
	const queryInfo = useQuery(
	  [MODIFIER_GROUPS_BY_MENU_IDS_CACHE_KEY, menuIds.join(',')], // Unique key for the query
	  async () => {
		if (!token) {
		  throw new Error("Session token not available");
		}
		return MenuClient.getModifierGroupsByMenuIds(menuIds, token);
	  },
	  {
		enabled: !!menuIds.length && !!token, // Only run the query if menuIds is not empty and token is available
	  },
	);
  
	if (returnAsRecord) {
	  const modifierGroupsRecord: Record<string, ModifierGroup> = {};
	  queryInfo.data?.forEach((modifierGroup) => {
		if (modifierGroup?.id) modifierGroupsRecord[modifierGroup.id] = modifierGroup;
	  });
	  return { ...queryInfo, data: modifierGroupsRecord };
	}
  
	return queryInfo;
  };