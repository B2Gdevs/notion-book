'use client'
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button, ModifierGroup, Progress, useDeleteModifierGroup, useGetModifierGroupsByMenu } from 'ui'; // Adjusted imports
import ModifierGroupList from '../../../../../../../components/modifier-group-list';

const ModifierGroupsPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const orgId = params.id as string;
    const menuId = params.menuId as string;
    const storeId = params.storeId as string; // Focusing on storeId
    const [deleteProgress, setDeleteProgress] = useState(0); // Track deletion progress
    const { data: modifierGroups, refetch } = useGetModifierGroupsByMenu(menuId); // Fetch all modifier groups for the menu

    // Hook to delete a single modifier group
    const { mutate: deleteModifierGroup } = useDeleteModifierGroup({
        onSuccess: () => {
            setDeleteProgress((prevProgress) => prevProgress + 1); // Update progress after each deletion
            if (deleteProgress + 1 === modifierGroups?.length) {
                // If all groups have been deleted
                setDeleteProgress(0); // Reset progress
                refetch(); // Refetch the modifier groups list
            }
        },
    });

    // Function to delete all modifier groups
    const clearAllModifierGroups = () => {
        if (window.confirm('Are you sure you want to delete ALL modifier groups?')) {
            modifierGroups?.forEach((modifierGroup) => {
                deleteModifierGroup(modifierGroup?.id ?? '');
            });
        }
    };

    const deletePercentage = modifierGroups && modifierGroups.length > 0 ? (deleteProgress / modifierGroups.length) * 100 : 0;

    return (
        <div>
            <div className='flex space-x-2'>
                <Button onClick={() => router.push(`/orgs/${orgId}/stores/${storeId}/menus/${menuId}/modifier-groups/new`)}>
                    Add A Modifier Group
                </Button>
                <Button className='bg-secondary-pink-salmon' onClick={clearAllModifierGroups} disabled={deleteProgress > 0}>
                    Clear All
                </Button>
            </div>
            {deleteProgress > 0 && (
                <>
                    <Progress value={deletePercentage} className="my-4" />
                    <div>Deleting modifier groups: {deleteProgress} of {modifierGroups?.length}</div>
                </>
            )}
            <ModifierGroupList storeId={storeId} onSelect={(modifierGroup: ModifierGroup) => {
                router.push(`/orgs/${orgId}/stores/${storeId}/modifier-groups/${modifierGroup.id}`);
            }} />
        </div>
    );
};

export default ModifierGroupsPage;