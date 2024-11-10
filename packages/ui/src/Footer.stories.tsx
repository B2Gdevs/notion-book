import { Footer } from './components/footer';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Footer> = {
  title: 'Footer',
  component: Footer,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => <Footer {...args} />;

Default.args = {};
