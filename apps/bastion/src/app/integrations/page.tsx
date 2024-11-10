'use client';

import React, { useState } from 'react';
import { useQueryClient } from 'react-query';
import { ConfirmationDialog, toast, useGetIntegrations, useDeleteIntegration, Button, PageTitleDisplay } from 'ui';
import { IntegrationForm } from '../components/integration-form';
import IntegrationList from '../components/integration-list';

const IntegrationListPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [integrationToDelete, setIntegrationToDelete] = useState<string | null>(null);
    const [page, setPage] = useState(1); // Manage current page
    const pageSize = 10; // Set page size

    // Fetch list of integrations with pagination
    const { data: integrations, isLoading, isError, isFetching, isPreviousData } = useGetIntegrations({page, pageSize});
    const { mutate: deleteIntegration } = useDeleteIntegration({
        onSuccess: () => {
            toast({ title: 'Success', duration: 5000 });
            queryClient.invalidateQueries(['integrations', page, pageSize]);
            setIntegrationToDelete(null);
        },
        onError: () => {
            toast({ title: 'Error', duration: 5000 });
        },
    });

    const handleDeleteIntegration = (id: string) => {
        setIntegrationToDelete(id);
    };

    const confirmDelete = () => {
        if (integrationToDelete) {
            deleteIntegration(integrationToDelete);
        }
    };

    // Pagination handlers
    const handleNextPage = () => {
        if (!isPreviousData) {
            setPage((oldPage) => oldPage + 1);
        }
    };

    const handlePreviousPage = () => {
        setPage((oldPage) => Math.max(oldPage - 1, 1));
    };

    if (isLoading) return <div>Loading integrations...</div>;
    if (isError) return <div>Error fetching integrations.</div>;

    return (
        <div className="m-8">
            <PageTitleDisplay overrideTitle="Integration form" />
            <IntegrationForm/>
     
            <PageTitleDisplay overrideTitle="Integration List" />
            <div className="pagination flex space-x-2 m-2 p-2">
                <Button onClick={handlePreviousPage} disabled={page === 1}>Previous</Button>
                <Button onClick={handleNextPage} disabled={isPreviousData || isFetching}>Next</Button>
            </div>
            <IntegrationList
                integrations={integrations ?? []} // Adjust according to your data structure
                onDelete={handleDeleteIntegration}
            />

            <ConfirmationDialog
                isOpen={!!integrationToDelete}
                onClose={() => setIntegrationToDelete(null)}
                onConfirm={confirmDelete}
                message="Are you sure you want to delete this integration?"
            />
        </div>
    );
};

export default IntegrationListPage;