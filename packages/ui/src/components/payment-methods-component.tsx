'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { PlusCircle, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { ConfirmationDialog } from './confirmation-dialog';
import { Section } from './section';
import { PaymentMethodList } from './payment-method-list';
import { Org, User, useDeletePaymentMethod, useListPaymentMethods } from '..';
import { StripeSetupForm } from './stripe-setup-form';
import { AmountOwedComponent } from './amount-owed-component';


interface PaymentMethodsComponentProps {
	org?: Org;
	user?: User;
}

export const PaymentMethodsComponent: React.FC<PaymentMethodsComponentProps> = ({
	org,
	user,
}) => {
	const [showSetupForm, setShowSetupForm] = useState(false);
	const [editingCardId, setEditingCardId] = useState<string | null>(null);
	const [isDialogOpen, setDialogOpen] = useState(false);
	const [methodToDelete, setMethodToDelete] = useState<string | null>(null);
	const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<any>();

	const { data: paymentMethods, refetch: fetchPaymentMethods } =
		useListPaymentMethods(org?.stripe_account_id ?? user?.stripe_account_id ?? '');

	useEffect(() => {
		if (paymentMethods && paymentMethods.length > 0) {
			setEditingCardId(null);
		}
	}, [paymentMethods]);

	const deletePaymentMethodMutation = useDeletePaymentMethod({
		onSuccess: () => {
			fetchPaymentMethods();
		},
	});

	const handleConfirmDelete = () => {
		if (methodToDelete) {
			deletePaymentMethodMutation.mutate(methodToDelete);
		}
		handleCloseDialog();
	};

	const handleEditSubmit = () => {
		setEditingCardId(null);
	};

	const toggleEditCard = (cardId: string) => {
		if (editingCardId === cardId) {
			setEditingCardId(null);
		} else {
			setEditingCardId(cardId);
			setShowSetupForm(false);
		}
	};

	const handleOpenDialog = (methodId: string) => {
		setMethodToDelete(methodId);
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setMethodToDelete(null);
	};

	return (
		<Section
			className='p-4 w-full'
			title='Payment Methods'
			hideChevron={false}
			expanded={true}
		>
			{(org?.stripe_account_id || user?.stripe_account_id) && (
				<div className='flex justify-between items-center mb-4'>
					<h3 className='text-xl '></h3>
					{!showSetupForm && !editingCardId && (
						<a
							className='text-blue-500 hover:underline cursor-pointer'
							onClick={() => setShowSetupForm(true)}
						>
							<PlusCircle
								className='inline-block mr-1 text-primary-spinach-green'
								size={16}
							/>
						</a>
					)}
				</div>
			)}

			{(org?.stripe_account_id || user?.stripe_account_id) && (
				<>
					{(user?.amount_owed ?? 0) > 0 && (
						<AmountOwedComponent
							amountOwed={user?.amount_owed ?? 0}
							paymentMethodId={defaultPaymentMethod?.default_payment_method_id ?? ''}
							stripeAccountId={user?.stripe_account_id ?? ''} />
					)}

					<PaymentMethodList
						paymentMethods={paymentMethods}
						editingCardId={editingCardId}
						handleEditSubmit={handleEditSubmit}
						toggleEditCard={toggleEditCard}
						handleOpenDialog={handleOpenDialog}
						stripeAccountId={(org?.stripe_account_id || user?.stripe_account_id)}
						onGetDefaultPaymentMethod={(defaultPaymentMethod) => setDefaultPaymentMethod(defaultPaymentMethod)}
					/>
				</>
			)}

			<ConfirmationDialog
				message='Are you sure you want to delete this payment method?'
				isOpen={isDialogOpen}
				onClose={handleCloseDialog}
				onConfirm={handleConfirmDelete}
			/>

			{showSetupForm && (
				<AnimatePresence mode='wait'>
					<motion.div
						className='flex flex-col'
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 20 }}
					>
						<div className='flex justify-end'>
							<XCircle
								className='mt-2 mb-2 text-secondary-pink-salmon '
								onClick={() => setShowSetupForm(false)}
							/>
						</div>
						<StripeSetupForm
							org={org}
							user={user}
						/>
					</motion.div>
				</AnimatePresence>
			)}
		</Section>
	);
};