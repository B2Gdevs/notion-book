'use client';

import { X } from 'lucide-react';
import React from 'react';
import { Button, Dialog, DialogContent, DialogPrimitive, Org, useGetAuthData } from 'ui';

interface CallbackDialogProps {
  isDialogOpen: boolean;
  handleCloseDialog: () => void;
  headerText: React.ReactNode;
  paragraphText: string;
  buttonText: string;
  buttonColor?: string;
  org: Org; // Assuming orgId is passed as a prop now
}

const CallbackDialog: React.FC<CallbackDialogProps> = ({ isDialogOpen, handleCloseDialog, headerText, paragraphText, buttonText, buttonColor, org }) => {
  
  const redirectUri = `${window.location.origin}/callback`;
  // Using the custom hook to fetch auth data
  let { data: authData } = useGetAuthData(redirectUri, org?.id ?? '');
  


  // Default auth data to prevent uncontrolled component issues
  if (!authData) {
    authData = {
      authorize_endpoint: '',
      client_id: '',
      redirect_uri: '',
      response_type: '',
      scopes: [],
      state: '',
      code_challenge: '',
      code_challenge_method: '',
      org_id: org?.id ?? '',
    };
  }

  return (
    <Dialog open={isDialogOpen}>
      <DialogContent className="bg-secondary-creamer-beige rounded-lg shadow" isSticky={true}>
        <div className="flex flex-col items-center justify-center gap-x-4 pb-4">
          <div className="relative flex items-center justify-center gap-4 py-4 w-full">
            {headerText}
            <DialogPrimitive.Close
              className='absolute right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
              onClick={handleCloseDialog}
            >
              <X className='h-[30px] w-[30px]' />
              <span className='sr-only'>Close</span>
            </DialogPrimitive.Close>
          </div>
          <div className='border-b border-[#425F57] w-full' />
          <div className='font-sans py-4 px-8 text-center'>{paragraphText}</div>
          <form action={authData.authorize_endpoint} method="get">
            <input type="hidden" name="client_id" value={authData.client_id} />
            <input type="hidden" name="redirect_uri" value={authData.redirect_uri} />
            <input type="hidden" name="response_type" value={authData.response_type} />
            <input type="hidden" name="scope" value={authData.scopes} />
            <input type="hidden" name="state" value={authData.state} />
            <input type="hidden" name="code_challenge" value={authData.code_challenge} />
            <input type="hidden" name="code_challenge_method" value={authData.code_challenge_method} />
            <input type="hidden" name="org_id" value={authData.org_id} />
            <Button
              type="submit"
              className={`text-white text-base mt-4 px-8 py-6 rounded-md font-righteous ${buttonColor ? buttonColor : ''}`}
            >
              {buttonText}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CallbackDialog;
