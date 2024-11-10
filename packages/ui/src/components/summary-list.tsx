import React from 'react';
import SummarySection, { SummaryItemProps } from './summary-section';
import CompactSummaryItem from './compact-summary-item';
import { cn } from '..';

interface SummaryListProps {
    items: SummaryItemProps[];
    variant?: 'compact' | 'detailed'; // Add a variant prop
    className?: string;
}

export const SummaryList: React.FC<SummaryListProps> = ({ items, variant = 'detailed', className }) => {
    return (
        <div className={cn("space-y-1", className)}>
            {items.map((item, index) => {
                const itemVariant = index % 2 === 0 ? 'even' : 'odd';
                return variant === 'compact' ? (
                    <CompactSummaryItem key={index} variant={itemVariant} {...item} />
                ) : (
                    <SummarySection key={index} variant={itemVariant} {...item} />
                )
            })}
        </div>
    );
};