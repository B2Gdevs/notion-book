import { BudgetModal } from './components/budget-modal';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof BudgetModal> = {
  title: 'BudgetModal',
  component: BudgetModal,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => <BudgetModal {...args} />;

Default.args = {
  onExit: () => alert('Exit'),
  onBack: () => alert('Back'),
  onSave: (budgetData: any) => alert(JSON.stringify(budgetData)),
};
