import React from 'react';
import { SummaryItemProps } from './summary-section';
import { SummaryList } from './summary-list';
import { cn } from '..';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from './ui/context-menu';
import { TitleComponent } from './title-component';

export interface DualColumnLayoutProps {
    leftTitle?: string;
    rightTitle?: string;
    centerTitle?: string; // New prop for center title
    leftColumnSummaryItems: SummaryItemProps[];
    rightColumnSummaryItems: SummaryItemProps[];
    rightColumnVariant?: 'compact' | 'detailed';
    leftColumnVariant?: 'compact' | 'detailed';
    reverseColumns?: boolean;
    className?: string;
    leftTitleClassName?: string; // New prop for left title class name
    rightTitleClassName?: string; // New prop for right title class name
    centerTitleClassName?: string; // New prop for center title class name
    childrenPosition?: 'above' | 'below';
    children?: React.ReactNode;
    useContextMenu?: boolean;
    hideLeftColumn?: boolean;
}

export const DualColumnLayout: React.FC<DualColumnLayoutProps> = ({
    leftTitle,
    rightTitle,
    centerTitle,
    leftColumnSummaryItems,
    rightColumnSummaryItems,
    rightColumnVariant = 'detailed',
    leftColumnVariant = 'compact',
    reverseColumns = false,
    className,
    leftTitleClassName,
    rightTitleClassName,
    centerTitleClassName,
    childrenPosition = 'below',
    children,
    useContextMenu = true,
    hideLeftColumn = false
}) => {

    const leftColumn = (
        <div className='w-2/5 bg-secondary-peach-orange p-2 rounded-lg my-2'>
            <SummaryList items={leftColumnSummaryItems} variant={leftColumnVariant} />
        </div>
    );

    const rightColumn = (
        <div className={`w-${hideLeftColumn ? 'full' : '3/5'} p-2`}>
            <SummaryList items={rightColumnSummaryItems} variant={rightColumnVariant} />
        </div>
    );

    const columns = (
        <div className='flex space-x-6 p-6'>
            {reverseColumns ? [rightColumn, hideLeftColumn ? null : leftColumn] : [hideLeftColumn ? null : leftColumn, rightColumn]}
        </div>
    );

    const layoutContent = (
            <TitleComponent
                leftTitle={leftTitle}
                rightTitle={rightTitle}
                centerTitle={centerTitle}
                leftTitleClassName={leftTitleClassName}
                rightTitleClassName={rightTitleClassName}
                centerTitleClassName={centerTitleClassName}
                className={cn('relative border-4 border-black rounded-lg my-2 bg-secondary-peach-orange', className)}
            >
            {childrenPosition === 'above' && children}
            {columns}
            {childrenPosition === 'below' && children}
            </TitleComponent>
    );


    const extractActions = (items: SummaryItemProps[]) => {
        const actions = items
            .filter(item => item.action && item.isActionActive)
            .map((item, index) => (
                <ContextMenuItem key={index} onClick={item.action}>
                    {item.actionDisplayText || `Action for ${item.title}`}
                </ContextMenuItem>
            ));
        return actions.length > 0 ? actions : null;
    };

    if (useContextMenu) {
        const leftActions = extractActions(leftColumnSummaryItems);
        const rightActions = extractActions(rightColumnSummaryItems);

        if (leftActions || rightActions) {
            return (
                <ContextMenu>
                    <ContextMenuTrigger>{layoutContent}</ContextMenuTrigger>
                    <ContextMenuContent>
                        {leftActions}
                        {rightActions}
                    </ContextMenuContent>
                </ContextMenu>
            );
        }
    }
    return layoutContent;
};