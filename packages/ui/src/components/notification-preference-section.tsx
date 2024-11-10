'use client';

import React, { useState } from 'react';
import { Checkbox } from './checkbox';
import { Section } from './section';
import { Separator } from './ui/separator';

// NotificationPreference Model Interface
interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  email: boolean;
  phone: boolean;
}

// Sample data based on your provided list
const notifications: NotificationPreference[] = [
  {
    id: 'successfulDelivery',
    title: 'Successful Delivery',
    description: 'Receive a notification for every successful delivery',
    email: false,
    phone: true,
  },
  {
    id: 'substitutionRequests',
    title: 'Substitution Requests',
    description:
      'Receive a notification for every substitution or cancelled order',
    email: false,
    phone: true,
  },
  {
    id: 'unsuccessfulPayment',
    title: 'Unsuccessful Payment',
    description: 'Receive a notification for every unsuccessful payment',
    email: false,
    phone: true,
  },
  {
    id: 'friendlyReminder',
    title: 'Friendly Reminder',
    description: 'Receive a reminder notification',
    email: false,
    phone: true,
  },
  {
    id: 'purchaseReceipt',
    title: 'Purchase Receipt',
    description: 'Receive a notification for every purchase receipt',
    email: false,
    phone: true,
  },
];

interface NotificationPreferenceSectionProps {
  className?: string;
  onChange?: (preferences: Record<string, NotificationPreference>) => void;
}

export const NotificationPreferenceSection: React.FC<
  NotificationPreferenceSectionProps
> = (props) => {
  const initialPreferences = notifications.reduce((acc, notif) => {
    acc[notif.id] = { ...notif };
    return acc;
  }, {} as Record<string, NotificationPreference>);

  const [preferences, setPreferences] = useState(initialPreferences);

  const toggleCheckbox = (
    notificationId: string,
    medium: 'email' | 'phone',
  ) => {
    setPreferences((prev) => ({
      ...prev,
      [notificationId]: {
        ...prev[notificationId],
        [medium]: !prev[notificationId][medium],
      },
    }));

    props.onChange?.(preferences);
  };

  return (
    <Section title="Notification Alerts Preferences">
      <div className="w-full h-full p-6 bg-slate-50 rounded-2xl">
        {notifications?.map(({ id, title, description }) => (
          <div key={id} className="flex flex-col mb-5">
            <div className="flex justify-between items-center gap-x-10">
              <div>
                <span className="text-primary-almost-black font-sans block mb-2">
                  {title}
                </span>
                <span className="text-primary-almost-black opacity-70 font-sans text-xs">
                  {description}
                </span>
              </div>

              <div className="flex gap-x-4 items-center">
                <div className="flex items-center">
                  <Checkbox
                    checked={preferences[id]?.email || false}
                    onClick={() => toggleCheckbox(id, 'email')}
                  />
                  <span className="ml-2">Email</span>
                </div>
                <div className="flex items-center">
                  <Checkbox
                    checked={preferences[id]?.phone || false}
                    onClick={() => toggleCheckbox(id, 'phone')}
                  />
                  <span className="ml-2">Phone</span>
                </div>
              </div>
            </div>
            <Separator />
          </div>
        ))}
      </div>
    </Section>
  );
};
