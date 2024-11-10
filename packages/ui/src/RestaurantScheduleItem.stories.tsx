import { RestaurantScheduleItem } from './components/restaurant-schedule-item';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof RestaurantScheduleItem> = {
  title: 'RestaurantScheduleItem',
  component: RestaurantScheduleItem,
  argTypes: {
    day: {
      control: { type: 'text' },
    },
    date: {
      control: { type: 'text' },
    },
    isToday: {
      control: { type: 'boolean' },
    },
    icon: {
      control: { type: 'select' },
      options: ['sun', 'moon'],
    },
    isSelected: {
      control: { type: 'boolean' },
    },
    isDisabled: {
      control: { type: 'boolean' },
    },
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      layout: 'centered',
    },
  },
  args: {},
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    day: 'Mon',
    date: '09/04',
    isSelected: false,
    isToday: false,
    isDisabled: false,
  },
};
