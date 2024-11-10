import { PaymentButton } from './components/payment-button';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PaymentButton> = {
  title: 'PaymentButton',
  component: PaymentButton,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => <PaymentButton {...args} />;

Default.args = {
  label: 'Add to Cart',
  amount: 1,
  onClick: () => alert('not implemented'),
};

export const NoAmount: Story = (args: any) => <PaymentButton {...args} />;

NoAmount.args = {
  label: 'Add to Cart',
  onClick: () => alert('not implemented'),
};
