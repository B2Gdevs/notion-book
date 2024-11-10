'use client'
import { useSession } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Org, OrgSelect, useGetOrgsByQuery, useHandleCallback } from 'ui';

export default function CallbackPage() {
  const session = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state');
  const [redirectUri, setRedirectUri] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<Org>();

  useEffect(() => {
    setRedirectUri(`${window.location.origin}/callback`);
  }, []);

  const orgMemberships = session.session?.user?.organizationMemberships?.filter(
    (orgMembership) => orgMembership.role === 'admin'
  ) ?? [];

  const {data: orgs} = useGetOrgsByQuery({
    page: 1,
    pageSize: orgMemberships.length,
    externalIds: orgMemberships.map(org => org.organization.id)
  });

  const handleOrgChange = (org: Org) => {
    setSelectedOrg(org);
  };

  useEffect(() => {
    if (orgs && orgs.length > 0) {
      setSelectedOrg(orgs[0]);
    }
  }, [orgs]);

  const { mutate: handleCallback} = useHandleCallback(
    selectedOrg?.id ?? '',
    code ?? '',
    error,
    state ?? '',
    redirectUri,
    {
      onSuccess: () => console.log('Callback successful'),
      onError: (error) => console.error('Error in callback:', error)
    }
  );

  const handleGoToApp = () => {
    if (code && state && selectedOrg) {
      handleCallback();
    }
    router.push(`/accounts/${selectedOrg?.external_id}/admin`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-2xl animate-pulse">Thank you for using Colorfull</h1>
      {orgMemberships.length > 1 && (
        <>
          <h2 className="text-xl">You are an admin of multiple orgs.  Select one to continue</h2>
          <h2 className="text-xl">Select your organization</h2>
          <div className="max-w-md w-full">
            <OrgSelect
              orgs={orgs}
              onChange={handleOrgChange}
              className="mt-4"
              initialOrgId={selectedOrg?.id ?? ''}
            />
          </div>
        </>
      )}
      <div>Click the button below and it will take you there.</div>
      <div>Finish Authorizing {selectedOrg?.name ?? ''}</div>
      <Button 
        onClick={handleGoToApp}
        disabled={!selectedOrg}
      >
        Go To App
      </Button>
    </div>
  );
}