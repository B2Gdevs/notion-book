import React from 'react';

interface BackIconProps {
  className?: string;
  onClick?: () => void;
}

const BackIcon: React.FC<BackIconProps> = ({
  className = 'text-primary-spinach-green',
  onClick,
}) => (
  <svg
    className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <path
      d="M18.8883 2.33333H9.11159C4.86492 2.33333 2.33325 4.865 2.33325 9.11167V18.8767C2.33325 23.135 4.86492 25.6667 9.11159 25.6667H18.8766C23.1233 25.6667 25.6549 23.135 25.6549 18.8883V9.11167C25.6666 4.865 23.1349 2.33333 18.8883 2.33333ZM16.0883 17.5C16.4266 17.8383 16.4266 18.3983 16.0883 18.7367C15.9133 18.9117 15.6916 18.9933 15.4699 18.9933C15.2483 18.9933 15.0266 18.9117 14.8516 18.7367L10.7333 14.6183C10.3949 14.28 10.3949 13.72 10.7333 13.3817L14.8516 9.26333C15.1899 8.925 15.7499 8.925 16.0883 9.26333C16.4266 9.60167 16.4266 10.1617 16.0883 10.5L12.5883 14L16.0883 17.5Z"
      fill="currentColor"
    />
  </svg>
);

export default BackIcon;
