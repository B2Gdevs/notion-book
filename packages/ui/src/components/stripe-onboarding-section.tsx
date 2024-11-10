'use client'
import { useState } from 'react';
import { useToast } from './ui/use-toast';
import { useCreateStripeConnectAccountLink } from '../hooks/integrations/stripeHooks';
import { Button } from './ui/button';
import { ActionedInput } from './actioned-input';
import { Org, copyTextToClipboard } from '..';
import { Copy } from 'lucide-react'; // Importing the Copy icon from lucide-react
import { Action } from '../models/actionModels'; // Importing the Action interface

interface StripeOnboardingSectionProps {
  org: Org;
  layout?: 'horizontal' | 'vertical';
}

export const StripeOnboardingSection: React.FC<StripeOnboardingSectionProps> = ({ org, layout = 'horizontal' }) => {
  const { toast } = useToast();
  const [stripeUrl, setStripeUrl] = useState<string>('');

  const { mutate: createStripeConnectAccount } = useCreateStripeConnectAccountLink({
    onSuccess: (response) => {
      setStripeUrl(response.url);
      toast({ description: 'Stripe onboarding link created successfully.' });
    },
    onError: (error) => {
      toast({ description: `Error creating Stripe link: ${error.message}` });
    },
  });

  function getStripeOnboardingLink() {
    if (!org?.id) {
      toast({ description: 'Organization ID is missing.' });
      return;
    }
    createStripeConnectAccount(org.id);
  }

  const layoutClasses = layout === 'horizontal' ? 'flex-row space-x-2' : 'flex-col space-y-2';

  // Function to handle copying text to the clipboard and showing a toast
  async function handleCopy(text: string) {
    copyTextToClipboard(text);
    toast({
      title: 'Copied to clipboard',
      description: 'Copied',
      duration: 1000,
    })
  }
  function createCopyAction(text: string): Action {
    return {
      name: '',
      id: 'copy',
      icon: Copy,
      modalDescription: 'Copy to Clipboard',
      modalTitle: 'Copy to Clipboard',
      noPopUp: true,
      onClick: () => handleCopy(text),
    };
  }

  return (
    <div className={`mt-5 flex-col ${layoutClasses} border border-black rounded-lg p-2`}>
      <Button className='mr-2' onClick={getStripeOnboardingLink}>
        Create Stripe Onboarding Link
      </Button>
      <ActionedInput className='w-full' label={'Stripe Onboarding Link'} value={stripeUrl} id={''} disabled={true} endActions={[createCopyAction(stripeUrl || 'N/A')]} />
    </div>
  );
};