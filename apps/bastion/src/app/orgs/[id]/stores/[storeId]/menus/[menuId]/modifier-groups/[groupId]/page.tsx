'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { Button, ModifierGroup, Item, Collapsible, toast, useGetAllItemsByMenu } from 'ui';
import { useParams, useRouter } from 'next/navigation';
import ModifierGroupInput from '../../../../../../../../components/modifier-group-input';
import MenuItemSelect from '../../../../../../../../components/menu-item-select';
import { useGetModifierGroupById, useUpdateModifierGroup, useCreateModifierGroup, useDeleteModifierGroup } from 'ui'

const ModifierGroupDetail: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const menuId = params.menuId as string;
    const modifierGroupId = params.groupId as string;

    const [localModifierGroup, setLocalModifierGroup] = useState<ModifierGroup>({
        menu_id: menuId,
        name: '',
        item_ids: [],
        minimum_selections: 0,
        maximum_selections: 0,
        required: false,
        is_active: true,
    });

    const { data: items } = useGetAllItemsByMenu(menuId);
    const { data: modifierGroupData } = useGetModifierGroupById(modifierGroupId);

    // Update local state when modifier group data is fetched
    useEffect(() => {
        if (modifierGroupData) {
            setLocalModifierGroup({
                ...modifierGroupData,
                item_ids: modifierGroupData.item_ids || [],
            });
        }
    }, [modifierGroupData]);

    const updateMutation = useUpdateModifierGroup({
        onSuccess: () => {
            toast({
                title: 'Modifier Group Updated',
                description: `Modifier Group ${localModifierGroup.name} has been updated.`,
                duration: 5000,
            });
            router.push(`/orgs/${params.id}/menus/${menuId}/modifier-groups`);
        }
    });

    const createMutation = useCreateModifierGroup({
        onSuccess: () => {
            toast({
                title: 'Modifier Group Created',
                description: `Modifier Group ${localModifierGroup.name} has been created.`,
                duration: 5000,
            });
            router.push(`/orgs/${params.id}/menus/${menuId}/modifier-groups`);
        }
    });

    const deleteMutation = useDeleteModifierGroup({
        onSuccess: () => {
            toast({
                title: 'Modifier Group Deleted',
                description: 'The modifier group has been deleted successfully.',
                duration: 5000,
            });
            router.push(`/orgs/${params.id}/menus/${menuId}/modifier-groups`);
        }
    });

    const handleItemSelect = useCallback((item: Item) => {
        setLocalModifierGroup(prev => ({
            ...prev,
            item_ids: [...(prev?.item_ids ?? []), item.id!],
        }));
    }, []);

    const handleItemRemove = useCallback((itemId: string) => {
        setLocalModifierGroup(prev => ({
            ...prev,
            item_ids: prev?.item_ids?.filter(id => id !== itemId),
        }));
    }, []);

    const handleSave = useCallback(() => {
        if (localModifierGroup.id) {
            updateMutation.mutate({
                modifierGroupId: localModifierGroup.id,
                modifierGroupData: localModifierGroup
            });
        } else {
            createMutation.mutate({
                menuId: menuId,
                modifierGroup: localModifierGroup
            });
        }
    }, [localModifierGroup, menuId]);

    return (
        <div className="m-8">
            <Collapsible stepHeaderProps={{ text: 'Modifier Group Details' }}>
                <ModifierGroupInput
                    onChange={(modifierGroup) => setLocalModifierGroup(prev => ({
                        ...prev!,
                        ...modifierGroup,
                    }))}
                    menuId={menuId}
                    modifierGroupId={localModifierGroup?.id}
                    modifierGroup={localModifierGroup}
                />
            </Collapsible>
            <Collapsible stepHeaderProps={{ text: 'Add Items to Modifier Group' }}>
                <MenuItemSelect menuId={menuId} onSelect={handleItemSelect} />
                {items && localModifierGroup?.item_ids?.map(itemId => (
                    <ItemBadge key={itemId} item={items.find(it => it.id === itemId)} onRemove={handleItemRemove} />
                ))}
            </Collapsible>
            <Button onClick={handleSave}>Save</Button>
            {modifierGroupId !== 'new' && (
                <Button className="ml-4 bg-secondary-pink-salmon hover:bg-red-600" onClick={() => {
                    deleteMutation.mutate(modifierGroupId);
                    router.push(`/orgs/${params.id}/menus/${menuId}/modifier-groups`);
                }}>
                    Delete
                </Button>
            )}
        </div>
    );
};

const ItemBadge: React.FC<{ item?: Item, onRemove: (id: string) => void }> = ({ item, onRemove }) => {
    return (
        <div className="inline-block p-2 m-1 bg-gray-200 rounded">
            {item?.name}
            <button onClick={() => onRemove(item!.id!)}>×</button>
        </div>
    );
};

export default ModifierGroupDetail;