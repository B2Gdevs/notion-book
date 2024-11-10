'use client';

import { Player } from '@lottiefiles/react-lottie-player';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { PaymentButton, useGetOrg, useUpdateOrg } from 'ui';

const ReturnPage: React.FC = () => {
	const router = useRouter();
	const params = useSearchParams();

	const accountId = params.get('accountId') as string;
	const orgId = params.get('orgId') as string;

	const { data: org, isLoading: orgLoading } = useGetOrg(orgId);
	const updateOrgMutation = useUpdateOrg();

	useEffect(() => {
		if (!orgLoading && org) {
			const updatedOrg = {
				...org,
				bank_onboarding_complete: true,
				stripe_account_id: accountId,
			};
			updateOrgMutation.mutate(updatedOrg);
		}
	}, [orgLoading]);

	useEffect(() => {
		setTimeout(() => {
			router.push(`/orgs/${org?.id}`);
		}, 2000);
	}, [router, org]);

	return (
		<div className='flex flex-col items-center p-8 max-w-2xl mx-auto space-y-6'>
			<h1 className='text-4xl '>
				We are on our way to a successful delivery to your office!
			</h1>
			<div className='text-lg mt-4 text-center'>
				{"You will be redirected within 2 seconds to the organization's page. If not, please click the button below."}
			</div>

			<div className='mt-6'>
				<Player
					autoplay
					loop
					src='/successful-food-delivery.json'
					className='w-72 h-72'
				/>
			</div>

			<PaymentButton
				label='Go to Org Editor'
				onClick={() => router.push(`/orgs/${org?.id}`)}
			/>
		</div>
	);
};

export default ReturnPage;
