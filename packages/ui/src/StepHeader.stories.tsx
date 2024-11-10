// Assuming the component is saved as "StepIndicator.tsx"
import { StepHeader } from './components/step-header';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof StepHeader> = {
  title: 'StepHeader',
  component: StepHeader,
  argTypes: {
    step: {
      control: { type: 'number', min: 1 },
    },
    text: {
      control: { type: 'text' },
    },
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      layout: 'centered',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    step: '2',
    text: 'This is step two',
    options: ['yolo', 'swag'],
  },
};

export const WithSecondaryText: Story = {
  args: {
    text: 'This is step two',
    options: ['yolo', 'swag'],
    secondaryText: 'Secondary Text',
  },
};

export const WithoutStep: Story = {
  args: {
    text: 'This is step two',
    options: ['yolo', 'swag'],
  },
};

export const WithoutOptions: Story = {
  args: {
    text: 'This is step two',
  },
};
