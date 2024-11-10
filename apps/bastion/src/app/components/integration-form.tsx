import React, { useState } from 'react';
import { Button, Integration, IntegrationSystem, OrgSelect, useCreateIntegration } from 'ui'; // Adjust the import path as necessary
import { IntegrationSystemSelect } from './integration-select';

export const IntegrationForm: React.FC = () => {
  const [integration, setIntegration] = useState<Integration>();
  const { mutate: createIntegration, isLoading } = useCreateIntegration({
    onSuccess: () => {
      // Handle success, e.g., show a notification or redirect
    },
    onError: (error) => {
      // Handle error, e.g., show an error message
      console.error('Error creating integration:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (integration) {
      createIntegration(integration as Integration);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-black rounded-lg p-2 m-2">
      <OrgSelect
        onChange={(selectedOrg) => setIntegration((prev) => ({ ...prev, org_id: selectedOrg.id }))}
      />
      <IntegrationSystemSelect
        value={integration?.name as IntegrationSystem}
        onChange={(value) => setIntegration((prev) => ({ ...prev, name: value }))}
      />
      {/* Add inputs for other Integration properties as needed */}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Integration'}
      </Button>
    </form>
  );
};