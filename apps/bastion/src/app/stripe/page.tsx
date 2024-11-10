'use client';

import React from 'react';
import { TransferComponent, ChargeComponent, PageTitleDisplay } from 'ui';

const Page = () => {

	return (
		<div className='p-6 mx-auto bg-white rounded-xl shadow-md flex-col items-center space-x-4 w-full'>
			<PageTitleDisplay overrideTitle='Home' additionalText='Stripe' />
            {/* Create a section for payout and one for transfers */}
            <section className='p-4 rounded-lg shadow-md border-4 mt-4 border-t border-gray-200'>
                <h2 className='text-2xl  mb-4'>Charges</h2>
                <ChargeComponent />
            </section>
            <section className='p-4 rounded-lg shadow-md border-4 mt-4 border-t border-gray-200'>
                <h2 className='text-2xl  mb-4'>Transfers</h2>
                <TransferComponent />
            </section>

		</div>
	);
};

export default Page;
