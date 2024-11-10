'use client';

import React, { useState } from 'react';
import { CodeBlock, TitleComponent } from 'ui';
import { motion } from 'framer-motion';

const PartnerMetricsPage: React.FC = () => {
    const [override, setOverride] = useState(false);
    const [activeView, setActiveView] = useState('iframe');

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setOverride(event.target.checked);
    };

    const handleMenuClick = (view: string) => {
        setActiveView(view);
    };

    const iframeSrc = override 
        ? 'http://localhost:8501/?email=ben@colorfull.ai&password=yolo' 
        : 'https://colorfull-streamlit-7cpxc2h4ea-uc.a.run.app?email=ben@colorfull.ai&password=yolo';

    const menuItems = [
        { name: 'iframe', label: 'Metrics View' },
        { name: 'restaurants', label: 'Restaurant Metrics' },
        { name: 'corporations', label: 'Corporation Metrics' }
    ];

    return (
        <TitleComponent leftTitle='Partner Metrics' className="mt-4" menuItems={menuItems} activeButton={activeView} onMenuItemClick={handleMenuClick}>
            <div className="m-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {activeView === 'iframe' && (
                        <TitleComponent leftTitle='Otter Order Metrics' className="mt-6">
                            <label className="flex items-center space-x-3 mt-4">
                                <input 
                                    type="checkbox" 
                                    checked={override} 
                                    onChange={handleCheckboxChange} 
                                    className="form-checkbox h-5 w-5 text-blue-600"
                                />
                                <span className="text-gray-700 ">Localhost Override URL</span>
                            </label>
                            <span className="text-gray-700">Current URL: <CodeBlock>{iframeSrc}</CodeBlock></span>
                            <iframe 
                                src={iframeSrc} 
                                className="w-full h-full mt-4 rounded-lg" 
                                title="Partner Metrics" 
                                style={{ minHeight: '90vh' }}
                            ></iframe>
                        </TitleComponent>
                    )}
                    {activeView === 'restaurants' && (
                        <TitleComponent leftTitle='Restaurants View' className="mt-4">
                            <div className="w-full h-full mt-4 rounded-lg" style={{ minHeight: '90vh', backgroundColor: '#f0f0f0' }}>
                                To be Continued
                            </div>
                        </TitleComponent>
                    )}
                    {activeView === 'corporations' && (
                        <TitleComponent leftTitle='Dummy View 2' className="mt-4">
                            <div className="w-full h-full mt-4 rounded-lg" style={{ minHeight: '90vh', backgroundColor: '#e0e0e0' }}>
                                To be Continued
                            </div>
                        </TitleComponent>
                    )}
                </motion.div>
            </div>
        </TitleComponent>
    );
};

export default PartnerMetricsPage;