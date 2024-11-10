import React from 'react';

interface VeganIconProps {
  className?: string;
  onClick?: () => void;
}

export const VeganIcon: React.FC<VeganIconProps> = ({
  className = 'text-secondary-creamer-beige',
  onClick,
}) => (
  <svg
    className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
    width="21"
    height="21"
    viewBox="0 0 21 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.5 0C4.69699 0 0 4.69617 0 10.5C0 16.3031 4.69617 21 10.5 21C16.303 21 21 16.3038 21 10.5C21 4.69695 16.3038 0 10.5 0ZM10.5 19.7695C5.38876 19.7695 1.23047 15.6112 1.23047 10.5C1.23047 5.38876 5.38876 1.23047 10.5 1.23047C15.6112 1.23047 19.7695 5.38876 19.7695 10.5C19.7695 15.6112 15.6112 19.7695 10.5 19.7695Z"
      fill="#FFBB5C"
    />
    <path
      d="M16.6452 6.72249C16.5192 6.59938 16.3708 6.50817 16.2093 6.45263C16.6573 5.99337 16.6545 5.25373 16.2007 4.7981C15.7475 4.34312 15.0125 4.33952 14.555 4.78743C14.4994 4.62771 14.4092 4.48077 14.2882 4.3558C14.0699 4.13066 13.7774 4.00433 13.4647 4C13.4593 4 13.4538 4 13.4483 4C13.1416 4 12.8522 4.118 12.6319 4.33331C12.4077 4.55245 12.2819 4.8461 12.2778 5.15872L12.2607 6.14226C11.3768 6.03326 10.4534 6.3186 9.77626 6.99846C9.1435 7.63382 7.92779 9.27699 6.94837 10.8206C6.05044 12.2358 4.98357 14.1296 5.00019 15.1151C5.00493 15.3954 5.09068 15.6156 5.25512 15.7699C5.41845 15.9232 5.63778 16 5.9221 16C6.25493 16 6.67678 15.8947 7.20184 15.6835C7.8946 15.4049 8.76079 14.9471 9.77638 14.3229C11.583 13.2126 13.4237 11.8371 14.0093 11.249C14.6853 10.5703 14.9697 9.64491 14.8626 8.75866L15.8444 8.7415C16.1572 8.73727 16.4497 8.61099 16.6679 8.38584C16.8862 8.16074 17.004 7.86372 16.9999 7.54953C16.9954 7.23531 16.8695 6.94158 16.6452 6.72249ZM13.4572 10.6946C12.9176 11.2364 11.1777 12.5354 9.44753 13.6057C8.49752 14.1933 7.65289 14.6469 7.00494 14.9174C6.1167 15.2882 5.83913 15.2163 5.79336 15.1985C5.77702 15.1489 5.72086 14.8692 6.09813 13.9837C6.33237 13.4339 6.69466 12.7461 7.15396 11.9771L7.73448 12.56C7.81072 12.6365 7.91063 12.6748 8.01054 12.6748C8.11043 12.6748 8.21039 12.6365 8.28661 12.56C8.43909 12.4069 8.43909 12.1587 8.28661 12.0056L7.57555 11.2916C7.86542 10.833 8.16497 10.3827 8.45798 9.95996L9.39093 10.8967C9.46717 10.9733 9.56708 11.0116 9.66699 11.0116C9.76691 11.0116 9.86684 10.9733 9.94306 10.8967C10.0955 10.7436 10.0955 10.4954 9.94306 10.3423L8.9171 9.31215C9.27292 8.8214 9.60432 8.39104 9.87842 8.05976L11.0474 9.23348C11.1236 9.31003 11.2235 9.34832 11.3234 9.34832C11.4233 9.34832 11.5233 9.31003 11.5995 9.23348C11.752 9.08039 11.752 8.83216 11.5995 8.67907L10.4051 7.47973C11.2723 6.68763 12.6197 6.71192 13.4572 7.55287C14.3198 8.41905 14.3198 9.82843 13.4572 10.6946ZM16.1084 7.83899C16.0356 7.91406 15.9381 7.95614 15.8323 7.95758L14.6599 7.97805C14.5141 7.62152 14.2973 7.2876 14.0094 6.99849C13.7226 6.71055 13.3916 6.49353 13.0382 6.34708L13.0585 5.1708C13.0599 5.0661 13.1019 4.9682 13.1766 4.89515C13.2513 4.82215 13.3506 4.7836 13.4542 4.78411C13.5584 4.78553 13.6559 4.82765 13.7287 4.90275C13.8011 4.97742 13.8403 5.07572 13.8392 5.17965L13.8275 5.67096C13.8237 5.8312 13.9174 5.97758 14.0641 6.04067C14.2108 6.10374 14.381 6.07082 14.4939 5.95748L15.0964 5.35252C15.2486 5.19967 15.4963 5.19967 15.6485 5.35252C15.8008 5.5054 15.8008 5.7541 15.6485 5.90695L15.0416 6.51635C14.9288 6.62965 14.8959 6.80052 14.9587 6.94784C15.0215 7.09516 15.1671 7.18937 15.3269 7.18549L15.8252 7.17367C15.9285 7.1728 16.0264 7.21187 16.1007 7.28444C16.1755 7.35754 16.2175 7.45556 16.219 7.56033C16.2204 7.66501 16.1811 7.76397 16.1084 7.83899Z"
      fill="#FFBA57"
      stroke="#FFBA57"
      strokeWidth="0.3"
    />
  </svg>
);