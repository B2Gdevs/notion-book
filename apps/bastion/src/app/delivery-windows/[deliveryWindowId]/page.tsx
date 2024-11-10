'use client';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
    ActionedInput, Button, DeliveryWindow, DeliveryWindowForm, Dialog, DialogContent, useGetArea, useGetDeliveryWindowById,
    useGetOrgsByIds,
} from 'ui';

const DeliveryWindowDetails: React.FC = () => {
    const params = useParams();
    const deliveryWindowId = params.deliveryWindowId as string;
    const { data: deliveryWindowData, isLoading, error } = useGetDeliveryWindowById(deliveryWindowId);
    const [deliveryWindow, setDeliveryWindow] = useState<DeliveryWindow | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { data: area } = useGetArea(deliveryWindow?.area_id ?? '');
    const { data: orgs } = useGetOrgsByIds(deliveryWindow?.org_ids ?? []);

    useEffect(() => {
        if (deliveryWindowData) {
            setDeliveryWindow(deliveryWindowData);
        }
    }, [deliveryWindowData]);

    const handleEditClick = () => {
        setIsDialogOpen(true);
    };

    const handleFormSubmit = (updatedWindow: DeliveryWindow) => {
        setDeliveryWindow(updatedWindow);
        setIsDialogOpen(false);
    };

    const handleCancel = () => {
        setIsDialogOpen(false);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading delivery window details</div>;
    }

    return (
        <div className='p-4 flex flex-col gap-y-4'>
            <h2 className='text-2xl font-righteous p-2'>Delivery Window Details</h2>
            <Button onClick={handleEditClick} className="btn-primary">
                Edit Delivery Window
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className='bg-transparent border-transparent'>
                    <DeliveryWindowForm 
                        initialData={deliveryWindow ?? undefined} 
                        onSubmit={handleFormSubmit} 
                        onCancel={handleCancel} 
                    />
                </DialogContent>
            </Dialog>

            <div className='grid grid-cols-2 gap-4 bg-primary-almost-black-light p-5 rounded-xl'>
                {/* Existing inputs displaying delivery window details */}
                <div className='flex flex-col mb-2'>
                    <ActionedInput label={'ID'} value={deliveryWindow?.id ?? ''} id={'id'} disabled={true} />
                </div>
                <div className='flex flex-col mb-2'>
                    <ActionedInput label={'Area'} value={area?.name ?? ''} id={'area'} disabled={true} />
                </div>
                <div className='flex flex-col mb-2'>
                    <ActionedInput label={'Timezone'} value={deliveryWindow?.timezone ?? ''} id={'timezone'} disabled={true} />
                </div>
                <div className='flex flex-col mb-2'>
                    <ActionedInput label={'Delivery Time'} value={deliveryWindow?.delivery_time ?? 'N/A'} id={'delivery_time'} disabled={true} />
                </div>
                <div className='flex flex-col mb-2'>
                    <ActionedInput label={'Kitchen Prep Time'} value={deliveryWindow?.kitchen_prep_time ?? 'N/A'} id={'kitchen_prep_time'} disabled={true} />
                </div>
                <div className='flex flex-col mb-2'>
                    <ActionedInput label={'Order Cutoff Time'} value={deliveryWindow?.order_cutoff_time ?? 'N/A'} id={'order_cutoff_time'} disabled={true} />
                </div>
                <div className='flex flex-col mb-2'>
                    <ActionedInput
                        label={'Orgs'}
                        value={orgs?.map(org => org.name).join(', ') ?? 'N/A'}
                        id={'org_ids'}
                        disabled={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default DeliveryWindowDetails;