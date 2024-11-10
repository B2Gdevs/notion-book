'use client'

import { motion } from 'framer-motion';
import { FC, ReactNode } from 'react';
import { cn } from '..';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export const PageWrapper: FC<PageWrapperProps> = ({
  children,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: -20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 20, x: -20 }}
      className={cn(
        'mx-0 lg:mx-auto lg:w-fit lg:w-full lg:max-w-7xl bg-primary-off-white sm:container px-0 md:px-0',
        className,
      )}
    >
      {children}
    </motion.div>
  );
};