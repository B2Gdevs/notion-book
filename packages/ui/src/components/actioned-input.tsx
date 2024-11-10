'use client'

import React, { useState, useEffect } from 'react';
import { Action } from '../models/actionModels';
import { ActionWrapper } from './action-wrapper';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface ActionedInputProps {
  label: string;
  value: string;
  id: string;
  disabled?: boolean;
  endActions?: Action[];
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  name?: string;
  icon?: any; // Adjusted to accept ReactNode
}

export const ActionedInput: React.FC<ActionedInputProps> = ({
  label,
  value,
  endActions,
  id,
  disabled = false,
  className,
  onChange,
  name,
  icon,
}) => {
  // Initialize local state with the value prop
  const [inputValue, setInputValue] = useState<string>(value);

  // Update local state if the value prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle local changes and call the provided onChange handler if any
  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setInputValue(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <ActionWrapper
      id={id}
      alwaysShowActions={false}
      endActionsContainerStyle="absolute right-0 top-0"
      endActions={endActions}
      className={className}
    >
      <div className="flex items-center gap-2">
        {icon && <span>{icon}</span>}
        <Label className="block text-gray-700 text-sm  mb-2">
          {label}:
        </Label>
        <Input
          type="text"
          value={inputValue} // Use local state for the input value
          disabled={disabled}
          className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
          onChange={handleInputChange} // Use the local change handler
          name={name}
          id={id}
        />
      </div>
    </ActionWrapper>
  );
};