import React from 'react';
import type { Preview } from '@storybook/react';
import 'ui/style';
import StoryLayout from './StoryLayout';

/** @type { import('@storybook/react').Preview } */
const preview: Preview = {
  parameters: {
    layout: 'centered',
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    decorators: [(Story, options) => <Story />],
    backgrounds: {
      default: 'twitter',
      values: [
        {
          name: 'white',
          value: '#ffffff',
        },
        {
          name: 'black',
          value: '#000000',
        },
        {
          name: 'off-white',
          value: '#fef5ed',
        },
      ],
    },
  },
};

export default preview;
