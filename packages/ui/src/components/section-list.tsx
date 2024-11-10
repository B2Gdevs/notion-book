import { cn } from '../lib/utils';
import React from 'react';

interface SectionListProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const SectionList: React.FC<SectionListProps> = ({
  title,
  children,
  className,
}) => {
  return (
    <div>
      {title && (
        <h2 className="font-righteous mb-2 border-b-2 border-gray-300">
          {title}
        </h2>
      )}
      <div className={cn('mt-4 w-full', className)}>{children}</div>
    </div>
  );
};
