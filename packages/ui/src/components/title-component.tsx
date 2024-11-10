'use client'

import { motion } from 'framer-motion';
import Fuse from 'fuse.js';
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils'; // Assuming cn utility for className concatenations
import { ContextMenu, ContextMenuTrigger } from './ui/context-menu';

export interface TitleComponentMenuItem {
    name: string;
    label: string;
}

interface TitleComponentProps {
    leftTitle?: string;
    rightTitle?: string;
    centerTitle?: string;
    className?: string;
    leftTitleClassName?: string;
    rightTitleClassName?: string;
    centerTitleClassName?: string;
    children?: React.ReactNode;
    menuItems?: TitleComponentMenuItem[];
    activeButton?: string;
    onMenuItemClick?: (buttonName: string) => void;
    menuPosition?: 'bottom-right' | 'bottom-left' | 'default'; // New prop for menu position
    leftTitlePosition?: 'default' | 'bottom-right' | 'bottom-left'; // New prop for leftTitle position
    leftTitleIcon?: any; 
    overrideBackgroundColor?: string;
}

// Keywords and their associated background colors
const keywords = [
    { name: 'BatchRunResult', color: 'bg-primary-almost-black', fontColor: 'text-white' },
    { name: 'DeliveryJob', color: 'bg-secondary-peach-orange', fontColor: 'text-black' },
    { name: 'Order', color: 'bg-primary-off-white-darker', fontColor: 'text-black' },
    { name: 'Orders', color: 'bg-secondary-creamer-beige', fontColor: 'text-black' },
    { name: 'SubOrder', color: 'bg-primary-off-white', fontColor: 'text-black' },
    { name: 'DeliveryJobTotal', color: 'bg-secondary-peach-orange-lighter', fontColor: 'text-black' },
    { name: 'OrderTotal', color: 'bg-secondary-peach-orange-lighter', fontColor: 'text-black' },
    { name: 'Refund Options', color: 'bg-primary-spinach-green', fontColor: 'text-black' },
    { name: 'Job Status Details', color: 'bg-secondary-pink-salmon', fontColor: 'text-black' },
    { name: 'Invoice Summaries', color: 'bg-primary-almost-black', fontColor: 'text-white' },
    { name: 'America/Chicag', color: 'bg-purple-300', fontColor: 'text-white' },
    { name: 'User', color: 'bg-primary-almost-black', fontColor: 'text-white' },
    { name: 'Area', color: 'bg-secondary-peach-orange-lighter', fontColor: 'text-black' },
    { name: 'Brand', color: 'bg-blue-400', fontColor: 'text-black' },
    { name: 'Store', color: 'bg-blue-100', fontColor: 'text-black' },
    { name: 'Org', color: 'bg-secondary-pink-salmon', fontColor: 'text-black' },
];

// Adjust the threshold to be more lenient
const fuse = new Fuse(keywords, {
    keys: ['name'],
    includeScore: true,
    threshold: 0.9  // Increased threshold for more lenient matching
});

const determineColors = (title: string | undefined) => {
    if (!title) return { backgroundColor: 'bg-secondary-peach-orange', fontColor: 'text-black' }; // Default colors

    const results = fuse.search(title.toLowerCase());
    if (results.length > 0) {
        // Return the best match regardless of the score
        return { backgroundColor: results[0].item.color, fontColor: results[0].item.fontColor };
    }

    // If no results are found, return a default color set
    return { backgroundColor: 'bg-secondary-peach-orange', fontColor: 'text-black' };
};

export const TitleComponent: React.FC<TitleComponentProps> = ({
    leftTitle,
    rightTitle,
    centerTitle,
    className,
    leftTitleClassName,
    rightTitleClassName,
    centerTitleClassName,
    children,
    menuItems,
    activeButton,
    onMenuItemClick: onButtonClick,
    menuPosition = 'default',
    leftTitlePosition = 'default',
    leftTitleIcon: LeftTitleIcon, // Destructure the icon here
    overrideBackgroundColor,
}) => {
    const { backgroundColor, fontColor } = determineColors(leftTitle);
    const leftTitleRef = useRef<HTMLHeadingElement>(null);
    const [leftTitleWidth, setLeftTitleWidth] = useState(0);

    useEffect(() => {
        if (leftTitleRef.current) {
            setLeftTitleWidth(leftTitleRef.current.offsetWidth);
        }
    }, [leftTitle]);

    const getMenuPositionStyle = () => {
        switch (menuPosition) {
            case 'bottom-right':
                return { right: 0, bottom: 0, transform: 'translateY(50%)' };
            case 'bottom-left':
                return { left: 0, bottom: 0, transform: 'translateY(50%)' };
            default:
                return { left: `${leftTitleWidth + 20}px`, top: '0%', transform: 'translateY(-50%)' };
        }
    };

    const leftTitleStyle = cn(
        `border border-black absolute ${leftTitlePosition === 'bottom-right' ? 'bottom-0 right-0 transform translate-y-1/2' :
            leftTitlePosition === 'bottom-left' ? 'bottom-0 left-4 transform translate-y-1/2' :
                'top-0 left-4 transform -translate-y-1/2'
        } bg-white px-4 py-1 rounded-lg font-righteous text-lg`,
        leftTitleClassName,
        backgroundColor,
        fontColor
    );

    return (
        <div className={cn(`p-2 relative border-4 border-black rounded-lg my-2 ${overrideBackgroundColor ? overrideBackgroundColor : backgroundColor}`, className)}>
            <ContextMenu>
                <ContextMenuTrigger>
                    {leftTitle && (
                        <h2 ref={leftTitleRef} className={leftTitleStyle}>
                            <div className='flex justify-center items-center'>
                            {LeftTitleIcon && LeftTitleIcon} 
                            {leftTitle}
                            </div>
                        </h2>
                    )}
                    <div className="absolute text-xs" style={getMenuPositionStyle()}>
                        {menuItems?.map(item => (
                            <motion.button
                                key={item.name}
                                whileHover={{ scale: 1.1, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className={`py-2 px-4 rounded-full ${activeButton === item.name ? 'bg-white text-black underline border-2 border-blue-500' : 'bg-black text-white'} hover:bg-white hover:text-black focus:ring focus:ring-blue-300`}
                                onClick={() => onButtonClick?.(item.name)}
                                style={{ boxShadow: '0px 2px 5px rgba(0,0,0,0.1)' }}
                            >
                                🔹 {item.label}
                            </motion.button>
                        ))}
                    </div>
                    {centerTitle && (
                        <h1 className={cn("absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 border border-2 border-black px-1 py-2 rounded-lg font-righteous text-sm text-black", centerTitleClassName)}>
                            {centerTitle}
                        </h1>
                    )}
                    {rightTitle && (
                        <h2 className={cn("absolute top-0 right-4 transform -translate-y-1/2 bg-gray-200 border border-2 border-black px-1 py-1 rounded-lg font-righteous text-sm text-black", rightTitleClassName)}>
                            {rightTitle}
                        </h2>
                    )}

                    {children}
                </ContextMenuTrigger>
            </ContextMenu>
        </div>
    );
};