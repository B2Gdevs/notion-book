'use client';
import { PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';
import { Button, ItemClassification, ItemClassificationTags, ItemClassificationsTable, ItemClassificationsTagDisplay } from 'ui';
import { ItemClassificationDialog } from '../components/new-item-classification-dialog';

export default function ItemClassificationPage() {
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [editingItemClassification, setEditingItemClassification] = useState<ItemClassification>();

	const handleOpenDialog = (itemClassification?: ItemClassification) => {
		setEditingItemClassification(itemClassification);
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
	};

	const handleCreateNew = () => {
		handleOpenDialog();
	};

	// Convert tags to ItemClassification objects
	const itemClassifications = Object.values(ItemClassificationTags).map(tag => ({
		id: tag.toLowerCase(), // Assuming the tag itself can be a unique identifier
		tag: tag
	}));

	return (
		<div className='container mx-auto'>
			<div className='flex justify-between mt-4'>
				<Button onClick={handleCreateNew}>
					<div className='flex justify-center items-center gap-2'>
						<PlusCircleIcon />
						<span>Create New Item Classification</span>
					</div>
				</Button>
			</div>
			
			<ItemClassificationDialog
				isDialogOpen={isDialogOpen}
				handleCloseDialog={handleCloseDialog}
				itemClassification={editingItemClassification}
			/>
			<div>These are supported classifications, meaning they will have icons associated with them.</div>
			<ItemClassificationsTagDisplay previewMode={false} itemClassifications={itemClassifications} />

			<div className='overflow-x-auto'>
				<ItemClassificationsTable
					onItemEditClick={(itemClassification) => {
						handleOpenDialog(itemClassification)
					}}
				/>
			</div>
		</div>
	);
}