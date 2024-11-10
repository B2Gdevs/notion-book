// Assuming the component is saved as "SideBar.tsx"
import { SideBar } from './components/side-bar';
import { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'SideBar',
  component: SideBar,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => <SideBar {...args} />;
Default.args = {
  categories: [
    {
      name: 'Home',
      links: [
        { name: 'Orders', href: '/link1', active: true },
        { name: 'Employees', href: '/link2' },
        { name: 'Reporting', href: '/link3' },
      ],
    },
    {
      name: 'Category 2',
      links: [
        { name: 'Link A', href: '/linkA' },
        { name: 'Link B', href: '/linkB', active: true },
      ],
    },
  ],
  standaloneLinks: [
    { name: 'Settings', href: '/settings' },
    { name: 'Logout', href: '/logout' },
  ],
};

export const WithProfile: Story = (args: any) => <SideBar {...args} />;
WithProfile.args = {
  categories: [
    {
      name: 'Home',
      links: [
        { name: 'Orders', href: '/link1', active: true },
        { name: 'Employees', href: '/link2' },
        { name: 'Reporting', href: '/link3' },
      ],
    },
    {
      name: 'Category 2',
      links: [
        { name: 'Link A', href: '/linkA' },
        { name: 'Link B', href: '/linkB', active: true },
      ],
    },
  ],
  standaloneLinks: [
    { name: 'Settings', href: '/settings' },
    { name: 'Logout', href: '/logout' },
  ],
  profile: {
    name: 'John Doe',
    src: 'https://avatars.githubusercontent.com/u/1024025?v=4',
  },
};
