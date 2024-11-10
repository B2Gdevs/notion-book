import { Meta, StoryObj } from '@storybook/react';
import { RestaurantScheduleList } from './components/restaurant-schedule-list';

const meta: Meta<typeof RestaurantScheduleList> = {
  title: 'RestaurantScheduleList',
  component: RestaurantScheduleList,
  argTypes: {
    // If you want to add controls for your component, you can list them here.
    // For instance:
    // currentDay: {
    //   options: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    //   control: { type: "select" }
    // }
  },
  parameters: {
    backgrounds: {
      default: 'dark',
      layout: 'centered',
    },
  },
  args: {
    // Any default args can be listed here.
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Provide default args for the RestaurantScheduleList component.
    // Example (make sure to adjust as per your component's props):
    // currentDay: 'Wed',
  },
};
