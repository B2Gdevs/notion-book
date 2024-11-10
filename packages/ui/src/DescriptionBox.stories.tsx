// DescriptionBox.stories.tsx
import { StoryObj, Meta } from '@storybook/react';
import { ItemDescriptionBox } from './components/description-box';

const meta: Meta<typeof ItemDescriptionBox> = {
  title: 'DescriptionBox',
  component: ItemDescriptionBox,
  argTypes: {
    imageSrc: {
      control: { type: 'text' },
    },
    dietaryClassifications: {
      options: ['vegetarian', 'nutFree', 'dairyFree'],
      control: { type: 'multi-select' },
    },
  },
} as Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => <ItemDescriptionBox {...args} />;

Default.args = {
// TODO: add sample data
};
