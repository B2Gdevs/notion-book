'use client';

import React, { useState, useEffect } from 'react';
import { StripeClient } from '../clients/integrationClients/stripeClient';
import { toast } from './ui/use-toast';
import { AmountDisplay } from './amount-dollars-display';
import { useSession } from '@clerk/nextjs';

interface PaymentMethod {
    id: string;
    card: {
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
    };
    type?: string;
}
interface ChargeComponentProps {
    stripeAccountId?: string | null;
    isInOrg?: boolean;
    paymentMethods?: PaymentMethod[];
}

export const ChargeComponent: React.FC<ChargeComponentProps> = ({ stripeAccountId = '', isInOrg, paymentMethods }) => {
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');
    const [localStripeAccountId, setLocalStripeAccountId] = useState('');
    // Initialize selectedPaymentMethodId with an empty string
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('');
    const session = useSession()?.session;


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = await session?.getToken() ?? '';
        try {
            await StripeClient.chargeCustomer(
                localStripeAccountId,
                amount,
                selectedPaymentMethodId,
                description,
                token
            );
            toast({
                title: 'Charge successful',
                description: 'The charge was successful.',
                duration: 3000,
            });

            // Reset form fields
            setAmount(0);
            setDescription('');
            setLocalStripeAccountId('');
            setSelectedPaymentMethodId('');
        } catch (error) {
            toast({
                title: 'Charge failed',
                description: 'The charge failed. Please try again later.',
                duration: 3000,
            });
        }
    };

    // Update selectedPaymentMethodId when paymentMethods changes
    useEffect(() => {
        setSelectedPaymentMethodId(paymentMethods?.[0]?.id || '');
    }, [paymentMethods]);

    useEffect(() => {
        if (stripeAccountId) {
            setLocalStripeAccountId(stripeAccountId);
        }
    }, [stripeAccountId]);

    return (
        <form onSubmit={handleSubmit} className='flex flex-col justify-start items-start gap-2'>

            {/* Amount in cents label & input */}
            <label className='flex flex-col justify-start items-start gap-2'>
                <span className='font-righteous'>
                    Amount (in cents):
                </span>
                <div className='flex justify-start items-center gap-2 w-full'>
                    <input required className='bg-gray-100 rounded-md p-1 mx-2 w-full' type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
                    =
                    <AmountDisplay amountInCents={amount} />
                </div>

            </label>

            {/* No Stripe Customer ID label & input when in org */}
            {!isInOrg &&
                <label className='flex flex-col justify-start items-start gap-2'>
                    <span className='font-righteous'>
                        Stripe Customer ID:
                    </span>
                    <input required className='bg-gray-100 rounded-md p-1 mx-2 w-full' type="text" value={localStripeAccountId} onChange={(e) => setLocalStripeAccountId(e.target.value)} />
                </label>
            }

            {/* Payment Method ID label & input when in org */}
            {isInOrg && <label className='flex flex-col justify-start items-start gap-2'>
                <span className='font-righteous'>
                    Payment Method ID:
                </span>
                <select
                    value={selectedPaymentMethodId}
                    onChange={(e) => setSelectedPaymentMethodId(e.target.value)}
                    className='bg-gray-100 rounded-md p-1 mx-2 w-full'
                >
                    {paymentMethods && paymentMethods
                        .filter((method) => method.type === 'card')
                        .map((method) => (
                            <option key={method.id} value={method.id}>
                                {method?.card?.brand.charAt(0).toUpperCase() + method?.card?.brand.slice(1)} ending in ....{method.card.last4}
                            </option>
                        ))}
                </select>
            </label>}

            {/* Payment Method ID label & input when not in org */}
            {!isInOrg && <label className='flex flex-col justify-start items-start gap-2'>
                <span className='font-righteous'>
                    Payment Method ID (e.g. card_1J2j3k4l5m6n7o):
                </span>
                <input required className='bg-gray-100 rounded-md p-1 mx-2 w-full' type="text" value={selectedPaymentMethodId} onChange={(e) => setSelectedPaymentMethodId(e.target.value)} />
            </label>}

            {/* Description label & input */}
            <label className='flex flex-col justify-start items-start gap-2'>
                <span className='font-righteous'>
                    Description (optional):
                </span>
                <input className='bg-gray-100 rounded-md p-1 mx-2 w-full' type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
            </label>

            <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white  py-2 px-4 rounded'>Submit</button>
        </form>
    );
};