'use client';

import React, { useState } from 'react';
import { StripeClient } from '../clients/integrationClients/stripeClient';
import { toast } from './ui/use-toast';
import { AmountDisplay } from './amount-dollars-display';
import { useSession } from '@clerk/nextjs';

export const TransferComponent = () => {
    const [totalAmountInCents, setTotalAmountInCents] = useState(0);
    const [destinationStripeAccountId, setDestinationStripeAccountId] = useState('');
    const [description, setDescription] = useState('');
    const [transferGroup, setTransferGroup] = useState('');
    const session = useSession()?.session;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = await session?.getToken() ?? '';
        try {
            await StripeClient.transferToRecipient(
                'usd', // Hardcoded for now
                totalAmountInCents,
                destinationStripeAccountId,
                description,
                transferGroup,
                token
            );
            toast({
                title: 'Transfer successful',
                description: 'The transfer was successful.',
                duration: 3000,
            });

            // Reset form fields
            setTotalAmountInCents(0);
            setDestinationStripeAccountId('');
            setDescription('');
            setTransferGroup('');
        } catch (error) {
            toast({
                title: 'Transfer failed',
                description: 'The transfer failed. Please try again later.',
                duration: 3000,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-col justify-start items-start gap-2'>
            <label className='flex flex-col justify-start items-start gap-2'>
                <span className='font-righteous'>
                    Total Amount (in cents):
                </span>
                <div className='flex justify-start items-center gap-2 w-full'>
                    <input required className='bg-gray-100 rounded-md p-1 mx-2 w-full' type="number" value={totalAmountInCents} onChange={(e) => setTotalAmountInCents(Number(e.target.value))} />
                    = 
                    <AmountDisplay amountInCents={totalAmountInCents} />
                </div>
            </label>
            <label className='flex flex-col justify-start items-start gap-2'>
                <span className='font-righteous'>
                    Destination Stripe Account ID:
                </span>
                <input required className='bg-gray-100 rounded-md p-1 mx-2 w-full' type="text" value={destinationStripeAccountId} onChange={(e) => setDestinationStripeAccountId(e.target.value)} />
            </label>
            <label className='flex flex-col justify-start items-start gap-2'>
                <span className='font-righteous'>
                    Description (optional):
                </span>
                <input className='bg-gray-100 rounded-md p-1 mx-2 w-full' type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>
            <label className='flex flex-col justify-start items-start gap-2'>
                <span className='font-righteous'>
                    Transfer Group (optional):
                </span>
                <input className='bg-gray-100 rounded-md p-1 mx-2 w-full' type="text" value={transferGroup} onChange={(e) => setTransferGroup(e.target.value)} />
            </label>
            <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded'>Submit</button>
        </form>
    );
};