import { Avatar } from './components/avatar';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Avatar> = {
  title: 'Avatar',
  component: Avatar,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => <Avatar {...args} />;

Default.args = {
  name: 'John Doe',
  src: 'https://avatars.githubusercontent.com/u/1024025?v=4',
  options: ['logout', 'settings'],
};
