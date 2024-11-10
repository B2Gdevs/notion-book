'use client';

import React, { useState } from 'react';
import {
	Button,
	Dialog,
	DialogContent,
	Label,
	defaultOrgGroup,
	toast,
    useCreateOrgGroup,
} from 'ui';

interface NewOrgGroupDialogProps {
	isDialogOpen: boolean;
	handleCloseDialog: () => void;
}

export const NewOrgGroupDialog: React.FC<NewOrgGroupDialogProps> = ({
	isDialogOpen,
	handleCloseDialog,
}) => {
	const [newOrgGroup, setNewOrgGroup] = useState({
		...defaultOrgGroup,
		name: '',
		org_ids: [],
	});

	const createOrgGroupMutation = useCreateOrgGroup({
		onSuccess: () => {
			handleCloseDialog();
			toast({
				title: 'Org Group Created',
				description: 'Your new org group has been created',
				duration: 5000,
			});
		},
		onError: (error) => {
			toast({
				title: 'Error Creating Org Group',
				description: error.message,
				duration: 5000,
			});
		},
	});

	const handleCreateOrgGroup = async () => {
        const { id, ...orgGroup } = { ...newOrgGroup }; // omit the ID
        createOrgGroupMutation.mutate(orgGroup);
    };

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewOrgGroup({ ...newOrgGroup, [e.target.name]: e.target.value });
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
			<DialogContent className='' title='Create Org Group'>
				<div className='text-2xl underline p-2'>Create Org Group</div>
				<div className='flex flex-col gap-y-4 p-4'>
					<Label className="flex items-center">
						Organization Group Name <span className="text-red-500 ml-1">*</span>
					</Label>
					<input
						type='text'
						name='name'
						value={newOrgGroup.name}
						onChange={handleInputChange}
						placeholder='Organization Group Name'
						required
						className={`p-2 border rounded mb-4 ${newOrgGroup.name ? 'border-gray-300' : 'border-red-500'}`}
						aria-required="true"
					/>
					{/* Add more fields as needed */}
					<Button
						className='bg-primary-spinach-green text-primary-off-white'
						onClick={handleCreateOrgGroup}
					>
						Create Org Group
					</Button>
					<Button
						className='bg-primary-almost-black/40 text-primary-off-white'
						onClick={handleCloseDialog}
					>
						Cancel
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};