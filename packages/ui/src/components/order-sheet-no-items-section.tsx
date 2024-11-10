'use client'

import { motion } from 'framer-motion'; // Make sure to have framer-motion installed
import React, { useEffect, useState } from 'react';
import BowlIcon from '../icons/BowlIcon';
import { BagLoader } from './bag-loader';

interface OrderSheetNoItemsSectionProps {
  hasUserOrderedToday: boolean;
}

export const OrderSheetNoItemsSection: React.FC<OrderSheetNoItemsSectionProps> = ({
  hasUserOrderedToday,
}) => {
  const [isLoading, setIsLoading] = useState(true);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // 4 seconds

    return () => clearTimeout(timer); // Clean up on component unmount
  }, []);

  // Render nothing if the condition doesn't match
  if (hasUserOrderedToday) return null;

  return (
    <motion.div
      className='flex flex-col justify-center items-center gap-6 p-6 m-4 mt-12'
      initial='hidden'
      animate='visible'
      variants={fadeIn}
    >
      {isLoading ? (
        <>
        <BagLoader/>
        </>
      ) : (
        <>
          <BowlIcon />
          <span className='flex font-righteous justify-center items-center text-center  text-xl'>
            No items added yet.
          </span>
        </>
      )}
    </motion.div>
  );
};
