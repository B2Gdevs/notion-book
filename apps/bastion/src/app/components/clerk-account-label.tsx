import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import {
    Input,
    Org,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    Button,
    Checkbox, // Import Checkbox from 'ui'
    useCreateOrganization,
} from 'ui';

interface Props {
    org: Org;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ClerkAccountLabel: React.FC<Props> = ({ org, onChange }) => {
    const [localOrg, setOrg] = useState<Org>(org);
    const [overrideDisabled, setOverrideDisabled] = useState<boolean>(false); // Added state for override
    const { mutate: createOrganization, isLoading: isCreating } = useCreateOrganization();

    const handleCreateClick = () => {
        createOrganization({ name: localOrg.name });
    };

    return (
        <TooltipProvider>
            <div className='flex flex-col mb-2'>
                <div className='flex items-center gap-x-2'>
                    <span className="text-gray-700 font-righteous">
                        Clerk Account ID:{' '}
                    </span>
                    <Button
                        onClick={handleCreateClick}
                        disabled={!!org?.external_id || isCreating}
                        className={`${isCreating ? 'bg-gray-500' : 'bg-primary'} text-white`}
                    >
                        {isCreating ? 'Creating...' : 'Create Organization'}
                    </Button>
                    {!org?.external_id && (
                        <Tooltip>
                            <TooltipTrigger>
                                <AlertTriangle
                                    className='text-secondary-pink-salmon cursor-pointer'
                                />
                            </TooltipTrigger>
                            <TooltipContent>
                                Clerk account is not connected. Click to connect.
                            </TooltipContent>
                        </Tooltip>
                    )}
                    <div className='flex items-center gap-x-2 mt-2'>
                        <Checkbox
                            checked={overrideDisabled}
                            onClick={() => setOverrideDisabled(prev => !prev)}
                        />
                        <span>Override</span>
                    </div>
                </div>

                <Input
                    type='text'
                    name='external_id'
                    value={org?.external_id ?? ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newVal = { ...localOrg, external_id: e.target.value };
                        setOrg(newVal);
                        onChange?.(e);
                    }}
                    placeholder='Enter Clerk ID to connect.'
                    className='border p-2 mt-2'
                    disabled={!overrideDisabled && !!org?.external_id}
                />
            </div>
        </TooltipProvider>
    );
};