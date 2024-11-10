import { DietaryPreferencePanel } from './components/dietary-preference-panel';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DietaryPreferencePanel> = {
  title: 'DietaryPreferencePanel',
  component: DietaryPreferencePanel,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => (
  <DietaryPreferencePanel {...args} />
);

Default.args = {
  diet: {
    name: 'Vegetarian',
    description: 'Description for Vegetarian diet goes here.',
  },
};
