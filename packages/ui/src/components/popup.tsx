'use client';

import React, { useState, useEffect } from 'react';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover'; // Import the base Popover component

interface PopupProps {
  className?: string;
  options?: string[];
  onOptionClick?: (option: string) => void;
  children: React.ReactNode;
}

export const Popup: React.FC<PopupProps> = ({
  className,
  options = [],
  onOptionClick,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !event
          .composedPath()
          .includes(document.getElementById('popover-content') as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: string) => {
    setIsOpen(false);
    if (onOptionClick) {
      onOptionClick(option);
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
        </PopoverTrigger>
        {isOpen && options.length > 0 && (
          <PopoverContent id="popover-content" className={`${className}`}>
            <div className={`flex flex-col`}>
              {options?.map((option, index) => (
                <div
                  key={index}
                  className="w-full rounded-lg text-left mt-1 first:mt-0 cursor-pointer hover:bg-primary-almost-black/5 p-2 text-primary-spinach-green hover:text-secondary-peach-orange transition-colors duration-300"
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </PopoverContent>
        )}
      </Popover>
    </>
  );
};
