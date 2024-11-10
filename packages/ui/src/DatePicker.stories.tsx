import { DatePicker } from './components/date-picker';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DatePicker> = {
  title: 'DatePicker',
  component: DatePicker,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => <DatePicker {...args} />;

Default.args = {};
