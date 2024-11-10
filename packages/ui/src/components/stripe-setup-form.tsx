'use client';
import {
	Elements,
	PaymentElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import {
	StripeElements,
	StripeError,
	StripePaymentElementOptions,
	loadStripe,
} from '@stripe/stripe-js';
import { useState } from 'react';
import { Button, Org, User, toast, useCreateIntent } from '..';

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

const paymentElementOptions: StripePaymentElementOptions = {
	layout: {
		type: 'accordion',
		defaultCollapsed: false,
		radios: true,
		spacedAccordionItems: false,
	},
};

interface StripeSetupFormProps {
	user?: User;
	org?: Org;
}

interface StripeInnerFormProps {
	user?: User;
	org?: Org;
}

function StripeInnerForm({ user, org }: StripeInnerFormProps) {
	const stripe = useStripe();
	const elements = useElements() as StripeElements;
	const [setupComplete, setSetupComplete] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [submitClicked, setSubmitClicked] = useState(false);
	const stripeMutation = useCreateIntent();

	const handleError = (error: StripeError) => {
		setErrorMessage(error?.message ?? 'An unknown error occurred');
	};

	const handleSubmit = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		setSubmitClicked(true);
		if (!stripe) {
			return;
		}

		const { error: submitError } = await elements.submit();
		if (submitError) {
			handleError(submitError);
			return;
		}

		// Use org or user stripe account id
		const stripeAccountId = org?.stripe_account_id ?? user?.stripe_account_id;
		if (!stripeAccountId) {
			return;
		}

		const res = await stripeMutation.mutateAsync(stripeAccountId);
		const { client_secret: clientSecret } = await res;

		const { error } = await stripe.confirmSetup({
			elements,
			clientSecret,
			confirmParams: {
				return_url: `${window.location.href}?setupComplete=true`,
			},
		});

		if (error) {
			handleError(error);
			toast({ // Show error toast
				title: 'Error',
				description: 'Failed to setup the payment method.',
				duration: 3000,
			});
		} else {
			toast({ // Show success toast
				title: 'Success',
				description: 'The payment method has been successfully setup.',
				duration: 3000,
			});
		}
	};

	if (setupComplete) {
		return (
			<div className='p-4'>
				<h3 className='text-xl  mb-4'>Bank Details</h3>
				<div className='mb-2'>
					**** **** **** 1234 (Replace with masked version from Stripe if
					available)
				</div>
				<button
					onClick={() => setSetupComplete(false)}
					className='mt-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md'
				>
					Edit/Update
				</button>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit}>
			<PaymentElement options={paymentElementOptions} />
			{/* <PaymentButton label='Submit' type="submit" className='mt-2'/> */}
			<Button
				type='submit'
				className='mt-2 bg-primary-spinach-green text-primary-off-white'
				disabled={submitClicked}
			>
				{submitClicked ? 'Submitting...' : 'Submit'}
			</Button>
			{errorMessage && <div>{errorMessage}</div>}
		</form>
	);
}

export const StripeSetupForm: React.FC<StripeSetupFormProps>  = ({ user, org }: StripeSetupFormProps) => {
	return (
		<Elements
			stripe={stripePromise}
			options={{ mode: 'setup', currency: 'usd' }}
		>
			<StripeInnerForm 
				user={user}
				org={org}
			/>
		</Elements>
	);
}
