import { Meta, StoryObj } from '@storybook/react';
import { RequirementTag } from './components/requirement-tag';

const meta: Meta = {
  title: 'RequirementTag',
  component: RequirementTag,
  args: {
    label: 'Pick 1',
    type: 'required',
  },
  argTypes: {
    type: {
      options: ['optional', 'required'],
      control: { type: 'select' },
    },
  },
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => <RequirementTag {...args} />;
Default.args = {
  label: 'Pick 1',
  type: 'required',
};

export const Optional: Story = (args: any) => <RequirementTag {...args} />;
Optional.args = {
  label: 'Pick 1',
  type: 'optional',
};
