'use client';

import { cn } from "../../lib/utils";
import { motion } from "framer-motion";
import React from "react";

interface SkeletonSwingProps {
  leftComponent: React.ReactNode;
  centerComponent: React.ReactNode;
  rightComponent: React.ReactNode;
  leftClassName?: string;
  centerClassName?: string;
  rightClassName?: string;
  className?: string;
}

export const SkeletonSwing: React.FC<SkeletonSwingProps> = ({
  leftComponent,
  centerComponent,
  rightComponent,
  leftClassName = "",
  centerClassName = "",
  rightClassName = "",
  className = "",
}) => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className={cn("flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2", className)}
    >
      <motion.div
        variants={first}
        className={cn("h-full w-1/3 flex flex-col items-center justify-center", leftClassName)}
      >
        {leftComponent}
      </motion.div>
      <div className={cn("h-full w-1/3 flex flex-col items-center justify-center", centerClassName)}>
        {centerComponent}
      </div>
      <motion.div
        variants={second}
        className={cn("h-full w-1/3 flex flex-col items-center justify-center", rightClassName)}
      >
        {rightComponent}
      </motion.div>
    </motion.div>
  );
};