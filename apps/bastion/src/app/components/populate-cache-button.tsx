import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, cn, toast } from 'ui';
import { motion, AnimatePresence } from 'framer-motion';
import { Package } from 'lucide-react';

interface PopulateCacheButtonProps {
    disabled?: boolean;
}

const PopulateCacheButton: React.FC<PopulateCacheButtonProps> = ({ disabled }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handlePopulateClick = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8001/set_cache_state_1', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            toast({
                title: 'Cache populated',
                duration: 5000,
            });
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: 'Error populating cache',
                duration: 5000,
            });
        }
    };

    return (
        <div className='fixed right-0 top-0 transform flex flex-col gap-4 z-50'>
            <motion.div
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className='bg-black cursor-pointer rounded-full border-2 border-primary-almost-black p-2 text-white flex items-center'
            >
                <Package className='cursor-pointer' size={32} color="white" />
                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 'auto', opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            className='overflow-hidden'
                        >
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        onClick={!disabled ? handlePopulateClick : undefined}
                                        className={cn("text-white text-base  no-underline",
                                            disabled ? "bg-gray cursor-not-allowed" : "hover:bg-gray-700 rounded-lg")}
                                        style={{ padding: '8px 16px' }}
                                    >
                                        Populate Test Cache
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent side="top">This will put test data in the cache for testing purposes.  Must be in TEST Mode</TooltipContent>
                            </Tooltip>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default PopulateCacheButton;