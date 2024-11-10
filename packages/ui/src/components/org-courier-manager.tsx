'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CourierSelect } from './courier-select';
import { Button } from './ui/button';
import { ColorfullCourier, Input, toast, useGetCouriersByIds } from '..'; // Assuming this import includes the necessary types
import { Trash2 } from 'lucide-react';

interface PrioritizedCourier {
    courier_id: string; // Use courier_id instead of the whole courier object
    priority: number;
}

interface OrgCourierManagerProps {
    onSave: (prioritizedCouriers: PrioritizedCourier[]) => void;
    initialCouriers?: PrioritizedCourier[]; // Optional prop to pass initial couriers
}

export const OrgCourierManager: React.FC<OrgCourierManagerProps> = ({ onSave, initialCouriers }) => {
    const [prioritizedCouriers, setPrioritizedCouriers] = useState<PrioritizedCourier[]>(initialCouriers || []);

    useEffect(() => {
        if (initialCouriers) {
            setPrioritizedCouriers(initialCouriers);
        }
    }, [initialCouriers]);

    const handleCourierChange = (selectedCourier: ColorfullCourier) => {
        setPrioritizedCouriers(prev => {
            const index = prev.findIndex(c => c.courier_id === selectedCourier.id);
            if (index > -1) {
                const newCouriers = [...prev];
                // Ensure courier_id is always a string, provide a fallback empty string if undefined
                newCouriers[index] = { ...newCouriers[index], courier_id: selectedCourier.id ?? '' };
                return newCouriers;
            } else {
                // Similarly, ensure courier_id is a string, provide a fallback if undefined
                return [...prev, { courier_id: selectedCourier.id ?? '', priority: 3 }]; // Default priority is 3
            }
        });
    };

    const handlePriorityChange = (courierId: string, newPriority: number) => {
        // Ensure newPriority is at least 1
        if (newPriority >= 1) {
            setPrioritizedCouriers(prev => prev.map(c => {
                if (c.courier_id === courierId) {
                    return { ...c, priority: newPriority };
                }
                return c;
            }));
        } else {
            toast({
                title: 'Error',
                description: 'Priority must be at least 1.',
                duration: 3000,
            });
        }
    };

    const handleRemoveCourier = (courierId: string) => {
        setPrioritizedCouriers(prev => prev.filter(c => c.courier_id !== courierId));
    };

    const handleSave = () => {
        // Create a set to track unique priorities
        const prioritySet = new Set();
        let hasDuplicate = false;

        // Check for duplicate priorities
        for (const courier of prioritizedCouriers) {
            if (prioritySet.has(courier.priority)) {
                hasDuplicate = true;
                break;
            }
            prioritySet.add(courier.priority);
        }

        if (hasDuplicate) {
            toast({
                title: 'Error',
                description: 'Each courier must have a unique priority.',
                duration: 3000,
            });
            return; // Stop the save operation
        }

        // Proceed with save if all priorities are unique
        onSave(prioritizedCouriers);
    };

    // useMemo to cache courier IDs and only recalculate if prioritizedCouriers changes
    const courierIds = useMemo(() => prioritizedCouriers.map(pc => pc.courier_id), [prioritizedCouriers]);

    // Fetch the courier details within useEffect to control when it happens
    const { data: couriers, isLoading } = useGetCouriersByIds(courierIds);


    if (isLoading) {
        return <div>Loading couriers...</div>;
    }

    return (
        <div>
            <h2 className='font-righteous'>Preferred Couriers</h2>
            <CourierSelect onChange={handleCourierChange} />
            {prioritizedCouriers.map((pc) => (
                <div key={pc.courier_id} className='grid grid-cols-2 my-1 justify-center items-center p-1'>
                    <span>{couriers?.find(c => c.id === pc.courier_id)?.first_name} {couriers?.find(c => c.id === pc.courier_id)?.last_name}</span>
                    <div className='flex justify-center items-center gap-2'>
                        <Input
                            type="number"
                            className='w-2/12 text-center border border-2 border-black'
                            value={pc.priority}
                            onChange={(e) => {
                                const newPriority = parseInt(e.target.value);
                                if (!isNaN(newPriority)) {
                                    handlePriorityChange(pc.courier_id, newPriority);
                                } else {
                                    toast({
                                        title: 'Error',
                                        description: 'Please enter a valid number for priority.',
                                        duration: 3000,
                                    });
                                }
                            }}
                        />
                        <Trash2 onClick={() => handleRemoveCourier(pc.courier_id)} />
                    </div>
                </div>
            ))}
            <Button onClick={handleSave}>Save Organization Couriers</Button>
        </div>
    );
};