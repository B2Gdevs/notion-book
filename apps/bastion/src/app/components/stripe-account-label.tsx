import { PlusCircle } from 'lucide-react';
import React, { useState } from 'react';
import {
	Button, // Assuming Button is exported from 'ui'
	Checkbox,
	Input,
	Org,
	useConnectStripeAccount
} from 'ui';

interface Props {
	org: Org;
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	type: string;
}

export const StripeAccountLabel: React.FC<Props> = ({ org, onChange, type }) => {
	const [localOrg, setOrg] = useState<Org>(org);
	const [overrideDisabled, setOverrideDisabled] = useState<boolean>(false);
	const { mutate: connectStripeAccount, isLoading } = useConnectStripeAccount({
		onSuccess: (data) => {
			setOrg(
				{
					...org,
					stripe_account_id: data.stripe_account_id,
				}
			);
			// Handle success (e.g., show a success message, update local state)
		},

	});

	const handleCreateStripeAccount = () => {
		// Call the hook to create a Stripe account
		connectStripeAccount(org?.id ?? '');
	};

	return (
		<div className='flex flex-col mb-2'>
			<div className='flex items-center gap-x-2'>
				<span className="text-gray-700 font-righteous">
					Stripe Account ID:{' '}
				</span>
				{!org?.stripe_account_id && (
					<Button onClick={handleCreateStripeAccount} disabled={isLoading}>
						<PlusCircle className="mr-2" /> Create Stripe Account
					</Button>
				)}
				<div className='flex items-center gap-x-2 mt-2 '>
					<Checkbox
						checked={overrideDisabled}
						onClick={() => setOverrideDisabled(prev => !prev)}
					/>
					<span>Override</span>
				</div>
			</div>

			<Input
				type={type}
				name='stripe_account_id'
				value={org?.stripe_account_id ?? ''}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
					const newVal = { ...localOrg, stripe_account_id: e.target.value };
					setOrg(newVal);
					onChange?.(e);
				}}
				placeholder='No Stripe ID connected. We cannot charge/transfer.'
				className='border p-2'
				disabled={!overrideDisabled}
			/>
		</div>
	);
};