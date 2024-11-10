import React from 'react';
import { Popup } from './popup'; // Assume the Popup component is imported like this

export interface AvatarProps {
  name: string;
  src: string;
  options?: string[];
  onOptionClick?: (option: string) => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  src,
  options,
  onOptionClick,
}) => {
  return (
    <Popup
      options={options || []}
      onOptionClick={onOptionClick}
      className={`bg-primary-off-white`}
    >
      <div className="flex items-center justify-center gap-x-2">
        <img className="w-12 h-12 rounded-full" src={src} alt={name} />
        <div className="font-sans leading-tight text-primary-spinach-green">
          {name}
        </div>
      </div>
    </Popup>
  );
};
