import React from 'react';
import { Org, OrgType, RadioGroup, RadioGroupItem, Label, getOrgTypeTagColor } from 'ui';

interface Props {
    org: Org;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


export const OrgTypeSelector: React.FC<Props> = ({ org, handleInputChange }) => {
    return (
        <>
            {org?.org_type && (
                <span
                    className={`px-2 py-1 rounded ${getOrgTypeTagColor(org?.org_type)}`}
                >
                    {org?.org_type}
                </span>
            )}
            <RadioGroup
                className='flex'
                value={org?.org_type}
                onValueChange={(value) =>
                    handleInputChange({
                        target: { name: 'org_type', value: value } as any, // Casting to any to satisfy the event type
                    } as React.ChangeEvent<HTMLInputElement>)
                }
            >
                <RadioGroupItem
                    value={OrgType.RECIPIENT}
                    className='bg-primary-spinach-green disabled:opacity-50'
                />
                <Label className="text-primary-spinach-green font-righteous">
                    Recipient
                </Label>
                <RadioGroupItem
                    value={OrgType.RESTAURANT}
                    className='bg-primary-spinach-green disabled:opacity-50'
                />
                <Label className="text-primary-spinach-green font-righteous">
                    Restaurant
                </Label>
            </RadioGroup>
        </>
    );
};