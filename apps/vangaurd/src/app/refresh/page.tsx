'use client'

import { NextPage } from 'next';
import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { BagLoader, MovingBorderButton, useCreateStripeConnectAccountLink, useGetCurrentUserColorfullOrg, useToast } from 'ui';

const RefreshPage: NextPage = () => {
    const { data: org } = useGetCurrentUserColorfullOrg();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [stripeUrl, setStripeUrl] = useState<string | null>(null);

    const { mutate: createStripeConnectAccount } = useCreateStripeConnectAccountLink({
        onSuccess: (response) => {
            setStripeUrl(response.url);
            setIsLoading(false);
            window.open(response.url, '_blank');
            toast({ description: 'Stripe onboarding link created successfully.' });
        },
        onError: (error) => {
            setIsLoading(false);
            toast({ description: `Error creating Stripe link: ${error.message}` });
        },
    });

    function handleOpenStripeLink() {
        if (stripeUrl) {
            window.open(stripeUrl, '_blank');
        } else if (!isLoading && org?.id) {
            setIsLoading(true);
            createStripeConnectAccount(org.id);
        } else if (!org?.id) {
            toast({ description: 'Organization ID is missing.' });
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 border-2 border-gray-200 rounded-lg shadow">
            <div className="mb-8 text-center">
                <div className="text-lg font-righteous text-gray-800">Hey there! 👋</div>
                <div className='my-10'>
                    <BagLoader/>
                </div>
                <div className="mt-2 text-gray-600">
                    <div>{`Click the button below to generate and open a Stripe onboarding link.`}</div>
                    <div>{`No worries, generating a new link won't affect any existing setups.`}</div>
                </div>
            </div>
            {org ? (
                <MovingBorderButton
                    onClick={handleOpenStripeLink}
                    borderClassName='h-20 w-20 opacity-[0.8] bg-[radial-gradient(var(--primary-cucumber-green)_40%,transparent_60%)]'
                    borderRadius="1.75rem"
                    className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800"
                >
                    {isLoading ? 'Loading...' : 'Click to Onboard!'}
                </MovingBorderButton>
            ) : (
                <div className="w-full max-w-xs">
                    <Skeleton count={3} />
                </div>
            )}
        </div>
    );
};

export default RefreshPage;