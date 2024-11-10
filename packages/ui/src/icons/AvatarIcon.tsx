import React from 'react';
interface AvatarIconProps {
  className?: string;
  onClick?: () => void;
}

const AvatarIcon: React.FC<AvatarIconProps> = ({
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
    <path
      d="M10.1001 10.65C10.0417 10.6417 9.96672 10.6417 9.90006 10.65C8.43339 10.6 7.26672 9.4 7.26672 7.925C7.26672 6.41667 8.48339 5.19167 10.0001 5.19167C11.5084 5.19167 12.7334 6.41667 12.7334 7.925C12.7251 9.4 11.5667 10.6 10.1001 10.65Z"
      stroke="#2B2B2B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.6166 16.15C14.1333 17.5083 12.1666 18.3333 9.99997 18.3333C7.8333 18.3333 5.86663 17.5083 4.3833 16.15C4.46663 15.3667 4.96663 14.6 5.8583 14C8.14163 12.4833 11.875 12.4833 14.1416 14C15.0333 14.6 15.5333 15.3667 15.6166 16.15Z"
      stroke="#2B2B2B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.99996 18.3333C14.6023 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6023 1.66667 9.99996 1.66667C5.39759 1.66667 1.66663 5.39763 1.66663 10C1.66663 14.6024 5.39759 18.3333 9.99996 18.3333Z"
      stroke="#2B2B2B"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AvatarIcon;
