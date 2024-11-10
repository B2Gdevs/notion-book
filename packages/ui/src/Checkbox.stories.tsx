// Checkbox.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './components/checkbox'; // Adjust path to where the Checkbox definition is

const meta: Meta = {
  title: 'Checkbox',
  component: Checkbox,
  parameters: {
    backgrounds: {
      default: 'dark',
      layout: 'centered',
    },
  },
  args: {},
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => <Checkbox {...args} />;
Default.args = {
  checked: true,
  currencyValue: 10,
  text: 'This is a checkbox',
};

export const NegativeValue: Story = {
  args: {
    checked: true,
    currencyValue: -5,
  },
};

export const WithoutValue: Story = {
  args: {
    checked: true,
  },
};
