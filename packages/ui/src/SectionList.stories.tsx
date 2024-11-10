import { DietaryPreferenceSection } from './components/dietary-preference-section';
import { Meta, StoryObj } from '@storybook/react';
import { SectionList } from './components/section-list';
import { ReminderSection } from './components/reminder-section';
import { NotificationPreferenceSection } from './components/notification-preference-section';

// Import the QuantityComp Default story
import {
  DietaryPreferences,
  Reminder,
  NotificationPreferences,
} from './Section.stories';
import { ProfileSection } from './components/profile-section';

const meta: Meta<typeof SectionList> = {
  title: 'SectionList',
  component: SectionList,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => (
  <SectionList>
    <ProfileSection {...args} />
    <DietaryPreferenceSection {...DietaryPreferences.args} {...args} />
    <ReminderSection {...Reminder.args} {...args} />
    <NotificationPreferenceSection
      {...NotificationPreferences.args}
      {...args}
    />
  </SectionList>
);

Default.args = {};
