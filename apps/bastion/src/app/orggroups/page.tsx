'use client';
import { PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { Button, OrgGroupsTable } from 'ui';
import { NewOrgGroupDialog } from '../components/new-org-group-dialog';

export default function OrgGroupPage() {

	const [isDialogOpen, setDialogOpen] = useState(false);

	const handleOpenDialog = () => {
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
	};


	return (
		<div className='container mx-auto'>
			<div className='flex justify-between mt-4'>
				<Button onClick={handleOpenDialog}>
					<div className='flex justify-center items-center gap-2'>
						<PlusCircleIcon />
						<span>Create New Org Group</span>
					</div>
				</Button>
			</div>
			<NewOrgGroupDialog
				isDialogOpen={isDialogOpen}
				handleCloseDialog={handleCloseDialog}
			/>

			{/* Organization Group table */}
			<div className='overflow-x-auto'>
				<OrgGroupsTable/>
			</div>
		</div>
	);
}