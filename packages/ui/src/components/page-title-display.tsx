'use client'

import { useEffect, useState } from 'react';
import { cn } from '..';

interface PageTitleDisplayProps {
  additionalText?: string;
  additionalTextClassName?: string;
  overrideTitle?: string;
  className?: string;
  separator?: boolean;
  separatorCharacter?: string;
  separatorClassName?: string;
}

export const PageTitleDisplay: React.FC<PageTitleDisplayProps> = ({
  additionalText,
  additionalTextClassName = 'text-secondary-pink-salmon',
  overrideTitle,
  className = 'w-full justify-between items-center p-5 border-b-2 border-primary-almost-black',
  separator = true,
  separatorCharacter = '/',
  separatorClassName = 'mx-2', // Default margin for separator
}) => {
  const [pageTitle, setPageTitle] = useState('');

  useEffect(() => {
    if (overrideTitle) {
      setPageTitle(overrideTitle); // Use the override title if provided
      return;
    }

    const updateTitle = () => {
      const pathSegments = window.location.pathname.split('/');
      const lastSegment = pathSegments[pathSegments.length - 1];
      const title = lastSegment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setPageTitle(title);
    };

    if (typeof window !== 'undefined') {
      updateTitle();
      window.addEventListener('popstate', updateTitle);
      return () => window.removeEventListener('popstate', updateTitle);
    }
  }, [overrideTitle]); // Added overrideTitle as a dependency

  return (
    <div className={cn(className)}>
      <span className='text-2xl text-primary-spinach-green font-righteous'>
        {pageTitle} {separator && additionalText ? <span className={separatorClassName}>{separatorCharacter}</span> : ''} {additionalText ? <span className={additionalTextClassName}>{additionalText}</span> : ''}
      </span>
    </div>
  );
};