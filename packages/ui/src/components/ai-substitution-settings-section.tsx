'use client';

import { FC, useState, useEffect } from 'react';
import { useUpdateUser } from '../hooks/userHooks';
import { NotificationPreferences } from '../models/miscModels';
import { User as BaseUser } from '../models/userModels';
import { Section } from './section';
import { Switch } from './ui/switch';
import { useToast } from './ui/use-toast';

interface User extends BaseUser {
    notification_settings?: NotificationPreferences;
}

interface AiSubstitutionSettingsSectionProps {
    user: User;
}

export const AiSubstitutionSettingsSection: FC<AiSubstitutionSettingsSectionProps> = ({
    user,
}: AiSubstitutionSettingsSectionProps) => {

    const [substitutionsAllowed, setSubstitutionsAllowed] = useState<boolean>(user.substitutions_allowed ?? false);

    useEffect(() => {
        setSubstitutionsAllowed(user.substitutions_allowed ?? false);
    }, [user]);

    const { toast } = useToast();
    const updateUserMutation = useUpdateUser({
        onSuccess: () => {
            toast({
                title: 'Notification settings updated',
                description: 'Notification settings updated successfully',
                duration: 3000,
            });
        },
        onError: (error) => {
            toast({
                title: 'Error updating notification settings',
                description: `Error: ${error.message}`,
                duration: 3000,
            });
            // Revert the state if there's an error
            setSubstitutionsAllowed(user.substitutions_allowed ?? false);
        },
    });

    const handleSave = async (newValue: boolean) => {
        setSubstitutionsAllowed(newValue);
        updateUserMutation.mutate({ userId: user?.id ?? '', user: { ...user, substitutions_allowed: newValue } });
    };

    return (
        <>
            <Section
                expanded={true} hideChevron={true} className='mb-0'
            >
                <h2 className="text-2xl text-primary-almost-black mb-4 font-righteous">
                    AI Substitution Settings
                </h2>
                <div className='flex flex-col justify-start items-start w-full lg:w-3/4'>

                    <label className='w-full'>
                        <div className='flex justify-between items-center w-full my-2 gap-2'>
                            <div>In the event that your original order is canceled or cannot be completed, we will find a similar substitution for you.</div>
                            <Switch
                                className='cursor-pointer'
                                checkedRootColor="bg-primary-lime-green"
                                checkedThumbColor="bg-primary-spinach-green"
                                checked={substitutionsAllowed}
                                onClick={() => {
                                    const newValue = !substitutionsAllowed;
                                    setSubstitutionsAllowed(newValue);
                                    handleSave(newValue);
                                }}
                            />
                        </div>
                    </label>
                </div>
            </Section>
        </>
    );
};