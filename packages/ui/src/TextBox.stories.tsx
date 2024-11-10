// Assuming the component is saved as "StepIndicator.tsx"
import { TextBox } from './components/textbox';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof TextBox> = {
  title: 'TextBox',
  component: TextBox,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: 'yolo',
    maxChars: 100,
    headerText: 'Special Requests?',
  },
};
