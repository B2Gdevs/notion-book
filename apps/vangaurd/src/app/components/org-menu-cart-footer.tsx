import { X } from 'lucide-react';
// OrgMenuCartFooter component
import React from 'react';
import {
	OrderItem,
	RestaurantScheduleList,
	SheetComponent,
	SheetHeader,
	SheetPrimitive,
	SheetTitle,
	calculateOrderTotals,
	PaymentButton as ViewCartButton
} from 'ui';
import { OrderSheet } from './order-sheet';


interface CartFooterProps {
	userOrderItems?: OrderItem[];
	orderSheetProps: React.ComponentProps<typeof OrderSheet>;
	selectedDate: Date;
	dateSetter?: (date: Date) => void;
	onDateChange?: (date: Date) => void;
}

export const OrgMenuCartFooter: React.FC<CartFooterProps> = ({
	userOrderItems,
	orderSheetProps,
	selectedDate,
	dateSetter,
	onDateChange,
}) => {
	const hasItems = userOrderItems && userOrderItems.length > 0;

	const totals = calculateOrderTotals(userOrderItems ?? [], 0.0825);

	return (
		<div
			className={`fixed bottom-0 bg-primary-off-white w-full flex justify-center items-center border-t border-gray-200 py-8 mt-5 drop-shadow ${hasItems ? 'z-50' : 'opacity-0 z-0 hidden'}`}
		>
			<SheetComponent
				side='right'
				triggerContent={
					<div className='items-center justify-center flex'>
						<ViewCartButton
							label='View Cart'
							amount={totals.total}
							className='text-xl items-center'
						/>
					</div>
				}
				sheetContent={
					<>
						<SheetHeader>
							<div className='relative w-full flex flex-col justify-center items-center pt-4 lg:pb-4'>
								<SheetTitle className='mb-2 text-2xl font-righteous '>Finalize Your Order</SheetTitle>
								<SheetPrimitive.Close className='absolute right-4 top-[18px]'>
									<X className='h-[25px] w-[25px]' />
									<span className='sr-only'>Close</span>
								</SheetPrimitive.Close>
								<div className='border-b border-[#425F57] w-full' />
							</div>
						</SheetHeader>
						<RestaurantScheduleList
							onDateSelect={(date: Date) => {
								if (!date) {
									return;
								}
								onDateChange?.(date);
							}}
							className='overflow-x-auto'
							dateSelected={selectedDate}
							dateSetter={dateSetter}
							variant='radio'
						/>
						<OrderSheet {...orderSheetProps} />
					</>
				}
				isCheckout={true}
				className='bg-primary-off-white'
			/>
		</div>
	);
};
