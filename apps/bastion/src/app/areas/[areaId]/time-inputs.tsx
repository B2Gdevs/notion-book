'use client'

import { ArrowUpLeftSquareIcon, Clock } from 'lucide-react';
import React, { useState } from 'react';
import { Area, Button, DeliveryWindow, DeliveryWindowForm, Dialog, DialogContent, Section, TitleComponent, useGetDeliveryWindows, useUpdateDeliveryWindow, CodeBlock } from 'ui'; // Import CodeBlock

interface TimeInputProps {
    area: Area;
}

export const TimeInputs: React.FC<TimeInputProps> = ({ area }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedWindow, setSelectedWindow] = useState<DeliveryWindow | null>(null);

    const { data: deliveryWindows } = useGetDeliveryWindows({ ids: area?.delivery_window_ids ?? [] });

    const updateDeliveryWindowMutation = useUpdateDeliveryWindow();

    const handleFormSubmit = (updatedWindow: DeliveryWindow) => {
        updateDeliveryWindowMutation.mutate({
            deliveryWindowId: updatedWindow?.id ?? '',
            deliveryWindowData: updatedWindow
        });
        setIsDialogOpen(false);
    };

    const handleCancel = () => {
        setIsDialogOpen(false);
    };

    const openDialog = (window: DeliveryWindow) => {
        setSelectedWindow(window);
        setIsDialogOpen(true);
    };

    return (
        <div>
            <Section expanded={true} hideChevron>
                <div className='flex space-x-2 items-center'>
                    <Clock />
                    <h3 className='text-xl font-righteous'>Timezone:</h3>
                </div>
                {deliveryWindows?.map(window => (
                    <div key={window.id} className="mb-4"> {/* Add margin-bottom for vertical separation */}
                        <Button onClick={() => openDialog(window)} className={window.is_default ? "bg-purple-950 text-white" : ''}>
                            Launch <ArrowUpLeftSquareIcon />
                            {window.is_default && (
                                <CodeBlock className="mx-2 text-purple-500 text-xs">Default</CodeBlock>
                            )}
                            <CodeBlock className="mx-2 text-purple-500 text-xs">ID: {window.id}</CodeBlock> {/* Use CodeBlock for ID */}
                            <CodeBlock className="mx-2 text-purple-500 text-xs">Delivery Time: {window.delivery_time}</CodeBlock> {/* Use CodeBlock for delivery time */}
                            <CodeBlock className="mx-2 text-purple-500 text-xs">Cutoff Time: {window.order_cutoff_time}</CodeBlock> {/* Use CodeBlock for cutoff time */}
                        </Button>
                    </div>
                ))}
                <TitleComponent leftTitle={`Delivery Window`} className="mt-4 p-4 border-2 border-black rounded-md">
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogContent className='bg-transparent border-transparent'>
                            <DeliveryWindowForm
                                initialData={selectedWindow ?? undefined}
                                onSubmit={handleFormSubmit}
                                onCancel={handleCancel}
                            />
                        </DialogContent>
                    </Dialog>
                </TitleComponent>
            </Section>
        </div>
    );
};