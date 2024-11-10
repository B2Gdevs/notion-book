import React from 'react';

interface AmountDisplayProps {
    amountInCents: number;
}

export const AmountDisplay: React.FC<AmountDisplayProps> = ({ amountInCents }) => {
    const amountInDollars = amountInCents / 100;
    return <span className='font-righteous'>${amountInDollars.toFixed(2)}</span>;
};