import React, { useState, useEffect } from 'react';
import { TitleComponent, cn } from 'ui';

interface ClockProps {
    timezone: string;
    className?: string;
    leftTitle?: string;
    rightTitle?: string;
    centerTitle?: string;
    rightTitleClassName?: string;
    leftTitleClassName?: string;
    centerTitleClassName?: string;
}

export const Clock: React.FC<ClockProps> = ({ timezone = 'CST', 
className, 
leftTitle, 
rightTitle, 
rightTitleClassName, 
leftTitleClassName,
centerTitle,
centerTitleClassName }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    const formattedTime = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: timezone,
        hour12: true
    }).format(time);

    return (
        <TitleComponent
            className={cn(className)}
            leftTitle={leftTitle ?? timezone}
            leftTitleClassName={cn('text-xs left-[-15px]',
                leftTitleClassName)}
            rightTitle={rightTitle ?? ''}
            rightTitleClassName={cn('text-xs', rightTitleClassName)}
            centerTitle={centerTitle ?? ''}
            centerTitleClassName={cn('text-xs', centerTitleClassName)}
        >
            <div className='mt-2'>
                {formattedTime} <br />
            </div>
            <span className="text-sm">Timezone: {timezone}</span>
        </TitleComponent>
    );
};