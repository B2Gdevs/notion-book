import React from 'react';

interface MinusIconProps {
  className?: string;
  onClick?: () => void;
}

const MinusIcon: React.FC<MinusIconProps> = ({
  className = 'text-primary-spinach-green',
  onClick,
}) => (
  <svg
    className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <g clipPath="url(#clip0_748_18133)">
      <path
        d="M10 0C4.48578 0 0 4.48578 0 10C0 15.5142 4.48578 20 10 20C15.5142 20 20 15.5142 20 10C20 4.48578 15.5142 0 10 0ZM14.375 10.8333H10.8333H10.5C10.0731 10.8333 10.4601 10.8333 10 10.8333C9.53995 10.8333 9.65866 10.8333 9.44537 10.8333H9.16672H5.625C5.16495 10.8333 4.79172 10.4601 4.79172 10C4.79172 9.53995 5.16495 9.16672 5.625 9.16672H9.16672C10.1549 9.16672 9.16672 9.16672 10.1627 9.16672H10.8333H14.375C14.8351 9.16672 15.2083 9.53995 15.2083 10C15.2083 10.4601 14.8351 10.8333 14.375 10.8333Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_748_18133">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default MinusIcon;
