import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

type SheetComponentProps = {
    onOpenChange?: (open: boolean) => void;
    triggerContent: React.ReactNode;
    sheetContent: React.ReactNode;
    side?: 'left' | 'right' | 'top' | 'bottom';
    className?: string;
    isCheckout?: boolean;
    open?: boolean; // Add this line
};

export const SheetComponent: React.FC<SheetComponentProps> = ({
    onOpenChange,
    triggerContent,
    sheetContent,
    side = 'left',
    className,
    isCheckout,
    open = false,
}) => {
    return (
        <Sheet onOpenChange={onOpenChange} open={open}>
            <SheetTrigger asChild>{triggerContent}</SheetTrigger>
            <SheetContent className={className} side={side} isCheckout={isCheckout}>
                {sheetContent}
            </SheetContent>
        </Sheet>
    );
};