'use client';
import { cn } from '../lib/utils';
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  hideChevron?: boolean;
  expanded?: boolean;
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  className,
  hideChevron = false,
  expanded = false,
}) => {
  const [isOpen, setIsOpen] = useState(expanded);
  const [isHovered, setIsHovered] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div className={cn('mb-4 bg-slate-50 rounded-md p-6', className)}>
      <div
        className="flex items-center justify-between cursor-pointer"
        onClick={toggleOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {title && (
          <h2
            className={cn(
              "font-righteous mb-2",
              isHovered
                ? 'text-secondary-peach-orange'
                : 'text-primary-almost-black',
            )}
          >
            {title}
          </h2>
        )}
        {!hideChevron &&
          (isOpen ? (
            <ChevronUp
              size={24}
              className={
                isHovered
                  ? 'text-secondary-peach-orange'
                  : 'text-primary-almost-black'
              }
            />
          ) : (
            <ChevronDown
              size={24}
              className={
                isHovered
                  ? 'text-secondary-peach-orange'
                  : 'text-primary-almost-black'
              }
            />
          ))}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
