'use client';
import { PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { Button, OrgsTable } from 'ui';
import { NewOrgDialog } from '../components/new-org-dialog';


export default function OrgPage() {
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
						<span>Create New Org</span>
					</div>
				</Button>
			</div>
			<NewOrgDialog
				isDialogOpen={isDialogOpen}
				handleCloseDialog={handleCloseDialog}
			/>

			<div className='overflow-x-auto'>
				<OrgsTable />
			</div>
		</div>
	);
}
