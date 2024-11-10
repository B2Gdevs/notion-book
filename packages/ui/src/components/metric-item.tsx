import React from 'react';
import { CodeBlock } from './code-block'; // Make sure to import the CodeBlock component

interface MetricItemProps {
    icon: React.ElementType;
    count: number;
    label: string;
}

export const MetricItem: React.FC<MetricItemProps> = ({ icon: IconComponent, count, label }) => {
    return (
        <div className="flex items-center space-x-1 my-1">
            <IconComponent className="inline-block text-xs" />
            <CodeBlock>{count}</CodeBlock> {/* Use CodeBlock for count */}
            <span>{label}</span>
        </div>
    );
};