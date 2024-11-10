"use client"

import { IntercomProvider } from 'react-use-intercom';

const INTERCOM_APP_ID = 'n6tly6eu';

interface IntercomProviderWithClientProps {
  children: any;
}

export const IntercomProviderWithClient: React.FC<IntercomProviderWithClientProps> = ({ children }) => {
  return (
    <IntercomProvider appId={INTERCOM_APP_ID}>
      {children}
    </IntercomProvider>
  );
}