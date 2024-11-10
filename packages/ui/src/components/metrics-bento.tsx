"use client";
import React from "react";
import { motion } from "framer-motion";
import { BentoGrid, BentoGridItem } from "./aceternity-ui/bento-grid";
import { cn } from "..";

interface MetricsBentoProps {
  className?: string;
  items: {
    title: string;
    description: React.ReactNode;
    header?: React.ReactNode;
    className?: string;
    icon?: React.ReactNode;
  }[];
}

export function MetricsBento({ items, className }: MetricsBentoProps) {

  return (
    <BentoGrid className={cn("max-w-4xl mx-auto md:grid-cols-4 md:auto-rows-[20rem]", className)}>
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={(item.header)}
          className={cn("[&>p:text-lg] md:col-span-1", item.className)}
          icon={item.icon}
        />
      ))}
    </BentoGrid>
  );
}


interface SkeletonFourProps {
  firstCardText: string;
  secondCardText: string;
  thirdCardText: string;
  firstCardSubText?: string;
  secondCardSubText?: string;
  thirdCardSubText?: string;
  firstCardButtonText?: string;
  secondCardButtonText?: string;
  thirdCardButtonText?: string;
  firstCardImage?: React.ReactNode;
  secondCardImage?: React.ReactNode;
  thirdCardImage?: React.ReactNode;
  onClick?: () => void;
}

export const SkeletonFour: React.FC<SkeletonFourProps> = ({ firstCardText, secondCardText, thirdCardText, firstCardButtonText, secondCardButtonText, thirdCardButtonText, firstCardSubText, secondCardSubText, thirdCardSubText }) => {
  
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
      className="flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full font-righteous text-xl text-primary-almost-black/80 w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center text-center"
      >
        <span className='flex justify-center items-center gap-1'>{firstCardText}</span>
        <p className="text-3xl text-center  text-primary-spinach-green mt-4">
          {firstCardSubText}
        </p>
        {firstCardButtonText && <p className="border border-red-500 bg-red-100 dark:bg-red-900/20 text-red-600 text-xs rounded-full px-2 py-0.5 mt-4">
          {firstCardButtonText}
        </p>}
      </motion.div>
      <motion.div className="h-full font-righteous text-xl text-primary-almost-black/80 relative z-20 w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center text-center">
        {secondCardText}
        <p className="text-3xl text-center  text-primary-spinach-green mt-4">
          {secondCardSubText}
        </p>
        {secondCardButtonText && <p className="border border-green-500 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs rounded-full px-2 py-0.5 mt-4">
          {secondCardButtonText}
        </p>}
      </motion.div>
      <motion.div
        variants={second}
        className="h-full w-1/3 font-righteous text-xl text-primary-almost-black/80 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center text-center"
      >
        {thirdCardText}
        <p className="text-3xl  text-primary-spinach-green mt-4">
          {thirdCardSubText}
        </p>
        {thirdCardButtonText && <p className="border border-orange-500 bg-orange-100 dark:bg-orange-900/20 text-orange-600 text-xs rounded-full px-2 py-0.5 mt-4">
          {thirdCardButtonText}
        </p>}
      </motion.div>
    </motion.div>
  );
};

