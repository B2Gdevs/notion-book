import { SearchBar } from './components/search-component';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SearchBar> = {
  title: 'SearchBar',
  component: SearchBar,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => <SearchBar {...args} />;

Default.args = {};
