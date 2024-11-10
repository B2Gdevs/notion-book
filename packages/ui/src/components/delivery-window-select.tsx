'use client';

import { Loader2, Plus } from 'lucide-react';
import * as React from 'react';
import 'react-loading-skeleton/dist/skeleton.css';
import { useGetDeliveryWindows } from '../hooks/deliveryWindowHooks';
import { DeliveryWindow } from '../models/deliveryWindowModels';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DeliveryWindowForm, cn } from '..';

interface DeliveryWindowSelectProps {
    onWindowSelect: (window: DeliveryWindow) => void;
    className?: string;
    area_id?: string;
    isWithoutAddNewButton?: boolean;
    selectedWindow?: DeliveryWindow;
}

export const DeliveryWindowSelect: React.FC<DeliveryWindowSelectProps> = ({ 
    onWindowSelect, 
    className, 
    area_id, 
    isWithoutAddNewButton,
    selectedWindow
 }) => {
    const { data: deliveryWindows, isLoading, refetch } = useGetDeliveryWindows({
        areaId: area_id,
    });

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    // Use state to manage the selected value in the select component
    const [selectedValue, setSelectedValue] = React.useState<string | undefined>(selectedWindow?.delivery_time);

    const handleNewWindowSubmit = () => {
        refetch();
        setIsDialogOpen(false);
    };

    const handleValueChange = (value: string) => {
        setSelectedValue(value); // Update the selected value state
        const selectedWindow = deliveryWindows?.find(window => window.delivery_time === value);
        if (selectedWindow) {
            onWindowSelect(selectedWindow);
        }
    };

    React.useEffect(() => {
        // Update the selected value when selectedWindow prop changes
        if (selectedWindow) {
            setSelectedValue(selectedWindow.delivery_time);
        }
    }, [selectedWindow]);

    return (
        <div> 
            <div className={cn(`flex items-center`, className)}>
                <Select onValueChange={handleValueChange} value={selectedValue}>
                    <SelectTrigger className='mt-2'>
                        <SelectValue placeholder="Select a delivery window" />
                    </SelectTrigger>
                    <SelectContent>
                        {isLoading ? (
                            <>
                                <SelectItem value="loading" disabled>
                                    <Loader2 className="animate-spin h-6 w-6 mr-2" />
                                </SelectItem>
                            </>
                        ) : (
                            <>
                                {deliveryWindows?.length ? (
                                    deliveryWindows.map((window) => {
                                        const [hours, minutes] = (window.delivery_time ?? '00:00').split(':').map(Number);
                                        const offset = window.delivery_time_window_off_set ?? 0;

                                        if (isNaN(hours) || isNaN(minutes)) {
                                            return (
                                                <SelectItem key={window.id} value={window.delivery_time ?? ''} disabled>
                                                    Invalid time
                                                </SelectItem>
                                            );
                                        }

                                        const deliveryTime = new Date();
                                        deliveryTime.setHours(hours, minutes, 0, 0);

                                        const endTime = new Date(deliveryTime.getTime() + offset * 60000); // Convert offset from minutes to milliseconds

                                        const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

                                        return (
                                            <SelectItem key={window.id} value={window.delivery_time ?? ''}>
                                                {deliveryTime.toLocaleTimeString([], timeOptions)} - {endTime.toLocaleTimeString([], timeOptions)}
                                            </SelectItem>
                                        );
                                    })
                                ) : (
                                    <SelectItem value="no-windows" disabled>
                                        No delivery windows available
                                    </SelectItem>
                                )}
                            </>
                        )}
                    </SelectContent>
                </Select>
                {!isWithoutAddNewButton && <Button className="ml-2 mt-2" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-6 w-6" />
                </Button>}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className='bg-transparent border-transparent'>
                    <DeliveryWindowForm onSubmit={handleNewWindowSubmit} onCancel={() => setIsDialogOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
};