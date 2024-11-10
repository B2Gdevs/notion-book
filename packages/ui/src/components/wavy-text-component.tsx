'use client'

import { motion } from "framer-motion";

interface WavyTextProps {
    title: string;
    subTitle: string;
}

export const WavyText: React.FC<WavyTextProps> = ({ title, subTitle }) => {
    const letters = Array.from(subTitle);

    return (
        <div className="p-4 text-left w-full rounded-lg ">
            <div className="font-righteous text-lg mb-2 border-b-2 border-black">{title}</div>
            <div className="flex justify-left font-sans">
                {letters.map((letter, index) => (
                    <motion.span
                        key={index}
                        initial={{ opacity: 1 }}
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{
                            duration: 1,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatDelay: 2,
                            delay: index * 0.1,
                        }}
                        className="inline-block"
                    >
                        {letter}
                    </motion.span>
                ))}
            </div>
        </div>
    );
};