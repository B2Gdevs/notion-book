// EndComponent.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { BudgetDisplay } from './components/budget-display'; // Adjust path accordingly

const meta: Meta = {
  title: 'BudgetDisplay',
  component: BudgetDisplay,
  argTypes: {},
  parameters: {},
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => <BudgetDisplay {...args} />;

Default.args = {
  budget: {
    name: 'My Budget',
    amount: 1,
    type: 'recurring',
    frequency: 'daily',
    start_date: '2021-08-01',
    end_date: '2021-08-31',
  },
  layout: 'vertical',
};
