'use client'

import React, { FC, useEffect, useRef, useState } from 'react';
import MagnifyGlassIcon from '../icons/MagnifyGlassIcon';
import { Tooltip, TooltipTrigger, TooltipContent } from './ui/tooltip';

interface SearchBarProps {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string; // new prop for additional classes
}

export const SearchBar: FC<SearchBarProps> = ({
  placeholder = 'Search',
  value,
  onChange,
  className = '',
}) => {
  const isMac = true;
  const shortcutKey = isMac ? '⌘/' : 'Enter';
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    onChange(newQuery);
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Tooltip open={isFocused && !value}>
      <TooltipTrigger>
        <div
          className={`w-full h-full px-2 py-2 rounded-lg flex items-center gap-2 border border-gray-300 bg-gradient-to-b from-white to-primary-off-white ${className} ${isFocused ? 'border-blue-500 ring-2 ring-blue-200' : ''}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <div className="flex-shrink-0">
            <MagnifyGlassIcon />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            className="w-full flex-grow bg-transparent outline-none text-primary-almost-black text-opacity-80 text-sm font-righteous placeholder:text-primary-almost-black-light"
            placeholder={placeholder}
          />
          <div className="flex-shrink-0 text-zinc-900 text-opacity-20">
            {shortcutKey}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        Start typing to search
      </TooltipContent>
    </Tooltip>
  );
};