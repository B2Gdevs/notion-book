import React from 'react';
import { Label, RadioGroup, RadioGroupItem } from '..';

interface Props {
    isDeliveryWindowLunch: boolean;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


export const DeliveryWindowSelector: React.FC<Props> = ({ isDeliveryWindowLunch, handleInputChange }) => {
    return (
        <>
            <RadioGroup
                className='flex my-2'
                value={isDeliveryWindowLunch ? 'Lunch' : 'Non-lunch'}
                onValueChange={(value) =>
                    handleInputChange({
                        target: { name: 'delivery_window_type', value: value } as any,
                    } as React.ChangeEvent<HTMLInputElement>)
                }
            >
                <RadioGroupItem
                    value="Lunch"
                    className='bg-primary-cucumber-green-darker disabled:opacity-50'
                />
                <Label className="text-primary-cucumber-green-darker font-righteous">
                    No Delivery Windows
                </Label>
                <RadioGroupItem
                    value="Non-lunch"
                    className='bg-primary-cucumber-green-darker disabled:opacity-50'
                />
                <Label className="text-primary-cucumber-green-darker font-righteous">
                    Delivery Windows
                </Label>
            </RadioGroup>
        </>
    );
};