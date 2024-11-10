import React from 'react';

interface CalendarEditIconProps {
  className?: string;
  onClick?: () => void;
}

const CalendarEditIcon: React.FC<CalendarEditIconProps> = ({
  className,
  onClick,
}) => (
  <svg
    className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <path
      d="M33.5 7.12V4C33.5 3.18 32.82 2.5 32 2.5C31.18 2.5 30.5 3.18 30.5 4V7H17.5V4C17.5 3.18 16.82 2.5 16 2.5C15.18 2.5 14.5 3.18 14.5 4V7.12C9.09995 7.62 6.47997 10.84 6.07997 15.62C6.03997 16.2 6.51997 16.68 7.07997 16.68H40.9199C41.4999 16.68 41.9799 16.18 41.9199 15.62C41.5199 10.84 38.9 7.62 33.5 7.12Z"
      fill="#425F57"
    />
    <path
      d="M40 19.68C41.1 19.68 42 20.58 42 21.68V34C42 40 39 44 32 44H16C9 44 6 40 6 34V21.68C6 20.58 6.9 19.68 8 19.68H40Z"
      fill="#425F57"
    />
    <path
      d="M29.6799 29.98L28.6799 31H28.6599L22.5999 37.06C22.3399 37.32 21.7999 37.6 21.4199 37.64L18.7199 38.04C17.7399 38.18 17.0599 37.48 17.1999 36.52L17.5799 33.8C17.6399 33.42 17.8999 32.9 18.1599 32.62L24.2399 26.56L25.2399 25.54C25.8999 24.88 26.6399 24.4 27.4399 24.4C28.1199 24.4 28.8599 24.72 29.6799 25.54C31.4799 27.34 30.8999 28.76 29.6799 29.98Z"
      fill="currentColor"
    />
  </svg>
);

export default CalendarEditIcon;
