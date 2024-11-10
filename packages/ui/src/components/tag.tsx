import { FC } from 'react';
import { Badge } from './ui/badge';

/**
 * This is a tag that will be used to show whatever is passed in as a tag and the tag can be deleted by clicking on the x
 *
 */
export const Tag: FC = () => {
  return (
    <div>
      <Badge />
    </div>
  );
};
