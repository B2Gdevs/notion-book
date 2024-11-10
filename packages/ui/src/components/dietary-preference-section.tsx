import { Diet } from '../models/miscModels';
import { DietaryPreferencePanel } from './dietary-preference-panel';
import { Section } from './section';

interface DietaryPreferenceSectionProps {
  diets: Diet[];
}

export const DietaryPreferenceSection: React.FC<
  DietaryPreferenceSectionProps
> = (props) => {
  return (
    <Section title="Dietary Preferences">
      <div className="grid grid-cols-3 gap-4">
        {props.diets?.map((diet, index) => (
          <DietaryPreferencePanel key={index} diet={diet} />
        ))}
      </div>
    </Section>
  );
};
