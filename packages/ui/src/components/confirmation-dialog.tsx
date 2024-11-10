import React, { ReactNode } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogPrimitive } from './ui/dialog';
import { X } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  handleCloseDialog?: () => void;
  message?: string;
  children?: ReactNode; // Add this line
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  handleCloseDialog,
  message = 'Are you sure you want to delete this org?',
  children, // And this line
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="" isSticky={true}>
        <div className="bg-gray-100 rounded-lg shadow relative">
          <div className='relative flex bg-white mb-2 rounded-lg rounded-b-none p-4'>
            <h3 className="text-lg  text-black">{message}</h3>
            <DialogPrimitive.Close
              className='absolute right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
              onClick={handleCloseDialog}
            >
              <X className='h-[30px] w-[30px]' />
              <span className='sr-only'>Close</span>
            </DialogPrimitive.Close>
          </div>
          {children} {/* Use the children prop here */}
          <DialogFooter>
            <div className="flex justify-end space-x-4 mt-4 p-4">
              <Button onClick={onConfirm} className="bg-black text-white  py-2 px-4 rounded hover:bg-secondary-pink-salmon">
                Confirm
              </Button>
              <Button onClick={onClose} className="bg-white text-black border border-black  py-2 px-4 rounded hover:bg-gray-100">
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};