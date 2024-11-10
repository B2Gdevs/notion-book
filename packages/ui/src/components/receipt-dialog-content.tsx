'use client';
import { motion } from 'framer-motion';
import React from 'react';
import { Brand, calculateOrderTotals } from '..';
import { Order, OrderItem } from '../models/orderModels';

interface ReceiptDialogContentProps {
	order: Order;
	customerNote?: string;
	brand?: Brand;
}

export const ReceiptDialogContent: React.FC<ReceiptDialogContentProps> = ({
	order,
	customerNote,
	brand
}) => {
	const formatCurrency = (amount: number) => `$${amount?.toFixed(2)}`;

	const orderTotals = calculateOrderTotals(order?.items as OrderItem[], order.order_total?.tax, order.order_total?.discount, 0, true);
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className='p-4 bg-white rounded-lg shadow'
		>
			<div className='mb-4'>
				<h2 className='text-xl '>Receipt</h2>
				{brand && (
					<div className='flex items-center gap-2'>
						{brand?.name}
					</div>
				)}
			</div>
			<div className='space-y-2'>
				{order?.items?.map((item) => {
					return (
						<div key={item.id} className='border-b pb-2'>
							<div className='flex justify-between'>
								<div className=''>{item.name} (x{item?.quantity})</div>
								<div>{formatCurrency(item.quantity * (item.price + (item.modifiers?.reduce((sum, modifier) => sum + (modifier.price ?? 0), 0) ?? 0)))}</div>
							</div>
							{item?.modifiers?.map((modifier, idx) => {
								return (
									<div key={`${order?.id ?? ''}${item.id}${modifier.id}${idx}`} className='pl-4'>
										<div className='text-sm'>
											{modifier?.name} (x{modifier?.quantity}):{' '}
											{formatCurrency(modifier?.price ?? 0)}
										</div>
									</div>
								)
							})}
							{item?.note && (
								<div className='pl-4'>
									<div className='text-sm'>Item Note: {item?.note}</div>
								</div>
							)}
						</div>
					)
				})}
			</div>
			<div className='flex flex-col gap-2 mt-4'>Customer Note: {customerNote}</div>
			<div className='flex flex-col gap-2 mt-4 border-t pt-4'>
				<div className='flex justify-between'>
					<span className=''>Subtotal</span>
					<span>{formatCurrency(orderTotals?.subtotal ?? 0)}</span>
				</div>
				<div className='flex justify-between'>
					<span className=''>Stipend Applied</span>
					<span>{formatCurrency(orderTotals?.discount ?? 0)}</span>
				</div>
				<div className='flex justify-between'>
					<span className=''>Tax</span>
					<span>{formatCurrency(orderTotals?.tax_total ?? 0)}</span>
				</div>
				<div className='flex justify-between'>
					<span className=''>Tip</span>
					<span>{formatCurrency(orderTotals?.tip ?? 0)}</span>
				</div>
				<div className='flex justify-between'>
					<span className=''>Total</span>
					<span>{formatCurrency(orderTotals?.total ?? 0)}</span>
				</div>
			</div>
		</motion.div>
	);
};
