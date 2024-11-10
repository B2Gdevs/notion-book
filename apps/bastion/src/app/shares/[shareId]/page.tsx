'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Share } from 'ui/src/models/shareModels';
import {
    ActionedInput, useGetShare,
} from 'ui';

const ShareDetails: React.FC = () => {
    const params = useParams();
    const shareId = params.shareId as string;
    const { data: shareData, isLoading, error } = useGetShare(shareId);
    const [share, setShare] = useState<Share | null>(null);

    useEffect(() => {
        if (shareData) {
            setShare(shareData);
        }
    }, [shareData]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading share details</div>;
    }

    return (
        <div className='p-4 flex flex-col gap-y-4'>
            <h2 className='text-2xl  font-righteous p-2'>Share Details</h2>
            <div className='grid grid-cols-2 gap-4 bg-primary-almost-black-light p-5 rounded-xl'>
                <div className='flex flex-col mb-2'>
                    <ActionedInput label={'Date'} value={share?.date.toString() ?? ''} id={'date'} disabled={true} />
                </div>
                <div className='flex flex-col mb-2'>
                    <ActionedInput label={'Organization ID'} value={share?.org_id ?? ''} id={'org_id'} disabled={true} />
                </div>
                <div className='flex flex-col mb-2'>
                    <ActionedInput label={'Guests'} value={share?.guests.toString() ?? ''} id={'guests'} disabled={true} />
                </div>
                <div className='flex flex-col mb-2'>
                    <ActionedInput label={'Budget'} value={share?.budget?.toString() ?? 'N/A'} id={'budget'} disabled={true} />
                </div>
                <div className='flex flex-col mb-2'>
                    <ActionedInput label={'Payment Method ID'} value={share?.payment_method_id ?? ''} id={'payment_method_id'} disabled={true} />
                </div>
                <div className='flex flex-col mb-2'>
                    <ActionedInput label={'Custom Message'} value={share?.custom_message ?? ''} id={'custom_message'} disabled={true} />
                </div>
                <div className='flex flex-col mb-2'>
                    <ActionedInput label={'Email Domains Whitelist'} value={share?.email_domains_whitelist?.join(', ') ?? 'N/A'} id={'email_domains_whitelist'} disabled={true} />
                </div>
                <div className='flex flex-col mb-2'>
                    <ActionedInput label={'ID'} value={share?.id ?? ''} id={'id'} disabled={true} />
                </div>
                <div className='flex flex-col mb-2'>
                    <ActionedInput label={'Order IDs'} value={share?.order_ids?.join(', ') ?? 'N/A'} id={'order_ids'} disabled={true} />
                </div>
                <div className='flex flex-col mb-2'>
                    <ActionedInput label={'Order Total IDs'} value={share?.order_total_ids?.join(', ') ?? 'N/A'} id={'order_total_ids'} disabled={true} />
                </div>
            </div>
        </div>
    );
};

export default ShareDetails;