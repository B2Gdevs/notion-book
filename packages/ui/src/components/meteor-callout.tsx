import React from 'react';
import { ColorfullIcon, cn } from "..";
import { Meteors } from "./aceternity-ui/meteors";

interface MeteorCalloutProps {
  glowIntensity?: 'none' | 'low' | 'high';
  iconVariant: 'primary' | 'secondary' | 'colorless';
  labelText: string;
  paragraphText: string;
  meteorsCount: number;
  className?: string;
}

export const MeteorCallout: React.FC<MeteorCalloutProps> = ({
  glowIntensity = 'high',
  iconVariant,
  labelText,
  paragraphText,
  meteorsCount,
  className,
}) => {
  const glowClasses = cn({
    'blur-none': glowIntensity === 'none',
    'blur-sm': glowIntensity === 'low',
    'blur-3xl': glowIntensity === 'high',
  });

  return (
    <div className={cn("", className)}>
      <div className="w-full relative max-w-xs">
        <div className={cn("absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full", glowClasses)} />
        <div className="relative shadow-xl bg-white border border-gray-800 px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
          <div className="h-5 w-5 flex items-center mb-4 border-gray-500">
            <ColorfullIcon variant={iconVariant}/>
          </div>

          <h1 className=" text-xl text-black mb-4 relative z-50">
            {labelText}
          </h1>

          <p className="font-normal text-base text-slate-500 mb-4 relative z-50">
            {paragraphText}
          </p>

          <Meteors number={meteorsCount} />
        </div>
      </div>
    </div>
  );
};