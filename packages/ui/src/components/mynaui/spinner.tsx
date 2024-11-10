import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2Icon, LoaderIcon } from 'lucide-react';

interface SpinnerProps {
  size?: string;
  color?: string;
}

interface SizeProps {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

interface FillProps {
  slate: string;
  blue: string;
  red: string;
  green: string;
  white: string;
}

interface StrokeProps {
  slate: string;
  blue: string;
  red: string;
  green: string;
  white: string;
}

const sizesClasses: SizeProps = {
  xs: 'w-4 h-4',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-10 h-10'
};

const fillClasses = {
  slate: 'fill-slate-800',
  blue: 'fill-blue-500',
  red: 'fill-red-500',
  green: 'fill-emerald-500',
  white: 'fill-white'
} as FillProps;

const strokeClasses = {
  slate: 'stroke-slate-500',
  blue: 'stroke-blue-500',
  red: 'stroke-red-500',
  green: 'stroke-emerald-500',
  white: 'stroke-white'
} as StrokeProps;

export const SpokeSpinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'slate'
}) => {
  return (
    <div aria-label="Loading..." role="status">
      <LoaderIcon
        className={cn(
          'animate-spin',
          sizesClasses[size as keyof SizeProps],
          strokeClasses[color as keyof StrokeProps]
        )}
      />
    </div>
  );
};

export const RoundSpinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'slate'
}) => {
  return (
    <div aria-label="Loading..." role="status">
      <Loader2Icon
        className={cn(
          'animate-spin',
          sizesClasses[size as keyof SizeProps],
          fillClasses[color as keyof FillProps]
        )}
        viewBox="3 3 18 18"
      />
    </div>
  );
};