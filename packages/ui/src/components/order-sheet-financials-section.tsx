'use client'

import { motion } from 'framer-motion';
import React from 'react';
import { Order, Org, Share, calculateOrderTotals } from '..';
import { Checkbox } from './checkbox';


interface OrderSheetFinancialSectionProps {
    hasUserOrderedToday: boolean;
    newOrUpdatedOrder?: Order | null;
    org?: Org;
    isStipendApplied: boolean;
    setIsStipendApplied: (value: React.SetStateAction<boolean>) => void;
    tip: number;
    disabled?: boolean;
    isBudgetScheduleApplied?: boolean;
    isGuestLimitedView?: boolean;
    share?: Share;
    isAdminGuestAccount?: boolean;
}

export const OrderSheetFinancialSection: React.FC<OrderSheetFinancialSectionProps> = ({
    hasUserOrderedToday,
    newOrUpdatedOrder,
    org,
    isStipendApplied,
    setIsStipendApplied,
    tip,
    disabled,
    isBudgetScheduleApplied,
    isGuestLimitedView,
    share,
    isAdminGuestAccount,
}) => {
    if (!org) {
        return null;
    }
    const totals = calculateOrderTotals(newOrUpdatedOrder?.items, org?.financial_details?.taxes?.[0]?.rate ?? 0.0825, (isBudgetScheduleApplied && isStipendApplied) ? (org?.budget?.amount ?? 0) : 0, tip ?? 0);

    const guestTotals = calculateOrderTotals(newOrUpdatedOrder?.items, org?.financial_details?.taxes?.[0]?.rate ?? 0.0825, share?.budget ?? 0, tip ?? 0);
    // Adjust subsidy calculation based on isBudgetScheduleApplied and isStipendApplied
    const subsidy = isBudgetScheduleApplied && isStipendApplied ? (org?.budget?.amount ?? 0) : 0;
    const shareSubsidy = share?.budget ?? 0;
    const leftOverStipend = Math.max(0, subsidy - ((totals?.subtotal ?? 0) + (totals?.tax_total ?? 0)));
    const leftOverShareSubsidy = Math.max(0, shareSubsidy - ((totals?.subtotal ?? 0) + (totals?.tax_total ?? 0)));
    return (
        <div className={`font-righteous font-lg flex flex-col gap-2 ${hasUserOrderedToday && 'opacity-70'} ${disabled ? 'text-gray-400' : ''}`}>
            <span className='px-2 lg:px-6'>
                <div className='border-b border-[#425F57] w-full' />
            </span>
            <div className={`font-righteous font-lg flex flex-col gap-2 px-2 lg:px-6 ${hasUserOrderedToday && 'opacity-70'}`}>
                <div className='flex justify-between'>
                    <span className='font-extrabold'>Subtotal:</span>
                    <span>${totals?.subtotal?.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                    <span className='font-extrabold'>Tax:</span>
                    <span>${totals?.tax_total?.toFixed(2)}</span> {/* You might want to adjust this if you have a separate tax amount */}
                </div>
                {/* total with tax before stipend is applied */}
                <div className='flex justify-between'>
                    <span className='font-extrabold'>Total without stipend:</span>
                    <span>${((totals?.tax_total ?? 0) + (totals?.subtotal ?? 0))?.toFixed(2)}</span>
                </div>
                {isAdminGuestAccount ? (
                    <div className='flex justify-between'>
                        <span className='font-extrabold'>Admin Stipend:</span>
                        <span className='text-secondary-peach-orange'>Unlimited</span>
                    </div>
                ) : <div className='flex justify-between'>
                    <span className='font-extrabold'>Employee Stipend:</span>
                    <div className='flex'>
                        <Checkbox
                            onClick={() => setIsStipendApplied(prev => !prev)} // Toggle isStipendApplied
                            key={`stipend-checkbox`}
                            text={'Use stipend'}
                            checked={isStipendApplied}
                            className='p-0 m-0 text-primary-spinach-green text-sm lg:text-base'
                            disabled={disabled || isGuestLimitedView || !isBudgetScheduleApplied}
                        />
                        <span className='text-primary-spinach-green ml-2'>
                            {share ? `-$${shareSubsidy.toFixed(2)}` : (isStipendApplied ? `-$${subsidy.toFixed(2)}` : '-$0.00')}
                        </span>
                    </div>
                </div>}
                {!isAdminGuestAccount && <div className='flex justify-between items-center'>
                    <div className='relative overflow-hidden inline-block'>
                        <motion.span
                            className='border-b-2 text-xs'
                            style={{ borderColor: '#008000' }} // Initial color (green)
                            animate={{
                                borderColor: ['#008000', '#FFD700', '#A52A2A'], // Colors to cycle through (green, gold, brown)
                                scaleX: [0, 1], // Scale animation
                                x: ["0%", "100%"] // Horizontal movement
                            }}
                            transition={{
                                duration: 10, // Increase duration for even slower color transition
                                repeat: Infinity,
                                ease: "linear",
                                times: [0, 0.5, 1] // Specifies at what proportion of the duration each color should be applied
                            }}
                        >
                            Stipend Left
                        </motion.span>
                    </div>
                    <div className='relative overflow-hidden inline-block'>
                        <motion.span
                            className='border-b-2 text-xs'
                            style={{ borderColor: '#008000' }} // Initial color (green)
                            animate={{
                                borderColor: ['#008000', '#FFD700', '#A52A2A'], // Colors to cycle through (green, gold, brown)
                                scaleX: [0, 1], // Scale animation
                                x: ["0%", "100%"] // Horizontal movement
                            }}
                            transition={{
                                duration: 10, // Increase duration for even slower color transition
                                repeat: Infinity,
                                ease: "linear",
                                times: [0, 0.5, 1] // Specifies at what proportion of the duration each color should be applied
                            }}
                        >
                            ${share ? leftOverShareSubsidy.toFixed(2) : (isStipendApplied ? leftOverStipend.toFixed(2) : org?.budget?.amount)}
                        </motion.span>
                    </div>
                </div>}
                {/* <div className='flex justify-between pb-1'>
                    <span className='font-extrabold'>Tip:</span>
                    <span className='text-secondary-peach-orange'>${tip.toFixed(2)}</span>
                </div> */}
                <div className='border-b border-[#425F57] w-full' />
                <div className='pt-1 flex justify-between text-[22px]'>
                    <span className='font-extrabold'>Total:</span>
                    <span>${isAdminGuestAccount ? 0 : share ? guestTotals?.total?.toFixed(2) : (totals?.total?.toFixed(2) ?? 0)}</span>
                </div>
            </div>
        </div>
    );
};

