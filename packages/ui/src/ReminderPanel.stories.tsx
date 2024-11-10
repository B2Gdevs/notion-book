import { ReminderPanel } from './components/reminder-panel';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ReminderPanel> = {
  title: 'ReminderPanel',
  component: ReminderPanel,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => <ReminderPanel {...args} />;

Default.args = {};
