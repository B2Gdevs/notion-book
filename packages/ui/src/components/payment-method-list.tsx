'use client';

import { PaymentMethod } from "@stripe/stripe-js";
import { AnimatePresence, motion } from 'framer-motion';
import { BatteryChargingIcon, Edit2Icon, Trash } from 'lucide-react';
import React, { useEffect } from 'react';
import { Button, toast, useGetDefaultPaymentMethod, useSetDefaultPaymentMethod } from "..";
import { EditCardForm } from "./edit-card-form";

interface PaymentMethodListProps {
	paymentMethods: PaymentMethod[];
	editingCardId: string | null;
	handleEditSubmit: (formData: any) => void;
	toggleEditCard: (cardId: string) => void;
	handleOpenDialog: (methodId: string) => void;
	stripeAccountId?: string;
	onGetDefaultPaymentMethod?: (paymentMethod: any) => void;
}

export const PaymentMethodList: React.FC<PaymentMethodListProps> = ({
	paymentMethods,
	editingCardId,
	handleEditSubmit,
	toggleEditCard,
	handleOpenDialog,
	stripeAccountId,
	onGetDefaultPaymentMethod,
}) => {
	const { data: defaultPaymentMethod, refetch: refetchDefaultPaymentMethod, isLoading } = useGetDefaultPaymentMethod(stripeAccountId ?? '');
	const setDefaultPaymentMethod = useSetDefaultPaymentMethod({
		onSuccess: () => {
			toast({
				title: 'Default Payment Method Updated',
				description: 'The default payment method has been successfully updated.',
				duration: 3000,
			});
			refetchDefaultPaymentMethod();
		},
		onError: () => {
			toast({
				title: 'Error',
				description: 'Failed to update the default payment method.',
				duration: 3000,
			});
		},
	});

	useEffect(() => {
		onGetDefaultPaymentMethod?.(defaultPaymentMethod);
	}, [onGetDefaultPaymentMethod, defaultPaymentMethod]);

	useEffect(() => {
		// Ensure that only one payment method exists, the default payment method is not set, and data is not loading
		if (paymentMethods?.length === 1 && !defaultPaymentMethod && !isLoading) {
			handleSetDefault(paymentMethods[0].id);
		}
	}, [paymentMethods, defaultPaymentMethod, isLoading]);

	const handleSetDefault = (methodId: string) => {
		try {
			if (stripeAccountId) {
				setDefaultPaymentMethod.mutate({ customerId: stripeAccountId, paymentMethodId: methodId });
			}
		} catch (error) {
			toast({
				title: 'Error',
				description: 'An error occurred while setting the default payment method.',
				duration: 3000,
			});
		}
	};

	return (
		<>
			{paymentMethods?.length > 0 && !defaultPaymentMethod && (
				<div className='mb-4 border-red-500 bg-secondary-pink-salmon text-red-800 border p-2 rounded inline-block align-top'>
					<div className='flex justify-between items-center'>
						<motion.span
							className='text-red-100'
							animate={{ opacity: [0.5, 1, 0.5] }}
							transition={{ duration: 2, repeat: Infinity }}
						>
							<div className="flex space-x-2">
								<div className="underline">Cannot Charge</div>
								<BatteryChargingIcon />
							</div>No default payment method set
						</motion.span>
					</div>
				</div>
			)}
			{paymentMethods?.length === 0 && (
				<div className='mb-4 bg-white border p-2 rounded'>
					<div className='flex justify-between items-center'>
						<span>No payment methods on file</span>
					</div>
				</div>
			)}
			<div className='grid grid-cols-1 lg:px-8 lg:py-2 gap-4'>
				{paymentMethods?.map((method) => (
					<div key={method.id} className='relative mb-4 bg-white border p-6 rounded-2xl w-full min-h-[150px]'>
						<div className='flex flex-col justify-start items-start gap-2 text-lg'>
							<span className='flex justify-center items-center gap-2'>
								{(method?.card?.brand?.charAt(0)?.toUpperCase() ?? '') + (method?.card?.brand?.slice(1) ?? '')}
								{(method?.us_bank_account?.account_holder_type?.charAt(0)?.toUpperCase() ?? '') + (method?.us_bank_account?.account_holder_type?.slice(1) ?? '')} Account
								{defaultPaymentMethod?.default_payment_method_id === method.id ? (
									<span className='italic bg-primary-lime-green-darker p-1 text-center rounded-lg'>Default</span>
								) : (
									<Button
										onClick={() => handleSetDefault(method.id)}
										size='sm'
									>
										Set as default
									</Button>
								)}
							</span>
							<span>
								**** **** **** {method?.card?.last4}
							</span>
							<div className='flex justify-center items-center gap-2 absolute top-2 right-2'>
								{method?.card && (
									<>
										<Edit2Icon
											className='text-primary-spinach-green p-1 rounded-md hover:bg-primary-off-white-darker cursor-pointer'
											onClick={() => toggleEditCard(method.id)}
										/>
									</>)}
								<Trash
									className='text-secondary-pink-salmon p-1 rounded-md hover:bg-primary-off-white-darker cursor-pointer'
									onClick={() => handleOpenDialog(method.id)}
								/>
							</div>
						</div>

						<AnimatePresence mode='wait'>
							{editingCardId === method.id ? (
								<motion.div
									key='editForm'
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 20 }}
									className='mt-2 border-t-2 border-dashed border-gray-200 pt-2'
								>
									<EditCardForm
										onSubmit={handleEditSubmit}
										onCancel={() => toggleEditCard('')}
									/>
								</motion.div>
							) : (
								<motion.span
									key='expiry'
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -20 }}
									className='block mt-2 text-primary-almost-black-light'
								>
									{method?.card && (<>
										Exp {String(method?.card?.exp_month).padStart(2, '0')}/{String(method?.card?.exp_year).slice(-2)}
									</>)}

									{method?.us_bank_account && (
										<div className='flex flex-col'>
											<span>{method?.us_bank_account?.bank_name}</span>
											<span>Account: ****{method?.us_bank_account?.last4}</span>
										</div>)}
								</motion.span>
							)}
						</AnimatePresence>
					</div>
				))}
			</div>
		</>
	);
};

