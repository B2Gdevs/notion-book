'use client'

import { useSearchParams } from 'next/navigation';
import React, { useState } from 'react';
import { InvoiceComponent, InvoicesTable, Switch } from 'ui';

const InvoicePage: React.FC = () => {
  const params = useSearchParams();
  // Ensure jobTotalIds is an array and handle undefined or other unexpected formats
  const jobTotalIdsParam = params.get('jobTotalIds');
  const jobTotalIds = jobTotalIdsParam ? jobTotalIdsParam.split(',').join(',') : '';

  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const handleSwitchChange = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  return (
    <div className='flex flex-col w-full m-2'>
      <div className="flex items-center gap-2 w-full">
        <div className='flex m-2 w-full'>
          <label htmlFor="toggleInvoices" className="cursor-pointer">
            {isSwitchOn ? 'Show Invoice Component' : 'Show Invoices Table'}
          </label>
          <Switch id="toggleInvoices" checked={isSwitchOn} onCheckedChange={handleSwitchChange} />
        </div>
      </div>
      {isSwitchOn ? <InvoicesTable /> : <InvoiceComponent canCharge={true} jobTotalIds={jobTotalIds} />}
    </div>
  );
};

export default InvoicePage;