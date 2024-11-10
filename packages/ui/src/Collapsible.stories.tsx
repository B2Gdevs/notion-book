// Collapsible.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import { Collapsible } from './components/collapsible'; // Adjust path accordingly
import { Default as CheckboxDefault } from './Checkbox.stories';
import { Checkbox } from './components/checkbox'; // Adjust this path to where Checkbox component is defined
import { QuantityComp } from './components/quantity-comp'; // Adjust this path to where Checkbox component is defined

// Import the QuantityComp Default story
import { Default as QuantityCompDefault } from './QuantityComp.stories';
import { Default as RequirementTagDefault } from './RequirementTag.stories';
import { RequirementTag } from './components/requirement-tag';

const meta: Meta = {
  title: 'Collapsible',
  component: Collapsible,
  parameters: {
    backgrounds: {
      default: 'dark',
      layout: 'centered',
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = (args: any) => (
  <Collapsible {...args}>
    <Checkbox {...CheckboxDefault.args} />{' '}
    {/* Directly use the Checkbox component */}
    <Checkbox {...CheckboxDefault.args} />{' '}
    {/* Directly use the Checkbox component */}
  </Collapsible>
);

Default.args = {
  stepHeaderProps: {
    stepNumber: 1,
    text: 'Step One',
    options: ['Option A', 'Option B'],
    secondaryText: 'Secondary Text',
  },
  content: 'Content for Step One',
};

export const WithEndComponent: Story = (args: any) => (
  <Collapsible
    {...args}
    endComponent={<QuantityComp {...QuantityCompDefault.args} />}
  >
    <Checkbox {...CheckboxDefault.args} />{' '}
    {/* Directly use the Checkbox component */}
    <Checkbox {...CheckboxDefault.args} />{' '}
    {/* Directly use the Checkbox component */}
  </Collapsible>
);

WithEndComponent.args = {
  ...Default.args, // Use the same default arguments
};

export const WithRequirementTagEndComponent: Story = (args: any) => (
  <Collapsible
    {...args}
    endComponent={<RequirementTag {...RequirementTagDefault.args} />}
  >
    <Checkbox {...CheckboxDefault.args} />{' '}
    {/* Directly use the Checkbox component */}
    <Checkbox {...CheckboxDefault.args} />{' '}
    {/* Directly use the Checkbox component */}
  </Collapsible>
);

WithRequirementTagEndComponent.args = {
  ...Default.args, // Use the same default arguments
};

export const WithImage: Story = (args: any) => (
  <Collapsible
    {...args}
    endComponent={<RequirementTag {...RequirementTagDefault.args} />}
  >
    <Checkbox {...CheckboxDefault.args} />{' '}
    {/* Directly use the Checkbox component */}
    <Checkbox {...CheckboxDefault.args} />{' '}
    {/* Directly use the Checkbox component */}
  </Collapsible>
);

WithImage.args = {
  ...Default.args, // Use the same default arguments,
  imageSrc:
    'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
};
