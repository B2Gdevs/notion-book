import { motion } from "framer-motion";

interface TipSelectionProps {
    onTipSelect: (tip: number) => void;
    selectedTip: number;
    tips?: number[];
    disabled?: boolean;
}

export const TipSelection: React.FC<TipSelectionProps> = ({ onTipSelect, selectedTip, tips = [1, 2, 3], disabled = false }) => {
    // Animation for each button with staggered effect
    const buttonAnimation = (index: number) => ({
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { delay: index * 0.1, duration: 0.5 } // Staggered effect based on index
        },
    });

    return (
        <div className="flex-col">
            <div className="text-xs text-secondary-pink-salmon top-0 mb-2  p-2 rounded-md">
                Note: Tips will be available to add in the future
            </div>
            <div className={`flex flex-col space-y-2 ${disabled ? "opacity-50" : ""}`}>

                <div className="flex space-x-2">
                    {tips.map((tip, index) => (
                        <motion.button
                            initial="hidden"
                            animate="visible"
                            custom={index} // Pass index as custom prop
                            variants={buttonAnimation(index)} // Apply the animation function with index
                            key={tip}
                            className={`w-10 h-10 rounded-full border-2 border-primary-spinach-green flex items-center justify-center text-secondary-peach-orange ${selectedTip === tip ? 'bg-primary-spinach-green' : ''} ${disabled ? "cursor-not-allowed" : ""}`}
                            onClick={() => !disabled && onTipSelect(selectedTip === tip ? 0 : tip)}
                            disabled={disabled}
                        >
                            ${tip}
                        </motion.button>
                    ))}
                </div>
            </div>
        </div>
    );
};