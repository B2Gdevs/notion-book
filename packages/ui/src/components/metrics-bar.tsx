import React from 'react';
import { MetricItem } from './metric-item';

interface Metric {
    icon: any;
    count: number;
    label: string;
}

interface MetricsBarProps {
    metrics: Metric[];
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ metrics }) => {
    return (
        <div className='border-b-2 border-black flex flex-wrap justify-between md:justify-start space-x-2 text-purple-600 text-sm overflow-auto mt-2'>
            {metrics.map((metric, index) => (
                <MetricItem key={index} icon={metric.icon} count={metric.count} label={metric.label} />
            ))}
        </div>
    );
};