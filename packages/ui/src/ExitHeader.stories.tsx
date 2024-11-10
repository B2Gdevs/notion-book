// Assuming the component is saved as "StepIndicator.tsx"
import { ExitHeader } from './components/exit-header';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ExitHeader> = {
  title: 'ExitHeader',
  component: ExitHeader,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'Chingo Bling',
    backText: 'Back to Restaurants',
    onBack: () => alert('not implemented'),
    onExit: () => alert('not implemented'),
  },
};
