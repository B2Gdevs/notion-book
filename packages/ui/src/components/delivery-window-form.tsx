'use client';

import { useForm } from '@tanstack/react-form';
import { useEffect, useState } from 'react';
import { TitleComponent, cn, toast, useCreateDeliveryWindow, useUpdateDeliveryWindow } from '..';
import { DeliveryWindow } from '../models/deliveryWindowModels';
import { Input } from './aceternity-ui/anim-input';
import { Label } from './aceternity-ui/anim-label';
import { AreaSelect } from './area-select'; // Ensure this is correctly imported
import { Button } from './ui/button';

interface DeliveryWindowFormProps {
    onSubmit: (window: DeliveryWindow) => void;
    onCancel?: () => void;
    initialData?: DeliveryWindow;
}

export const DeliveryWindowForm: React.FC<DeliveryWindowFormProps> = ({ onSubmit, onCancel, initialData }) => {

    const createDeliveryWindow = useCreateDeliveryWindow();
    const updateDeliveryWindow = useUpdateDeliveryWindow();

    const form = useForm<DeliveryWindow>({
        defaultValues: initialData || {
            area_id: '',
            org_ids: [],
            delivery_time: '',
            delivery_time_window_off_set: 30, // Default to 30 minutes
            kitchen_prep_time: '', // Time string in 'HH:MM' format
            order_cutoff_time: '', // Time string in 'HH:MM' format
        },
        onSubmit: async ({ value }) => {
            if (initialData) {
                // Update existing delivery window
                updateDeliveryWindow.mutate({ deliveryWindowId: initialData?.id ?? '', deliveryWindowData: value }, {
                    onSuccess: () => {
                        toast({
                            title: 'Delivery Window Updated',
                            description: 'Delivery window has been updated successfully',
                            duration: 3000,
                        });
                        onSubmit?.(value);
                        onCancel?.();
                    },
                    onError: (error) => {
                        toast({
                            title: 'Error updating delivery window',
                            description: error.body.detail || 'An unexpected error occurred',
                            duration: 5000,
                        });
                        onCancel?.();
                    }
                });
            } else {
                // Create new delivery window
                createDeliveryWindow.mutate(value, {
                    onSuccess: () => {
                        toast({
                            title: 'Delivery Window Created',
                            description: 'Delivery window has been created successfully',
                            duration: 3000,
                        });
                        onSubmit?.(value);
                        onCancel?.();
                    },
                    onError: (error) => {
                        toast({
                            title: 'Error creating delivery window',
                            description: error.body.detail || 'An unexpected error occurred',
                            duration: 5000,
                        });
                        onCancel?.();
                    }
                });
            }
        },
    });

    const [windowDescription, setWindowDescription] = useState('');

    useEffect(() => {
        const formatTime = (date: Date) => {
            const hours = date.getHours();
            const minutes = date.getMinutes();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            return `${formattedHours}:${formattedMinutes} ${ampm}`;
        };

        const calculateEndTime = (startTime: string, offset: number): string => {
            const [hours, minutes] = startTime.split(':').map(Number);
            const startDate = new Date();
            startDate.setHours(hours, minutes);
            const endDate = new Date(startDate.getTime() + offset * 60000); // offset in minutes
            return formatTime(endDate);
        };

        const updateWindowDescription = () => {
            const deliveryTime = form.state.values.delivery_time ?? '12:01';
            const offset = form.state.values.delivery_time_window_off_set ?? 30; // Default to 30 if undefined
            const [startHours, startMinutes] = deliveryTime.split(':').map(Number);
            const startDate = new Date();
            startDate.setHours(startHours, startMinutes);

            const formattedStartTime = formatTime(startDate);
            const formattedEndTime = calculateEndTime(deliveryTime, offset);

            setWindowDescription(`${formattedStartTime} - ${formattedEndTime}`);
        };

        updateWindowDescription();
    }, [form.state.values.delivery_time, form.state.values.delivery_time_window_off_set]);

    useEffect(() => {
        const handleDeliveryTimeChange = (value: string) => {
            const deliveryTimeDate = new Date();
            const [hours, minutes] = value.split(':').map(Number);
            deliveryTimeDate.setHours(hours, minutes);
    
            const kitchenTimeDate = new Date(deliveryTimeDate.getTime() - 60 * 60000); // 1 hour before
            const orderCutoffTimeDate = new Date(kitchenTimeDate.getTime() - 30 * 60000); // 30 minutes before
    
            const formatTime = (date: Date) => `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
            form.setFieldValue('kitchen_prep_time', formatTime(kitchenTimeDate));
            form.setFieldValue('order_cutoff_time', formatTime(orderCutoffTimeDate));
        };
        if (form.state.values.delivery_time) handleDeliveryTimeChange(form.state.values.delivery_time);
    }, [form.state.values.delivery_time]);

    return (
        <TitleComponent leftTitle='New Delivery Window Form'>
            <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4 p-5">
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="area_id">Area</Label>
                    <form.Field
                        name="area_id"
                        children={(field) => (
                            <AreaSelect
                                selectedAreaId={field.state.value}
                                onChange={(areaId) => field.handleChange(areaId)}
                                className="w-full"
                            />
                        )}
                    />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="order_cutoff_time">Order Cutoff Time</Label>
                    <span className="text-sm text-gray-500">Example: 10:30</span>
                    <form.Field
                        name="order_cutoff_time"
                        children={(field) => (
                            <Input
                                id="order_cutoff_time"
                                type="time"
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Order Cutoff Time (HH:MM)"
                                required
                            />
                        )}
                    />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="kitchen_prep_time">Kitchen Prep Time</Label>
                    <span className="text-sm text-gray-500">Example: 11:00</span>
                    <form.Field
                        name="kitchen_prep_time"
                        children={(field) => (
                            <Input
                                id="kitchen_prep_time"
                                type="time"
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Kitchen Prep Time (HH:MM)"
                                required
                            />
                        )}
                    />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="delivery_time">Delivery Time</Label>
                    <span className="text-sm text-gray-500">Example: 12:00</span>
                    <form.Field
                        name="delivery_time"
                        children={(field) => (
                            <Input
                                id="delivery_time"
                                type="time"
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(e.target.value)}
                                placeholder="Delivery Time (HH:MM)"
                                required
                            />
                        )}
                    />
                </LabelInputContainer>

                <LabelInputContainer className="mb-4">
                    <Label htmlFor="delivery_time_window_off_set">Delivery Time Window Offset (minutes)</Label>
                    <span className="text-sm text-gray-500">Default: 30 minutes</span>
                    <form.Field
                        name="delivery_time_window_off_set"
                        children={(field) => (
                            <Input
                                id="delivery_time_window_off_set"
                                name={field.name}
                                type="number"
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) => field.handleChange(Number(e.target.value))}
                                placeholder="Delivery Time Window Offset"
                                required
                            />
                        )}
                    />
                </LabelInputContainer>
                <div className="mb-4">
                    <Label>Delivery Window</Label>
                    <p className="text-lg">{windowDescription}</p>
                </div>
                <div className="flex justify-end space-x-2">
                    <Button type="button" variant={'destructive'} onClick={onCancel} className="btn-secondary">
                        Cancel
                    </Button>
                    <Button type="submit" className="btn-primary">
                        Submit
                    </Button>
                </div>
            </form>
        </TitleComponent>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};
