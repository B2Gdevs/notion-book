import React from 'react';
interface DownloadIconProps {
  className?: string;
  onClick?: () => void;
}

const DownloadIcon: React.FC<DownloadIconProps> = ({
  className = 'text-primary-spinach-green',
  onClick,
}) => (
  <svg
    className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
  >
    <path
      d="M14 9.5V13C14 13.2652 13.8946 13.5196 13.7071 13.7071C13.5196 13.8946 13.2652 14 13 14H3C2.73478 14 2.48043 13.8946 2.29289 13.7071C2.10536 13.5196 2 13.2652 2 13V9.5C2 9.36739 2.05268 9.24021 2.14645 9.14645C2.24021 9.05268 2.36739 9 2.5 9C2.63261 9 2.75979 9.05268 2.85355 9.14645C2.94732 9.24021 3 9.36739 3 9.5V13H13V9.5C13 9.36739 13.0527 9.24021 13.1464 9.14645C13.2402 9.05268 13.3674 9 13.5 9C13.6326 9 13.7598 9.05268 13.8536 9.14645C13.9473 9.24021 14 9.36739 14 9.5ZM7.64625 9.85375C7.69269 9.90024 7.74783 9.93712 7.80853 9.96228C7.86923 9.98744 7.93429 10.0004 8 10.0004C8.06571 10.0004 8.13077 9.98744 8.19147 9.96228C8.25217 9.93712 8.30731 9.90024 8.35375 9.85375L10.8538 7.35375C10.9002 7.3073 10.9371 7.25214 10.9622 7.19145C10.9873 7.13075 11.0003 7.0657 11.0003 7C11.0003 6.9343 10.9873 6.86925 10.9622 6.80855C10.9371 6.74786 10.9002 6.6927 10.8538 6.64625C10.8073 6.59979 10.7521 6.56294 10.6914 6.5378C10.6308 6.51266 10.5657 6.49972 10.5 6.49972C10.4343 6.49972 10.3692 6.51266 10.3086 6.5378C10.2479 6.56294 10.1927 6.59979 10.1462 6.64625L8.5 8.29313V2.5C8.5 2.36739 8.44732 2.24021 8.35355 2.14645C8.25979 2.05268 8.13261 2 8 2C7.86739 2 7.74021 2.05268 7.64645 2.14645C7.55268 2.24021 7.5 2.36739 7.5 2.5V8.29313L5.85375 6.64625C5.75993 6.55243 5.63268 6.49972 5.5 6.49972C5.36732 6.49972 5.24007 6.55243 5.14625 6.64625C5.05243 6.74007 4.99972 6.86732 4.99972 7C4.99972 7.13268 5.05243 7.25993 5.14625 7.35375L7.64625 9.85375Z"
      fill="#425F57"
    />
  </svg>
);

export default DownloadIcon;
