// EndComponent.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { QuantityComp } from './components/quantity-comp'; // Adjust path accordingly

const meta: Meta = {
  title: 'QuantityComp',
  component: QuantityComp,
  argTypes: {
    quantity: {
      control: {
        type: 'number',
        min: 0,
        max: 100,
        step: 1,
      },
      defaultValue: 1,
    },
  },
  parameters: {
    backgrounds: {
      default: 'light',
      layout: 'centered',
    },
  },
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => <QuantityComp {...args} />;

Default.args = {
  quantity: 2,
  useTrashIcon: false,
};

export const WithTrashIcon: Story = (args: any) => <QuantityComp {...args} />;

WithTrashIcon.args = {
  quantity: 2,
  useTrashIcon: true,
};
