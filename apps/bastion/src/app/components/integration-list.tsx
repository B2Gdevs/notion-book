'use client'

import React from 'react';
import { Integration } from 'ui'; // Adjust the import path as necessary
import IntegrationItem from './integration-item';

interface IntegrationListProps {
    integrations: Integration[];
    onDelete: (integrationId: string) => void;
}

const IntegrationList: React.FC<IntegrationListProps> = ({ integrations, onDelete }) => {
    return (
        <div>
            {integrations.length > 0 ? (
                <ul className="list-none p-0">
                    {integrations.map((integration) => (
                        <IntegrationItem
                            key={integration.id}
                            integration={integration}
                            onDelete={onDelete}
                        />
                    ))}
                </ul>
            ) : (
                <div>No integrations available.</div>
            )}
        </div>
    );
};

export default IntegrationList;