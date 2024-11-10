import React from 'react';

interface SlideToCompleteProps {
    onComplete: () => void; // Callback function when the slide is completed
    sliderColor?: string; // Add sliderColor prop
    thumbColor?: string; // Add thumbColor prop
    thumbBorderColor?: string; // Add thumbBorderColor prop
}

const SlideToComplete: React.FC<SlideToCompleteProps> = ({ onComplete, sliderColor = '#c9e0b4', thumbColor = '#FFBB5C', thumbBorderColor = '#000000' }) => {
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(event.target.value);
        if (value === 100) { // Assuming the slider max value is 100
            onComplete();
        }
    };

    return (
        <>
            <style>
                {`
                .slider {
                    background: ${sliderColor};
                    -webkit-appearance: none;
                    appearance: none;
                    width: 100%;
                    height: 8px;
                }
                .slider::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background-color: ${thumbColor};
                    border: 2px solid ${thumbBorderColor};
                }
                .slider::-moz-range-thumb {
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background-color: ${thumbColor};
                    border: 2px solid ${thumbBorderColor};
                }
                .slider::-ms-thumb {
                    height: 24px;
                    width: 24px;
                    border-radius: 50%;
                    background-color: ${thumbColor};
                    border: 2px solid ${thumbBorderColor};
                }
                `}
            </style>
            <input
                type="range"
                min="0"
                max="100"
                defaultValue="0"
                onChange={handleSliderChange}
                className="slider"
            />
        </>
    );
};

export default SlideToComplete;