'use client';
import React, { useState } from 'react';
import { ConfirmationDialog, OrdersTable, useCancelOrder, useGetCurrentColorfullUser } from 'ui';

const OrdersComponent: React.FC = () => {

	const cancelOrderMutation = useCancelOrder();

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [orderIdToCancel, setOrderIdToCancel] = useState<string | null>(null);

	const handleCancelOrder = (orderId: string) => {
		setOrderIdToCancel(orderId);
		setIsDialogOpen(true);
	};
	const { data: user } = useGetCurrentColorfullUser();
	return (
		<div>
			<OrdersTable  onCancelOrder={handleCancelOrder} userId={user?.id ?? ''} is_sub_order={false}/>
			<ConfirmationDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				onConfirm={() => {
					if (orderIdToCancel) {
						cancelOrderMutation.mutate(orderIdToCancel);
					}
					setIsDialogOpen(false);
				}}
				message='Are you sure you want to cancel this order?'
			/>
		</div>
	);
};

export default OrdersComponent;
