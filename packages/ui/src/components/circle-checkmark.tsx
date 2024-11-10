'use client';
import { cn } from '../lib/utils';
import { useEffect, useState } from 'react';

interface CircleCheckmarkProps {
  checked: boolean;
  onChange?: () => void;
  disabled?: boolean;
  className?: string;
  isConnected?: boolean;
  isBrand?: boolean;
}

export const CircleCheckmark: React.FC<CircleCheckmarkProps> = ({
  checked,
  onChange,
  disabled = false,
  className,
  isConnected,
  isBrand,
}: CircleCheckmarkProps) => {
  const [isActive, setIsActive] = useState(checked ?? false);

  useEffect(() => {
    setIsActive(checked);
  }, [checked]);

  const handleClick = () => {
    if (disabled) return; // Ignore clicks when disabled
    setIsActive(!isActive);
    onChange?.();
  };
  
  return (
    <div
      className={cn(
        `relative w-8 h-8 ${
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        }`,
        className,
      )}
      onClick={handleClick}
    >
      {/* Circle */}
      <div
        className={`w-8 h-8 rounded-full 
        ${
          isConnected ? 'bg-[#43B549]' : isBrand ? 'bg-gray-300' : isActive ? 'bg-primary-spinach-green' : 'border border-gray-300'
        }`}
      ></div>

      {/* Checkmark */}
      {isActive && (
        <div className="absolute top-1 right-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
