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
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m21 16-4 4-4-4" />
    <path d="M17 20V4" />
    <path d="m3 8 4-4 4 4" />
    <path d="M7 4v16" />
  </svg>
);

export default AddIcon;
