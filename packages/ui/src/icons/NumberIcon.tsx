import React from 'react';
interface AddIconProps {
  className?: string;
  onClick?: () => void;
}

const AddIcon: React.FC<AddIconProps> = ({
  className = 'text-primary-spinach-green',
  onClick,
}) => (
  <svg
    className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <circle cx="12" cy="12" r="12" fill="currentColor" />
  </svg>
);

export default AddIcon;
