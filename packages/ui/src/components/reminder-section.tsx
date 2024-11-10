import { FC } from 'react';
import { ReminderPanel } from './reminder-panel';
import { Section } from './section';

export const ReminderSection: FC = () => {
  return (
    <Section>
      <ReminderPanel />
    </Section>
  );
};
