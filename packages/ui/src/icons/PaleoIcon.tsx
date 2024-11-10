import React from 'react';

interface PaleoIconProps {
  className?: string;
  onClick?: () => void;
}

export const PaleoIcon: React.FC<PaleoIconProps> = ({
  className = 'text-primary-spinach-green',
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
    <g clipPath="url(#clip0_1116_7376)">
      <path
        d="M17.1096 12.3177C17.1096 10.9337 16.0982 9.89293 14.2494 9.35798C14.3326 8.99292 14.3658 8.65008 14.3504 8.33917L15.1194 7.58214C15.2301 7.47323 15.3854 7.42879 15.525 7.46628C15.9902 7.5912 16.478 7.44756 16.7977 7.09125C17.2153 6.62575 17.2153 5.92373 16.7977 5.45826C16.5722 5.20694 16.2636 5.05968 15.9259 5.04145C15.9074 4.709 15.7578 4.40525 15.5025 4.1833C15.0297 3.77223 14.3164 3.77223 13.8435 4.1833C13.4816 4.498 13.3356 4.97805 13.4626 5.43614C13.5006 5.57343 13.4556 5.72638 13.3449 5.83529L12.5734 6.59479C11.8458 6.56163 11.0485 6.78515 10.3846 7.08681C9.56357 6.43526 8.65864 6.14181 7.48957 6.14181C6.21551 6.14181 5.03386 6.64667 4.16223 7.56337C3.35286 8.41463 2.88867 9.54727 2.88867 10.6708C2.88867 11.9204 3.33791 13.1674 4.29479 13.9646H2.88867V14.7881H3.97022L5.64324 16.435H14.355L16.0281 14.7881H17.1096V13.9646H16.3502C16.7475 13.5357 17.1096 12.8741 17.1096 12.3177ZM13.9364 6.41756C14.2589 6.10017 14.3865 5.64107 14.2696 5.21937C14.2272 5.0664 14.2761 4.90588 14.3973 4.80054C14.5519 4.66615 14.7941 4.66612 14.9487 4.80054C15.133 4.96078 15.1378 5.23491 14.9688 5.40136L15.5603 5.98362C15.7294 5.81731 16.0079 5.8219 16.1706 6.00336C16.3072 6.15556 16.3072 6.39395 16.1706 6.54618C16.0636 6.6655 15.9005 6.71356 15.7452 6.6719C15.3169 6.55691 14.8504 6.68252 14.5279 6.99985L14.1084 7.41284C13.9648 7.15414 13.7694 6.96623 13.5166 6.83088L13.9364 6.41756ZM11.5556 7.53985C12.3276 7.33648 12.9826 7.38284 13.265 7.66081C13.5484 7.93977 13.5974 8.58273 13.3931 9.33874C13.1587 10.2059 12.6416 11.08 11.9744 11.7367C11.1886 12.5102 9.91011 12.5102 9.12436 11.7367C8.33862 10.9632 8.33862 9.70468 9.12436 8.93121C9.78634 8.27958 10.6725 7.77247 11.5556 7.53985ZM14.0085 15.6116H5.98976L5.15323 14.7881H14.8451L14.0085 15.6116ZM6.65304 13.9646C4.92918 13.9646 3.7252 12.6102 3.7252 10.6708C3.7252 8.88131 5.23783 6.96527 7.48957 6.96527C8.46839 6.96527 9.10699 7.21263 9.57938 7.52255C9.19909 7.76355 8.8443 8.04237 8.53286 8.34895C7.42095 9.44348 7.42095 11.2244 8.53286 12.319C9.64468 13.4134 11.454 13.4136 12.5659 12.319C13.1821 11.7124 13.6874 10.9432 14.0033 10.1448C15.1116 10.4623 16.2731 11.0884 16.2731 12.3177C16.2731 12.7927 15.6063 13.9646 14.6 13.9646H6.65304Z"
        fill="#FFBA57"
        stroke="#FFBA57"
        strokeWidth="0.3"
      />
    </g>
    <defs>
      <clipPath id="clip0_1116_7376">
        <rect width="16" height="14" fill="white" transform="translate(2 3)" />
      </clipPath>
    </defs>
  </svg>
);

