import React from 'react';
import { CodeBlock } from './code-block';
import { DollarSign } from 'lucide-react';
import { Button } from './ui/button';

export interface SummaryItemProps {
    title: string;
    value?: string;
    description: string;
    action?: () => void;
    actionDisplayText?: string;
    valueComponent?: React.ReactNode;
    isActionActive?: boolean;
    variant?: 'even' | 'odd';
}

const SummarySection: React.FC<SummaryItemProps> = ({ title, value, description, action, actionDisplayText, valueComponent, isActionActive = true, variant }) => {
    const bgColor = variant === 'even' ? 'bg-gray-100' : 'bg-white';

    return (
        <div className={`border-b border-gray-300 pt-4 ${bgColor} p-2 rounded-md text-xs sm:text-sm md:text-base`}>
            <div className='flex justify-between items-center'>
                <h3 className="text-lg sm:text-md md:text-lg ">{title}</h3>
                {valueComponent ? (
                    <CodeBlock className='flex items-center bg-gray-600 text-white'>
                        {valueComponent}
                    </CodeBlock>
                ) : value && (
                    <CodeBlock className='flex items-center bg-gray-600 text-white'>
                        <DollarSign className="mr-2" />{value}
                    </CodeBlock>
                )}
            </div>
            <div className='text-xs sm:text-xs md:text-sm text-gray-500'>{description}</div>
            <div className='flex justify-start my-2'>
            {isActionActive && action && (
                    <Button onClick={action} className="ml-4 text-xs sm:text-sm">{actionDisplayText}</Button>
                )}
            </div>
        </div>
    );
};

export default SummarySection;