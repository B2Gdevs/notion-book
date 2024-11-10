'use client';

import { Info } from 'lucide-react';
import React from 'react';
import {
	Brand, Button,
	Dialog,
	DialogContent,
	OtterConnection, OtterConnectionSubmissionResponse, Store, useDeleteStoreConnection, useGetStoreConnection, useSubmitStoreConnection, useUpdateStore
} from 'ui';

interface StoreConnectionDialogProps {
	isDialogOpen: boolean;
	handleCloseDialog: () => void;
	sessionId: string;
	brand: Brand;
	store: Store;
	orgId: string;
}

export const StoreConnectionDialog: React.FC<StoreConnectionDialogProps> = ({
	isDialogOpen,
	handleCloseDialog,
	sessionId,
	brand,
	store,
	orgId,
}) => {
	// Ensure brand and store otter_id are not null or undefined before proceeding
	const brandOtterId = brand?.otter_id ?? '';
	const storeOtterId = store?.otter_id ?? '';
	const updateStoreMutation = useUpdateStore();

	useGetStoreConnection(brandOtterId, storeOtterId, orgId,
		{
			onSuccess: (data: OtterConnection) => {
				if (data?.storeId) {
					store.is_otter_connected = true;
					updateStoreMutation.mutate(store);
				}
			},
			onError: (error: any) => {
				console.error('Error getting store connection:', error);
			},

		}, !!brandOtterId && !!storeOtterId);

	const deleteConnectionMutation = useDeleteStoreConnection({
		onSuccess: () => {
			store.is_otter_connected = false;
			updateStoreMutation.mutate(store);
		},
		onError: (error: any) => {
			console.error('Error deleting store connection:', error);
		},
	});
	const submitConnectionMutation = useSubmitStoreConnection({
		onSuccess: (data: OtterConnectionSubmissionResponse) => {
			if (data.connected) {
				store.is_otter_connected = true;
				updateStoreMutation.mutate(store);
			}
		},
		onError: (error: any) => {
			console.error('Error submitting store connection:', error);
		},
	});

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Ensure storeId and otterId are not empty or undefined
		const storeId = store?.id ?? '';
		if (!storeId || !storeOtterId) {
			console.error('Store ID or Otter ID is missing.');
			return;
		}
		if (store?.is_otter_connected) {
			await deleteConnectionMutation.mutateAsync({ sessionId, brandId: brandOtterId, storeId: storeOtterId, orgId });
		}
		submitConnectionMutation.mutate({
			sessionId,
			externalBrandId: brandOtterId,
			storeId,
			externalStoreId: storeOtterId,
			orgId
		});
	};

	const handleDeleteConnection = async () => {
		store.is_otter_connected = false;
		await updateStoreMutation.mutateAsync(store);
		if (!storeOtterId) {
			console.error('Otter ID is missing.');
			return;
		}
		await deleteConnectionMutation.mutateAsync({ sessionId, brandId: brandOtterId, storeId: storeOtterId, orgId });

	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
			<DialogContent>
				<div className='flex flex-col gap-y-4 p-4'>
					<h1>Store Connection</h1>

					{store?.is_otter_connected ? (
						<>
							<Button
								className='bg-secondary-pink-salmon'
								onClick={handleDeleteConnection}
							>
								Delete Connection
							</Button>

						</>
					) : (
						<div className='flex items-center gap-x-4 text-secondary-pink-salmon'>
							<Info size={24} />
							<div>No store connection found. Please create a connection.</div>
							<form onSubmit={handleFormSubmit}>
								<Button className='w-full bg-black text-white' type='submit'>
									Connect
								</Button>
							</form>
						</div>
					)}


				</div>
			</DialogContent>
		</Dialog>
	);
};
