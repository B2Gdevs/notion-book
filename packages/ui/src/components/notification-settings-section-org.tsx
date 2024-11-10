'use client';

import { FC, useEffect, useState } from 'react';
import { NotificationPreferences, NotificationSetting } from '../models/miscModels';
import { Section } from './section';
import { Switch } from './ui/switch';
import { useToast } from './ui/use-toast';
import { MeteorCallout, Org, useUpdateOrg } from '..';

interface OrgNotificationSettingsSectionProps {
    org: Org;
    isBastionView?: boolean;
}

export const OrgNotificationSettingsSection: FC<OrgNotificationSettingsSectionProps> = ({
    org,
    isBastionView,
}: OrgNotificationSettingsSectionProps) => {

    const [friendlyReminder, setFriendlyReminder] = useState<NotificationSetting>({
        email: false,
        phone: false
    });
    const [friendlyReminderWithoutStipend, setFriendlyReminderWithoutStipend] = useState<NotificationSetting>({
        email: false,
        phone: false
    });

    useEffect(() => {
        if (org) {
            setFriendlyReminder({
                email: org.notification_settings?.friendly_reminder?.email ?? false,
                phone: org.notification_settings?.friendly_reminder?.phone ?? false
            });
            setFriendlyReminderWithoutStipend({
                email: org.notification_settings?.friendly_reminder_without_stipend?.email ?? false,
                phone: org.notification_settings?.friendly_reminder_without_stipend?.phone ?? false
            });
        }
    }, [org]);

    const { toast } = useToast();
    const updateUserMutation = useUpdateOrg({
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
        updateUserMutation.mutate({ ...org, notification_settings: updatedSettings });
    };

    const handleToggle = (setter: React.Dispatch<React.SetStateAction<NotificationSetting>>, current: NotificationSetting, property: 'email' | 'phone', settingName: keyof NotificationPreferences) => {
        const newValue = !current[property];
        const updatedSetting = { ...current, [property]: newValue };
        setter(updatedSetting);

        const updatedSettings: NotificationPreferences = {
            successful_delivery: org.notification_settings?.successful_delivery ?? { email: false, phone: false },
            substitution_requests: org.notification_settings?.substitution_requests ?? { email: false, phone: false },
            unsuccessful_payment: org.notification_settings?.unsuccessful_payment ?? { email: false, phone: false },
            friendly_reminder: org.notification_settings?.friendly_reminder ?? { email: false, phone: false },
            friendly_reminder_without_stipend: org.notification_settings?.friendly_reminder_without_stipend ?? { email: false, phone: false },
            purchase_receipt: org.notification_settings?.purchase_receipt ?? { email: false, phone: false },
            [settingName]: updatedSetting
        };

        handleSave(updatedSettings);
    };

    return (
        <>
            <Section
                expanded={true} hideChevron={true} className='mb-0 lg:mb-4'
            >
                <h2 className={`${isBastionView ? 'text-base' : 'text-2xl'} text-primary-almost-black mb-4 font-righteous`}>
                    Notification Settings
                </h2>
                <div className={`flex flex-col justify-start items-start w-full lg:w-3/4 ${isBastionView ? 'text-sm' : ''}`}>

                    {/* Friendly Reminder Subsection */}
                    <h2 className='italic text-gray-400'>Friendly Reminder W/ Stipend</h2>
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
                    <label className='w-full'>
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
                    </label>

                    {/* Friendly Reminder W/o Stipend Subsection */}
                    <h2 className='italic text-gray-400'>Friendly Reminder W/o Stipend</h2>
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
                                checked={friendlyReminderWithoutStipend.email}
                                onClick={() => handleToggle(setFriendlyReminderWithoutStipend, friendlyReminderWithoutStipend, 'email', 'friendly_reminder_without_stipend')}
                            />
                        </div>
                    </label>
                    <label className='w-full'>
                        <MeteorCallout iconVariant={'primary'} labelText={'Text Notifications'} paragraphText={'We are working on adding text notifications at this time.  Currently we support email only.'} meteorsCount={0}/>

                    </label>
                </div>
            </Section>
        </>
    );
};