'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { Button, Collapsible, Item, JWT_TEMPLATE, MenuClient, ModifierGroup, Photo, toast } from 'ui';
import ItemInput from '../../../../../../../../components/item-input';
import ModifierGroupSelect from '../../../../../../../../components/modifier-group-select';
import PhotoSelect from '../../../../../../../../components/photo-select';
import { useSession } from '@clerk/nextjs';

const MenuDetail: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const menuId = params.menuId as string;
    const itemId = params.itemId as string;
    const storeId = params.storeId as string;
    const session = useSession().session;

    const [localPhotos, setLocalPhotos] = useState<Photo[]>([]);
    const [localModifierGroups, setLocalModifierGroups] = useState<ModifierGroup[]>([]);

    const [itemState, setItemState] = useState<Item>({
        description: '',
        menu_id: menuId,
        name: '',
        modifier_group_ids: [],
        price: { currency_code: 'USD', amount: 0 },
        photo_ids: [],
        sale_status: 'FOR_SALE',
        is_active: true,
    });

    const fetchPhotos = async () => {
        const token = await session?.getToken({ template: JWT_TEMPLATE });
        return MenuClient.getAllPhotosByMenu(menuId, token ?? '');
    };

    const fetchModifierGroups = async () => {
        const token = await session?.getToken({ template: JWT_TEMPLATE });
        return MenuClient.getAllModifierGroupsByMenu(menuId, token ?? '');
    };

    const { data: photos } = useQuery<Photo[]>(['photos', menuId], fetchPhotos);
    const { data: modifierGroups } = useQuery<ModifierGroup[]>(['modifierGroups', menuId], fetchModifierGroups);

    // Fetch item details
    useQuery<Item | undefined>(
        ['item', menuId, itemId],
        async () => {
            if (!itemId || itemId === 'new') return;
            const token = await session?.getToken({ template: JWT_TEMPLATE });
            return MenuClient.getItemById(itemId, token ?? '');
        },
        {
            enabled: !!itemId,
            onSuccess: (data) => {
                if (data) {
                    setItemState(data);
                    const associatedPhotos = (data.photo_ids || []).map(id => photos?.find(photo => photo.id === id)).filter(Boolean) as Photo[];
                    setLocalPhotos(associatedPhotos);
                    const associatedModifierGroups = (data.modifier_group_ids || []).map(id => modifierGroups?.find(group => group.id === id)).filter(Boolean) as ModifierGroup[];
                    setLocalModifierGroups(associatedModifierGroups);
                }
            },
        }
    );

    const itemMutation = useMutation(
        async (item: Item) => {
            const token = await session?.getToken({ template: JWT_TEMPLATE });
            let newItem;
            if (item.id) {
                newItem = await MenuClient.updateItem(item.id, item, token ?? '');
            } else {
                newItem = await MenuClient.createItem(menuId, item, token ?? '');
            }
            return newItem;
        }
    );

    const deleteItemMutation = useMutation(
        async (itemId: string) => {
            const token = await session?.getToken({ template: JWT_TEMPLATE });
            return MenuClient.deleteItem(itemId, token ?? '');
        },
        {
            onSuccess: () => {
                toast({
                    title: 'Item Deleted',
                    description: 'The item has been deleted successfully.',
                    duration: 5000,
                });
                router.push(`/orgs/${params.id}/stores/${storeId}/menus/${menuId}/items`);
            },
            onError: (error) => {
                toast({
                    title: 'Error',
                    description: `Error deleting item: ${error instanceof Error ? error.message : 'An error occurred'}`,
                    duration: 5000,
                });
            },
        }
    );

    const handleDeleteItem = async () => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            deleteItemMutation.mutate(itemId);
        }
    };

    const handleDeletePhoto = (photoId: string) => {
        const updatedPhotoIds = itemState.photo_ids?.filter(id => id !== photoId);
        setItemState({ ...itemState, photo_ids: updatedPhotoIds });
        const updatedLocalPhotos = (updatedPhotoIds || []).map(id => photos?.find(photo => photo.id === id)).filter(Boolean) as Photo[];
        setLocalPhotos(updatedLocalPhotos);
    };

    const handlePhotoSelect = (photo: Photo) => {
        if (photo.id && !itemState.photo_ids?.includes(photo.id)) {
            const updatedPhotoIds = [...(itemState.photo_ids || []), photo.id];
            setItemState({ ...itemState, photo_ids: updatedPhotoIds });
            const updatedLocalPhotos = updatedPhotoIds.map(id => photos?.find(photo => photo.id === id)).filter(Boolean) as Photo[];
            setLocalPhotos(updatedLocalPhotos);
        }
    };

    const handleDeleteModifierGroup = (groupId: string) => {
        const updatedGroupIds = itemState.modifier_group_ids.filter(id => id !== groupId);
        setItemState({ ...itemState, modifier_group_ids: updatedGroupIds });
        const updatedLocalModifierGroups = (updatedGroupIds || []).map(id => modifierGroups?.find(group => group.id === id)).filter(Boolean) as ModifierGroup[];
        setLocalModifierGroups(updatedLocalModifierGroups);
    };

    const handleModifierGroupSelect = (group: ModifierGroup) => {
        if (group.id && !itemState.modifier_group_ids.includes(group.id)) {
            const updatedGroupIds = [...itemState.modifier_group_ids, group.id];
            setItemState({ ...itemState, modifier_group_ids: updatedGroupIds });
            const updatedLocalModifierGroups = updatedGroupIds.map(id => modifierGroups?.find(group => group.id === id)).filter(Boolean) as ModifierGroup[];
            setLocalModifierGroups(updatedLocalModifierGroups);
        }
    };

    return (
        <div className="m-8 flex-col justify-center items-center text-center">
            <Collapsible stepHeaderProps={{ text: 'Associated Photos' }}>
                <div className='mt-5'>
                    <PhotoSelect menuId={menuId} onSelect={handlePhotoSelect} />
                    {localPhotos.map(photo => (
                        <div key={photo?.id}>
                            {photo?.fileName}
                            <Button className='bg-secondary-pink-salmon' key={photo.id} onClick={() => handleDeletePhoto(photo?.id ?? '')}>Delete</Button>
                        </div>
                    ))}
                </div>
            </Collapsible>

            <Collapsible stepHeaderProps={{ text: 'Associated Modifier Groups' }}>
                <div className='mt-5'>
                    <ModifierGroupSelect menuId={menuId} onSelect={handleModifierGroupSelect} />
                    {localModifierGroups.map(group => (
                        <div key={group.id}>
                            {group.name} -
                            <Button className='bg-secondary-pink-salmon' onClick={() => handleDeleteModifierGroup(group?.id ?? '')}>Delete</Button>
                        </div>
                    ))}
                </div>
            </Collapsible>

            <Collapsible stepHeaderProps={{ text: 'Item Details' }}>
                <div className='mt-5'>
                    <ItemInput onChange={(item: Item) => { setItemState(item) }} menuId={menuId} item={itemState} />
                </div>
            </Collapsible>

            <Button className='mt-5 w-1/2' onClick={() => {
                if (itemState) {
                    itemMutation.mutate(itemState);
                    toast({
                        title: 'Item updated',
                        description: `Item ${itemState.name} has been updated.`,
                        duration: 5000,
                    });
                }
                router.push(`/orgs/${params.id}/stores/${storeId}/menus/${menuId}/items`);
            }}>Save</Button>
            <Button className='mt-5 w-1/2 bg-secondary-pink-salmon' onClick={handleDeleteItem}>
                Delete Item
            </Button>
        </div>
    );
};

export default MenuDetail;