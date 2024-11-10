'use client';

import { Copy } from 'lucide-react';
import { useParams } from 'next/navigation'; // Using useParams for parameter extraction
import React from 'react';
import { Action, ActionedInput, copyTextToClipboard, toast, useGetIntegration } from 'ui'; // Adjust the import path as needed

const IntegrationDetailPage: React.FC = () => {
    const params = useParams();
    const id = params.id as string;

    // Fetch the details of a specific integration
    const { data: integration, isLoading } = useGetIntegration(id);

    if (isLoading) return <div className="text-center p-6"><div>Loading integration details...</div></div>;

    // Function to handle copying text to the clipboard and showing a toast
    async function handleCopy(text: string) {
        copyTextToClipboard(text);
        toast({
            title: 'Copied to clipboard',
            description: 'Copied',
            duration: 1000,
        })
    }

    // Function to create a copy action for a given text
    function createCopyAction(text: string): Action {
        return {
            name: '',
            id: 'copy',
            icon: Copy,
            modalDescription: 'Copy to Clipboard',
            modalTitle: 'Copy to Clipboard',
            noPopUp: true,
            onClick: () => handleCopy(text),
        };
    }

    return (
        <div className="m-8 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="p-6">
                <h1 className="text-4xl  mb-6">Integration Details</h1>
                {integration && (
                    <div className="space-y-4">
                        {/* another actioned input but for the oauth access token */}
                        <ActionedInput
                            label="OrgId"
                            value={integration.org_id ?? ''}
                            endActions={[createCopyAction(integration.org_id || 'N/A')]} 
                            id={'Organiztion Access Token'}                        
                            />
                        <ActionedInput
                            label="OAuth Access Token"
                            value={integration.oauth_token_info?.access_token ?? ''}
                            endActions={[createCopyAction(integration.oauth_token_info?.access_token || 'N/A')]} 
                            id={'Organiztion Access Token'}                        
                            />
                        <ActionedInput
                            label="ID"
                            value={integration.id || 'N/A'}
                            id="IntegrationID"
                            endActions={[createCopyAction(integration.id || 'N/A')]}
                        />
                        <ActionedInput
                            label="Client Credential Token"
                            value={integration.access_token || 'N/A'}
                            id="ClientCredentialToken"
                            endActions={[createCopyAction(integration.access_token || 'N/A')]}
                        />
                        <ActionedInput
                            label="Token Expiration Date"
                            value={integration.access_token_expiration_date || 'N/A'}
                            id="AuthFlowToken"
                            endActions={[createCopyAction(integration.access_token_expiration_date || 'N/A')]}
                        />
                        <ActionedInput
                            label="Client Scope"
                            value={integration.client_cred_scope || 'N/A'}
                            id="ClientScope"
                            endActions={[createCopyAction(integration.client_cred_scope || 'N/A')]}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default IntegrationDetailPage;