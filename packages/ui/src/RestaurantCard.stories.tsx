import { RestaurantCard } from './components/restaurant-card';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof RestaurantCard> = {
  title: 'RestaurantCard',
  component: RestaurantCard,
  argTypes: {
    variant: {
      options: ['lime', 'corn', 'peach'],
      control: { type: 'select' },
    },
    selected: {
      control: { type: 'boolean' },
    },
    brandImage: {
      control: { type: 'text' },
    },
    foodCategory: {
      control: { type: 'text' },
    },
    dropOffTimeWindow: {
      control: { type: 'text' },
    },
    orderCutOffTime: {
      control: { type: 'text' },
    },
    title: {
      control: { type: 'text' },
    },
    description: {
      control: { type: 'text' },
    },
    lastMeal: {
      control: { type: 'text' },
    },
    establishedDate: {
      control: { type: 'text' },
    },
    favoriteDish: {
      control: { type: 'text' },
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

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    variant: 'lime',
    selected: false,
    brandImage:
      'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
    foodCategory: 'Mediterranean',
    dropOffTimeWindow: '12:00pm - 12:30pm',
    orderCutOffTime: '10:30am',
    title: 'Pita Fusion',
    description: 'Pita Fusion provides customers an innovative twist...',
    lastMeal: 'Hummus Party',
    establishedDate: '2018',
    favoriteDish: 'Chingo Bling Pita',
  },
};
