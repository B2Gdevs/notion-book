import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export const ShareLinkError = () => {
    const variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 2, yoyo: Infinity } },
    };

    return (
        <motion.div 
            className='flex flex-col justify-center items-center p-4 bg-gray-900 text-white min-h-screen'
            initial="hidden"
            animate="visible"
            variants={variants}
        >
            <motion.div 
                className='mb-4'
                animate={{ rotate: 360 }}
                transition={{ duration: 2, loop: Infinity, ease: "linear" }}
            >
                <AlertTriangle size={48} color='red' />
            </motion.div>
            <motion.span 
                className='text-2xl mb-2'
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, loop: Infinity, ease: "easeInOut" }}
            >
                Error: Unable to fetch share link details or share link not found.
            </motion.span>
            <motion.span 
                className='text-lg'
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, loop: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
                Please contact your admin or Colorfull at <span className='underline text-blue-500'>help@colorfull.ai</span>
            </motion.span>
        </motion.div>
    )
}