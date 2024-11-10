'use client'

import React from 'react';
import { Order, SpeechBubble, toast, useCreateOrder, useUpdateOrder } from '..';
import { PaymentButton } from './payment-button'; // Ensure this path matches your project structure


interface OrderSheetOrderButtonProps {
  onCreateOrder?: (order: Order) => void;
  onUpdateOrder?: (order: Order) => void;
  disabled?: boolean;
  newOrUpdatedOrder?: Order | null;
  guestUserEmail?: string | null;
}

export const OrderSheetOrderButton: React.FC<OrderSheetOrderButtonProps> = ({
  onCreateOrder,
  onUpdateOrder,
  disabled,
  newOrUpdatedOrder,
  guestUserEmail,
}) => {

  const createOrderMutation = useCreateOrder({
    onSuccess: (data) => {
      onCreateOrder?.(data);
    },
    onError: (error) => {

      toast({
        title: 'Error',
        description: error.body.detail,
        duration: 2000,
        variant: 'destructive',

      })
    },
    guestUserEmail
  });
  const updateOrderMutation = useUpdateOrder({
    onSuccess: (data) => {
      onUpdateOrder?.(data);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.body.detail,
        duration: 2000,
        variant: 'destructive',

      })
    }
  });

  const handleCartContinue = (
  ) => {

    if (!newOrUpdatedOrder) {
      return <div>
        Cannot place order
      </div>
    }

    // if the order has an id, then it has been created already and should be updated
    if (newOrUpdatedOrder?.id) {
      updateOrderMutation.mutate({ orderId: newOrUpdatedOrder.id, orderData: newOrUpdatedOrder });
    } else {
      // if the order does not have an id, then it has not been created yet and should be created
      createOrderMutation.mutate(newOrUpdatedOrder);
    }
  }

  return (
    <div className='z-50 fixed bottom-0 bg-primary-off-white h-[80px] w-[90%] md:w-full sm:max-w-sm lg:max-w-[33vw] flex justify-center items-center border-t border-gray-200 py-4 drop-shadow'>
      <PaymentButton
        label='Place Order'
        amount={newOrUpdatedOrder?.order_total?.total}
        onClick={handleCartContinue}
        disabled={disabled}
      />
      {!disabled && (
        <span className='absolute -top-20 md:-top-16'>
          <SpeechBubble
            text='Please click "Place Order" to ensure your meal arrives 👋'
            direction='top'
            bubbleColor='#f28181' // the hard-coded color for pink-salmon (using the text doesn't work)
            textColor='white'
            cursor='default'
          />
        </span>
      )}
    </div>
  );
};

