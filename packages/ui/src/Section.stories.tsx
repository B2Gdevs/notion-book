import { DietaryPreferenceSection } from './components/dietary-preference-section';
import { Meta, StoryObj } from '@storybook/react';
import { ReminderSection } from './components/reminder-section';
import { NotificationPreferenceSection } from './components/notification-preference-section';

const meta: Meta<typeof DietaryPreferenceSection> = {
  title: 'Section',
  component: DietaryPreferenceSection,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DietaryPreferences: Story = (args: any) => (
  <DietaryPreferenceSection {...args} />
);

DietaryPreferences.args = {
  diets: [
    {
      name: 'Vegetarian',
      description: 'Description for Vegetarian diet goes here.',
    },
    { name: 'Vegan', description: 'Description for Vegan diet goes here.' },
    {
      name: 'Gluten Free',
      description: 'Description for Gluten Free diet goes here.',
    },
    {
      name: 'Nut Free',
      description: 'Description for Nut Free diet goes here.',
    },
    { name: 'Paleo', description: 'Description for Paleo diet goes here.' },
    {
      name: 'Pescatarian',
      description: 'Description for Pescatarian diet goes here.',
    },
  ],
};

export const Reminder: Story = (args: any) => <ReminderSection {...args} />;

Reminder.args = {};

export const NotificationPreferences: Story = (args: any) => (
  <NotificationPreferenceSection {...args} />
);

NotificationPreferences.args = {};
