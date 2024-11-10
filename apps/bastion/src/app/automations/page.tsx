'use client'

import React, { useState } from 'react';
import { SvixEmbed } from 'ui';
import { TitleComponent } from 'ui';

const AutomationsPage = () => {
    const [activeButton, setActiveButton] = useState('webhooks');
    const menuItems = [
        { name: 'schedulers', label: 'Schedulers' },
        { name: 'webhooks', label: 'Webhooks' }
    ];

    const handleButtonClick = (buttonName: string) => {
        setActiveButton(buttonName);
    };

    return (
        <TitleComponent
            leftTitle='Automations'
            className='m-4'
            menuItems={menuItems}
            activeButton={activeButton}
            onMenuItemClick={handleButtonClick}
        >
            <div className="flex flex-col h-screen bg-gray-900 text-white">
                <div className="flex-1 p-10">
                    <TitleComponent
                        leftTitle={activeButton === 'schedulers' ? 'Schedulers' : 'SVIX Webhooks'}
                        rightTitle={activeButton === 'schedulers' ? 'Schedulers are what we have running for the operations of our system. (WIP)' : 'Webhooks are messages our system is broadcasting to any endpoints given.'}
                        rightTitleClassName='text-black'
                    >
                        {activeButton === 'schedulers' ? <iframe src="/automations/schedulers" className="w-full h-full" title="Schedulers" style={{ minHeight: '90vh' }}></iframe> : <SvixEmbed />}
                    </TitleComponent>
                </div>
            </div>
        </TitleComponent>
    );
}

export default AutomationsPage;