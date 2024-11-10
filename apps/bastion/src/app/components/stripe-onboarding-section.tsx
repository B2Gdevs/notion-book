import { useState } from 'react';
import { ActionedInput, Button, Org, useCreateStripeConnectAccountLink } from 'ui'; // Assuming 'ui' is the correct import path
import { useToast } from 'ui'; // Correct path for useToast

interface StripeOnboardingSectionProps {
  org: Org;
}

export const StripeOnboardingSection = ({ org }: StripeOnboardingSectionProps) => {
  const {toast} = useToast();
  const [stripeUrl, setStripeUrl] = useState<string>('');

  const { mutate: createStripeConnectAccount} = useCreateStripeConnectAccountLink({
    onSuccess: (response) => {
      setStripeUrl(response.url);
      toast({  description: 'Stripe onboarding link created successfully.' });
    },
    onError: (error) => {
      toast({  description: `Error creating Stripe link: ${error.message}` });
    },
  });

  function getStripeOnboardingLink() {
    if (!org?.id) {
      toast({  description: 'Organization ID is missing.' });
      return;
    }
    createStripeConnectAccount(org.id);
  }

  return (
    <div className='mt-5'>
      <Button className='mr-2' onClick={getStripeOnboardingLink} >
        Create Stripe Onboarding Link
      </Button>
      <ActionedInput label={'Stripe Onboarding Link'} value={stripeUrl} id={''} disabled={true} />
    </div>
  );
};