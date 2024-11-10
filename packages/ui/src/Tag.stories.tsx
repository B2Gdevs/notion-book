import { Tag } from './components/tag';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Tag> = {
  title: 'Tag',
  component: Tag,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => <Tag {...args} />;

Default.args = {
  onDelete: () => alert('not implemented'),
};
