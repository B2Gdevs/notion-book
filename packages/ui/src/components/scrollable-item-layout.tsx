import React from 'react';
import { SummaryItemProps } from './summary-section';

interface ScrollableItemLayoutProps {
    title: string;
    summaryItems: SummaryItemProps[];
}

export const ScrollableItemLayout: React.FC<ScrollableItemLayoutProps> = ({ title, summaryItems }) => {
    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-lg ">{title}</h3>
            <div className="flex overflow-x-auto whitespace-nowrap scroll-snap-x scrollable-container">
                {summaryItems.map((item, index) => (
                    <div key={index} className="snap-start flex-none bg-gray-300 p-2 rounded-lg m-1">
                        <p className="">{item.title}</p>
                        <p>{item.value}</p>
                        <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};