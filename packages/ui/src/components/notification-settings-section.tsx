'use client';

import { FC, useEffect, useState } from 'react';
import { useUpdateUser } from '../hooks/userHooks';
import { NotificationPreferences, NotificationSetting } from '../models/miscModels';
import { User as BaseUser } from '../models/userModels';
import { Section } from './section';
import { Switch } from './ui/switch';
import { useToast } from './ui/use-toast';

interface User extends BaseUser {
    notification_settings?: NotificationPreferences;
}

interface NotificationSettingsSectionProps {
    user: User;
}

export const NotificationSettingsSection: FC<NotificationSettingsSectionProps> = ({
    user,
}: NotificationSettingsSectionProps) => {

    // const [successfulDelivery, setSuccessfulDelivery] = useState<NotificationSetting>({
    //     email: false,
    //     phone: false
    // });
    // const [substitutionRequests, setSubstitutionRequests] = useState<NotificationSetting>({
    //     email: false,
    //     phone: false
    // });
    // const [unsuccessfulPayment, setUnsuccessfulPayment] = useState<NotificationSetting>({
    //     email: false,
    //     phone: false
    // });
    // const [purchaseReceipt, setPurchaseReceipt] = useState<NotificationSetting>({
    //     email: false,
    //     phone: false
    // });
    const [friendlyReminder, setFriendlyReminder] = useState<NotificationSetting>({
        email: false,
        phone: false
    });

    useEffect(() => {
        if (user) {
            // setSuccessfulDelivery({
            //     email: user.notification_settings?.successful_delivery?.email ?? false,
            //     phone: user.notification_settings?.successful_delivery?.phone ?? false
            // });
            // setSubstitutionRequests({
            //     email: user.notification_settings?.substitution_requests?.email ?? false,
            //     phone: user.notification_settings?.substitution_requests?.phone ?? false
            // });
            // setUnsuccessfulPayment({
            //     email: user.notification_settings?.unsuccessful_payment?.email ?? false,
            //     phone: user.notification_settings?.unsuccessful_payment?.phone ?? false
            // });
            // setPurchaseReceipt({
            //     email: user.notification_settings?.purchase_receipt?.email ?? false,
            //     phone: user.notification_settings?.purchase_receipt?.phone ?? false
            // });
            setFriendlyReminder({
                email: user.notification_settings?.friendly_reminder?.email ?? false,
                phone: user.notification_settings?.friendly_reminder?.phone ?? false
            });
        }
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
        },
    });

    const handleSave = async (updatedSettings: NotificationPreferences) => {
        updateUserMutation.mutate({ userId: user?.id ?? '', user: { ...user, notification_settings: updatedSettings } });
    };

    const handleToggle = (setter: React.Dispatch<React.SetStateAction<NotificationSetting>>, current: NotificationSetting, property: 'email' | 'phone', settingName: keyof NotificationPreferences) => {
        const newValue = !current[property];
        const updatedSetting = { ...current, [property]: newValue };
        setter(updatedSetting);

        const updatedSettings: NotificationPreferences = {
            successful_delivery: user.notification_settings?.successful_delivery ?? { email: false, phone: false },
            substitution_requests: user.notification_settings?.substitution_requests ?? { email: false, phone: false },
            unsuccessful_payment: user.notification_settings?.unsuccessful_payment ?? { email: false, phone: false },
            friendly_reminder: user.notification_settings?.friendly_reminder ?? { email: false, phone: false },
            friendly_reminder_without_stipend: user.notification_settings?.friendly_reminder_without_stipend ?? { email: false, phone: false },
            purchase_receipt: user.notification_settings?.purchase_receipt ?? { email: false, phone: false },
            [settingName]: updatedSetting
        };

        handleSave(updatedSettings);
    };

    return (
        <>
            <Section
                expanded={true} hideChevron={true} className='mb-0 lg:mb-4'
            >
                <h2 className="text-2xl text-primary-almost-black mb-4 font-righteous">
                    Notification Settings
                </h2>
                <div className='flex flex-col justify-start items-start w-full lg:w-3/4'>

                    {/* Friendly Reminder Subsection */}
                    <label className='w-full'>
                        <div className='flex justify-between items-center w-full my-2 gap-2'>
                            <div>
                                <span className='font-righteous text-lg'>Email:</span>
                                <div>We will send you email reminders and notifications</div>
                            </div>
                            <Switch
                                className='cursor-pointer'
                                checkedRootColor="bg-primary-lime-green"
                                checkedThumbColor="bg-primary-spinach-green"
                                checked={friendlyReminder.email}
                                onClick={() => handleToggle(setFriendlyReminder, friendlyReminder, 'email', 'friendly_reminder')}
                            />
                        </div>
                    </label>
                    {/* <label className='w-full'>
                        <div className='flex justify-between items-center w-full my-2 gap-2'>
                            <div>
                                <span className='font-righteous text-lg'>Text:</span>
                                <div>We will send you text reminders and notifications</div>
                            </div>
                            <Switch
                                className='cursor-pointer'
                                checkedRootColor="bg-primary-lime-green"
                                checkedThumbColor="bg-primary-spinach-green"
                                checked={friendlyReminder.phone}
                                onClick={() => handleToggle(setFriendlyReminder, friendlyReminder, 'phone', 'friendly_reminder')}
                            />
                        </div>
                    </label> */}
                </div>
            </Section>
        </>
    );
};