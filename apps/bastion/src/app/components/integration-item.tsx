'use client'
import { Save, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { ActionedInput, Button, CodeBlock, Integration, PageTitleDisplay, handleInputChange, toast, useGetOrg, useUpdateIntegration } from 'ui'; // Adjust the import path as necessary

interface IntegrationItemProps {
    integration: Integration;
    onDelete: (integrationId: string) => void;
}

const IntegrationItem: React.FC<IntegrationItemProps> = ({ integration, onDelete }) => {
    const [editIntegration, setEditIntegration] = useState<Integration>(integration);
    const { data: org } = useGetOrg(integration.org_id ?? '');
    const { mutate: updateIntegration, isLoading: isUpdating } = useUpdateIntegration({
        onSuccess: () => {
            // Handle successful update here, e.g., show a notification
            toast(
                {
                    title: 'Success',
                    description: 'Integration updated successfully',
                    duration: 5000
                }
            )
        },
        onError: (error) => {
            toast(
                {
                    title: 'Error',
                    description: error.message,
                    duration: 5000
                }
            )
        },
    });

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        handleInputChange<Integration>(e, setEditIntegration);
    };

    const handleSaveChanges = () => {
        updateIntegration({ id: editIntegration.id ?? '', integration: editIntegration });
    };

    return (
        <div className="card bg-white shadow-lg rounded-lg p-4 mb-4 border border-black"> {/* Added border and rounded corners */}

            <div className="card-header flex-col justify-between items-center mb-4">
                <PageTitleDisplay overrideTitle={`Org`} additionalText={`${org?.name ?? 'N/A'}`} />
                <div className="text-sm font-righteous mt-2">
                    Org ID: <CodeBlock>{org?.id ?? 'N/A'}</CodeBlock>
                </div>
                <div className="text-sm font-righteous mt-2">
                    Integration ID: <CodeBlock>{integration?.id ?? 'N/A'}</CodeBlock>
                </div>
                {/* created at */}
                <div className="text-sm font-righteous mt-2">
                    Created At: <CodeBlock>{integration?.created_at ?? 'N/A'}</CodeBlock>
                </div>

                {/* updated at */}
                <div className="text-sm font-righteous mt-2">
                    Updated At: <CodeBlock>{integration?.updated_at ?? 'N/A'}</CodeBlock>
                </div>
            </div>
            <div className="card-body">
                <ActionedInput
                    label="Integration Name"
                    value={editIntegration.name ?? ''}
                    onChange={handleEditChange}
                    name="name"
                    id="name"
                    className='font-righteous'
                    disabled
                />
                <ActionedInput
                    label="Client Credential Scope"
                    value={editIntegration.client_cred_scope ?? ''}
                    onChange={handleEditChange}
                    name="client_cred_scope"
                    id="client_cred_scope"
                />
            </div>
            <div className="card-footer text-right mt-4 flex justify-between">
                <Button
                    onClick={handleSaveChanges}
                    className="  text-white  py-2 px-4 rounded border border-black flex items-center"
                    disabled={isUpdating}
                >
                    {isUpdating ? <Save className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />} Save Changes
                </Button>
                <div>

                    <Button
                        onClick={() => onDelete(editIntegration.id ?? "")}
                        className="bg-secondary-pink-salmon  text-white  py-2 px-4 rounded border border-black flex items-center"
                    >
                        <Trash2 className="mr-2" size={16} /> Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default IntegrationItem;