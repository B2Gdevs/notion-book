'use client'

import React from 'react';
import {
    Dialog,
    DialogContent,
    ItemClassification,
    ItemClassificationForm,
    toast
} from 'ui';

interface NewItemClassificationDialogProps {
    isDialogOpen: boolean;
    handleCloseDialog: () => void;
    itemClassification?: ItemClassification;
}

export const ItemClassificationDialog: React.FC<NewItemClassificationDialogProps> = ({
    isDialogOpen,
    handleCloseDialog,
    itemClassification
}) => {
    return (
        <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
            <DialogContent className='' title='Create Item Classification'>
                <div className='text-2xl underline p-2'>Create Item Classification</div>
                <ItemClassificationForm
                    itemClassification={itemClassification}
                    onSuccess={() => {
                        handleCloseDialog();
                        toast({
                            title: 'Item Classification Created',
                            description: 'Your new item classification has been created',
                            duration: 5000,
                        });
                    }}
                    onError={(error) => {
                        toast({
                            title: 'Error Creating Item Classification',
                            description: error.message,
                            duration: 5000,
                        });
                    }}
                />
            </DialogContent>
        </Dialog>
    );
};