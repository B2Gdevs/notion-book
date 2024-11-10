'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import {
    Button,
    CodeBlock,
    ConfirmationDialog,
    Org,
    OrgSelect,
    OrgType,
    useDeleteOrgGroup,
    useGetOrgGroupById,
    useGetOrgsByIds,
    useToast,
    useUpdateOrg,
    useUpdateOrgGroup
} from 'ui';

const OrgGroupEditor: React.FC = () => {
    const router = useRouter();
    const { toast } = useToast();
    const [selectedOrg, setSelectedOrg] = useState<Org | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const params = useParams();
    const orgGroupId = (params.orgGroupId || params.id) as string;

    const { data: orgGroup } = useGetOrgGroupById(orgGroupId);
    const { data: orgsInGroup } = useGetOrgsByIds(orgGroup?.org_ids ?? []);


    const updateOrgGroupMutation = useUpdateOrgGroup({
        onSuccess: () => {
            toast({
                title: 'Org Group updated',
                description: 'Org Group updated successfully',
                duration: 3000,
            });
            queryClient.invalidateQueries(['orgGroup', orgGroupId]);
        },
    });

    const updateOrgMutation = useUpdateOrg({
        onSuccess: () => {
            toast({
                title: 'Org updated',
                description: 'Org updated successfully',
                duration: 3000,
            });
            queryClient.invalidateQueries(['org', orgGroup?.id]);
        },
    });

    const handleSubmit = () => {
        if (selectedOrg && selectedOrg.id && orgGroup?.id) {
            // Create a copy of the orgGroup
            const updatedOrgGroup = { ...orgGroup };

            // Add the selectedOrg.id to the org_ids array
            if (updatedOrgGroup.org_ids) {
                updatedOrgGroup.org_ids.push(selectedOrg.id);
            } else {
                updatedOrgGroup.org_ids = [selectedOrg.id];
            }
            const updatedOrg = { ...selectedOrg, org_group_id: orgGroup.id };

            // Update the org group
            updateOrgGroupMutation.mutate({ orgGroupId: orgGroup.id, orgGroupData: updatedOrgGroup });
            updateOrgMutation.mutate(updatedOrg);
        }
    };

    const handleRemoveOrg = (orgIdToRemove: string) => {
        if (orgGroup?.id) {
            // Create a copy of the orgGroup
            const updatedOrgGroup = { ...orgGroup };
            // find org with orgIdToRemove
            const removingOrg = orgsInGroup?.find(org => org.id === orgIdToRemove);
            // update org with empty org_group_id
            const updatedOrg = {
                ...removingOrg,
                org_group_id: '',
                name: removingOrg?.name || '',
                distribution_list: {},
            };

            // Remove the orgIdToRemove from the org_ids array
            updatedOrgGroup.org_ids = updatedOrgGroup?.org_ids?.filter(orgId => orgId !== orgIdToRemove);

            // Update the org group
            updateOrgGroupMutation.mutate({ orgGroupId: orgGroup?.id ?? '', orgGroupData: updatedOrgGroup })
            updateOrgMutation.mutate(updatedOrg);
        };
    };

    const deleteOrgGroupMutation = useDeleteOrgGroup({
        onSuccess: () => {
            toast({
                title: 'Org Group deleted',
                description: 'Org Group deleted successfully',
                duration: 3000,
            });
            router.push('/orggroups');
        },
        onError: (error) => {
            console.error('Error deleting org group:', error);
            toast({
                title: 'Error deleting org group',
                description: 'Error deleting org group',
                duration: 3000,
            });
        },
    });

    const handleConfirmDelete = () => {
        deleteOrgGroupMutation.mutate(orgGroup?.id ?? '');
    };

    return (
        <div className='p-4 flex flex-col gap-y-4'>
            <h2 className='font-righteous text-2xl'>Orgs Within <CodeBlock>{orgGroup?.name}</CodeBlock> Org Group</h2>
            {orgsInGroup && orgsInGroup.map(org => (
                <div key={org.id} className='flex justify-start items-center gap-2'>
                    <p>{org.name}</p>
                    <Button
                        size='sm'
                        onClick={() => { if (org.id) handleRemoveOrg(org.id) }}
                    >
                        Remove
                    </Button>
                </div>
            ))}
            {!orgsInGroup && <p>No orgs in this group.</p>}
            <div className='flex flex-col justify-start items-start gap-2 p-2 bg-secondary-corn-yellow rounded-lg'>
                <h2>Orgs Available To Add</h2>
                <OrgSelect
                    onChange={setSelectedOrg}
                    initialOrgId={selectedOrg?.id || ''}
                    orgsToFilterOut={orgGroup?.org_ids}
                    orgTypeFilterOut={OrgType.RESTAURANT}
                />
                <Button onClick={handleSubmit}>
                    Save
                </Button>
            </div>

            <Button
                onClick={() => setIsDialogOpen(true)}
                className=' bg-red-500 text-white '
            >
                Delete Org Group
            </Button>

            {/* Add your org group editor components here */}

            <ConfirmationDialog
                message="Are you sure you want to delete this org group?"
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
};

export default OrgGroupEditor;