import React from 'react';

interface UpArrowIconProps {
  onClick?: () => void;
  className?: string;
}

const UpArrowIcon: React.FC<UpArrowIconProps> = ({ onClick, className }) => (
  <svg
    className={className}
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <path
      d="M24.9 18.8125L16.75 10.6625C15.7875 9.69999 14.2125 9.69999 13.25 10.6625L5.09998 18.8125"
      fill="#E8F3D6"
    />
    <path
      d="M24.9 18.8125L16.75 10.6625C15.7875 9.69999 14.2125 9.69999 13.25 10.6625L5.09998 18.8125"
      stroke="#292D32"
      strokeWidth="1.5"
      strokeMiterlimit="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default UpArrowIcon;
