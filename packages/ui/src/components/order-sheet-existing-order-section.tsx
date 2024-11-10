'use client'

import React, { useState } from 'react';
import { Order } from '../models/orderModels';
import CancelOrderDialog from './cancel-order-dialog';
import { StepHeader } from './step-header';
import { Button } from './ui/button';

interface OrderSheetExistingOrderSectionProps {
  order?: Order | null;
  hasUserOrderedToday: boolean;
  onEditOrder: (order: Order) => void;
}

export const OrderSheetExistingOrderSection: React.FC<OrderSheetExistingOrderSectionProps> = ({
  order,
  hasUserOrderedToday,
  onEditOrder,
}) => {
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);

  // Conditionally render the component based on hasUserOrderedToday
  if (!hasUserOrderedToday) {
    return null; // Don't render anything if the user hasn't ordered today
  }

  return (
    <div className='flex flex-col justify-left items-left p-2 gap-2 px-4 bg-primary-lime-green mx-5 rounded-lg'>
      <div className='text-left'>
        <h2 className='text-2xl font-righteous underline'>Order Placed!</h2>
        <h2>Your order has been successfully placed.</h2>
      </div>

      <div className='flex flex-col justify-left items-left gap-2'>
    {order && order.items?.map((item, index) => (
        <span key={index} className='text-sm flex justify-start items-center gap-2'>
            <StepHeader text={''} step={`${index + 1}`} fontSize='text-sm' orderPopup={true} className='w-fit block' />
            <span>{item.name} x{item.quantity}</span>
        </span>
    ))}
</div>

      {(order?.sub_order_ids?.length ?? 0) === 0 && (
        <Button
          variant='destructive'
          className='rounded-md'
          onClick={() => order && order.id && setIsCancelDialogOpen(true)}
        >
          Edit Order
        </Button>
      )}
      {(order?.sub_order_ids?.length ?? 0) > 0 && (
        <>
          <div className="text-secondary-pink-salmon text-xs text-left font-sans">
            This order has been sent to kitchens and can't be edited.
          </div>

        </>
      )}

      <CancelOrderDialog
        isOpen={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        onConfirm={
          () => {
            if (order && order.id) {
              onEditOrder?.(order); // Call the onCancelOrder function
              setIsCancelDialogOpen(false); // Close the dialog after confirming 
            }
          }
        }
        handleCloseDialog={() => setIsCancelDialogOpen(false)} // Close the dialog when the X button is clicked
      />
    </div>
  );
};