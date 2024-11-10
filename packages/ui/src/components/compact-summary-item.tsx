import React from 'react';
import { SummaryItemProps as BaseProps } from './summary-section';
import { CodeBlock } from './code-block';

interface SummaryItemProps extends BaseProps {
    variant: 'even' | 'odd';
}

const CompactSummaryItem: React.FC<SummaryItemProps> = ({ title, value, variant, valueComponent }) => {
    const bgColor = variant === 'even' ? 'bg-secondary-peach-orange-lightest' : 'bg-secondary-peach-orange-lighter';
    const borderColor = variant === 'odd' ? 'border-secondary-peach-orange-lightest' : 'border-secondary-peach-orange-lighter';

    return (
        <div className={`flex justify-between items-center p-2 ${bgColor} rounded-sm border-b ${borderColor} text-black`}>
            <span className='text-xs'>{title}</span>
            {valueComponent ? valueComponent :
            (
                <CodeBlock className='bg-slate-800 text-white'>{value}</CodeBlock>
            
            )}
        </div>
    );
};

export default CompactSummaryItem;