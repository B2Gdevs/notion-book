'use client'

import _ from 'lodash';
import { Category, Item, Menu, ModifierGroup, Photo } from '../../models/menuModels';
import { useGetCategoriesByIds } from '../categoryHooks';
import { useGetMenusByStore } from '../menuHooks';
import { useGetModifierGroupsByMenuIds } from '../modifierGroupHooks';
import { useGetPhotosByMenuIds } from '../photoHooks';
import { useGetItemsByMenuIds } from '../itemHooks';

interface MenuData {
    menus: Record<string, Menu>;
    items: Record<string, Item>;
    photos: Record<string, Photo>;
    modifierGroups: Record<string, ModifierGroup>;
    categories: Record<string, Category>;
    isLoading: boolean;
}

export const useMenuDataFromStoreId = (storeId: string): MenuData => {
    const { data: menus } = useGetMenusByStore(storeId, true) as { data: Record<string, Menu> };
    const categoryIds = _.flattenDeep(Object.values(menus).map(menu => menu?.category_ids ?? []) ?? []);
    let { data: categories, isLoading: isCategoriesLoading } = useGetCategoriesByIds(categoryIds, true);

    let { data: modifierGroups, isLoading: isModifiersLoading } = useGetModifierGroupsByMenuIds(Object.keys(menus), true);
    let { data: photos, isLoading: isPhotosLoading } = useGetPhotosByMenuIds(Object.keys(menus), true);
    let { data: items, isLoading: isItemsLoading } = useGetItemsByMenuIds(Object.keys(menus), true);

    const isLoading = isCategoriesLoading || isModifiersLoading || isPhotosLoading || isItemsLoading;

    let typedItems: Record<string, Item> = {};
    let typedPhotos: Record<string, Photo> = {};
    let typedModifierGroups: Record<string, ModifierGroup> = {};
    let typedCategories: Record<string, Category> = {};
    // Assign the values to the variables
    typedItems = (items as Record<string, Item>) ?? {};
    typedPhotos = (photos as Record<string, Photo>) ?? {};
    typedModifierGroups = (modifierGroups as Record<string, ModifierGroup>) ?? {};
    typedCategories = (categories as Record<string, Category>) ?? {};
    items = typedItems;
    photos = typedPhotos;
    modifierGroups = typedModifierGroups;
    categories = typedCategories;


    return {
        menus,
        items,
        photos,
        modifierGroups,
        categories,
        isLoading,
    };
};