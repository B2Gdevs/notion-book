import { ProfileSection } from './components/profile-section';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ProfileSection> = {
  title: 'ProfileSection',
  component: ProfileSection,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => <ProfileSection {...args} />;

Default.args = {};
