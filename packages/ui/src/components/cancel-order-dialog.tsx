'use client';

import { X } from 'lucide-react';
import React from 'react';
import { Button, Dialog, DialogContent, DialogPrimitive } from '..';

interface CancelOrderDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    handleCloseDialog?: () => void;
}

// Changes w/ defaultAuthData are from chat to use a default value for the authData to prevent warning of input element that starts as uncontrolled (doesn't have a value prop) and then becomes controlled (gets a value prop).
const CancelOrderDialog: React.FC<CancelOrderDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    handleCloseDialog,
}) => {

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="" isSticky={true}>
                <div className="bg-primary-off-white rounded-lg shadow relative">
                    <div className='relative flex justify-center items-center font-righteous text-2xl mb-2 rounded-lg rounded-b-none p-4'>
                        <h3 className="text-lg  text-black">Edit Order?</h3>
                        <DialogPrimitive.Close
                            className='absolute right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
                            onClick={handleCloseDialog}
                        >
                            <X className='h-[30px] w-[30px]' />
                            <span className='sr-only'>Close</span>
                        </DialogPrimitive.Close>
                    </div>

                    <div className='border-b border-[#425F57] w-full' />
                    <div className='font-sans py-4 px-8 text-center'>Editing your order will cancel it. You must <span className=''>save</span> your changes by clicking "Place Order" again. Continue?</div>
                    <div className="flex justify-center items-center space-x-4 mt-4 p-4">
                        <Button onClick={onConfirm} className="bg-primary-spinach-green font-righteous text-white  py-2 px-4 rounded hover:bg-secondary-pink-salmon w-[140px]">
                            Yes
                        </Button>
                        <Button onClick={onClose} className="bg-primary-off-white text-black font-righteous border border-black  py-2 px-4 rounded hover:bg-gray-100 w-[140px]">
                            Cancel
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CancelOrderDialog;
