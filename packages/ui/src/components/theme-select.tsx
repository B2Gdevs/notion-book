'use client'

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '..';

export const ThemeSelect: React.FC<{}> = () => {
  const [theme, setTheme] = useState('default');

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <Select value={theme} onValueChange={toggleTheme}>
      <SelectTrigger>{theme}</SelectTrigger>
      <SelectContent>
        <SelectItem value="default">Default</SelectItem>
        <SelectItem value="sprinklr">Sprinklr</SelectItem>
      </SelectContent>
    </Select>
  );
};