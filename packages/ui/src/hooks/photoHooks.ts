'use client';

import { useMutation, useQuery, useQueryClient } from 'react-query';
import { MenuClient } from '../clients/menuClient';
import { Photo } from '../models/menuModels';
import { MutationCallbacks } from '../lib/utils';

const PHOTO_CACHE_KEY = 'photo';
const PHOTOS_BY_MENU_CACHE_KEY = 'photosByMenu';
const PHOTOS_BY_MENU_IDS_CACHE_KEY = 'photosByMenuIds';

const useSessionToken = () => {
    const { useSessionToken } = require('./sessionHooks');
    return useSessionToken();
};


export const useCreatePhoto = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(
		async ({ menuId, photo }: { menuId: string; photo: Photo }) => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.createPhoto(menuId, photo, token);
		},
		{
			onSuccess: (data, variables) => {
				console.debug('useCreatePhoto onSuccess', data, variables);
				queryClient.invalidateQueries([
					PHOTOS_BY_MENU_CACHE_KEY,
					variables.menuId,
				]);
				if (onSuccess) onSuccess(data);
			},
			onError,
		},
	);
};

export const useUpdatePhoto = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(
		async ({ photoId, photo }: { photoId: string; photo: Photo }) => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.updatePhoto(photoId, photo, token);
		},
		{
			onSuccess: (data, variables) => {
				queryClient.invalidateQueries([PHOTO_CACHE_KEY, variables.photoId]);
				queryClient.invalidateQueries([
					PHOTOS_BY_MENU_CACHE_KEY,
					variables.photoId,
				]);
				queryClient.invalidateQueries([
					PHOTOS_BY_MENU_CACHE_KEY,
					data.menu_id,
				]);
				if (onSuccess) onSuccess(data);
			},
			onError,
		},
	);
};

export const useGetPhotoById = (photoId: string) => {
	const token = useSessionToken();
	return useQuery(
		[PHOTO_CACHE_KEY, photoId],
		async () => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.getPhotoById(photoId, token);
		},
		{
			enabled: !!photoId && !!token,
		},
	);
};

export const useGetAllPhotosByMenu = (menuId: string) => {
	const token = useSessionToken();
	return useQuery(
		[PHOTOS_BY_MENU_CACHE_KEY, 'all', menuId],
		async () => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.getAllPhotosByMenu(menuId, token);
		},
		{
			enabled: !!menuId && !!token,
		},
	);
};

export const useGetPhotosByMenu = (menuId: string) => {
	const token = useSessionToken();
	return useQuery(
		[PHOTOS_BY_MENU_CACHE_KEY, menuId],
		async () => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.getPhotosByMenu(menuId, token);
		},
		{
			enabled: !!menuId && !!token,
		},
	);
};

export const useDeletePhoto = ({
	onSuccess,
	onError,
}: MutationCallbacks = {}) => {
	const queryClient = useQueryClient();
	const token = useSessionToken();
	return useMutation(
		async (photoId: string) => {
			if (!token) {
				throw new Error("Session token not available");
			}
			return MenuClient.deletePhoto(photoId, token);
		},
		{
			onSuccess: (_, variables) => {
				queryClient.invalidateQueries([PHOTO_CACHE_KEY, variables]);
				queryClient.invalidateQueries(PHOTOS_BY_MENU_CACHE_KEY);
				if (onSuccess) onSuccess();
			},
			onError,
		},
	);
};

export const useGetPhotosByMenuIds = (menuIds: string[], returnAsRecord = false) => {
	const token = useSessionToken();
	const queryInfo = useQuery(
	  [PHOTOS_BY_MENU_IDS_CACHE_KEY, menuIds.join(',')], // Unique key for the query
	  async () => {
		if (!token) {
		  throw new Error("Session token not available");
		}
		return MenuClient.getPhotosByMenuIds(menuIds, token);
	  },
	  {
		enabled: !!menuIds.length && !!token, // Only run the query if menuIds is not empty and token is available
	  },
	);
  
	if (returnAsRecord) {
	  const photosRecord: Record<string, Photo> = {};
	  queryInfo.data?.forEach((photo) => {
		if (photo?.id) photosRecord[photo.id] = photo;
	  });
	  return { ...queryInfo, data: photosRecord };
	}
  
	return queryInfo;
  };