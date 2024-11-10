'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import { InvoiceComponent } from 'ui';

const InvoicePage: React.FC = () => {
  const params = useParams();
  const orgClerkId = params.id as string;

  return <InvoiceComponent initialOrgId={orgClerkId} />;
};

export default InvoicePage;