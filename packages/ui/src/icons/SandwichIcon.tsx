import React from 'react';

type SandwichIconProps = {
  className?: string;
  onClick?: () => void;
};

export const SandwichIcon: React.FC<SandwichIconProps> = ({
  className,
  onClick }) => (

  <svg width="50"
    height="50"
    fill="None"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}>
    <g clipPath="url(#clip0_2695_8045)">
      <path d="M48.2451 19.3562C48.2451 19.3474 48.244 19.3387 48.2439 19.3299L48.2451 18.8973C48.2456 18.9801 48.242 19.063 48.2353 19.1458C48.1408 17.9273 47.2937 16.7316 45.6826 15.8005C43.9773 14.8168 41.7638 14.3283 39.5357 14.3279C37.3078 14.3284 35.0995 14.817 33.405 15.8009C19.8833 23.6587 35.1848 14.7713 25.548 20.3716C25.5591 20.3781 25.5708 20.3848 25.582 20.3914C16.645 25.585 16.7337 25.4168 4.28077 32.6539C2.65801 33.5978 1.82442 34.8136 1.76358 36.0495C1.7628 36.0232 1.75997 35.9971 1.75987 35.9708L1.75938 36.1673C1.75928 36.1814 1.75772 36.1955 1.75782 36.2096C1.75791 36.2189 1.75889 36.2283 1.75918 36.2375L1.75782 36.7157C1.75997 36.8535 1.76612 37.0372 1.77735 37.1746C1.78789 37.3035 1.80811 37.4749 1.82989 37.6023C1.85938 37.7747 1.90987 38.0024 1.95303 38.1718C1.98321 38.2905 2.03321 38.4462 2.07422 38.5617C2.11514 38.6767 2.23956 39.0267 2.46661 39.4354C2.69122 39.8397 2.8876 40.0926 3.01758 40.26C3.07862 40.3386 3.16319 40.4409 3.23057 40.514C3.28663 40.5749 3.36006 40.6572 3.41758 40.7165C3.48379 40.7847 3.57305 40.875 3.64317 40.9394C3.76514 41.0513 3.93038 41.1978 4.05967 41.3011C4.23409 41.4405 4.29659 41.4843 4.52911 41.6473C4.71553 41.7781 5.06719 41.989 5.27891 42.0983C5.54678 42.2365 5.58116 42.2542 5.78536 42.3467C6.0294 42.4573 6.23067 42.534 6.29678 42.5593C6.82413 42.7607 7.28223 42.8775 7.33272 42.8902C7.55469 42.9458 7.70127 42.9827 7.85645 43.013C7.93565 43.0286 8.04082 43.0511 8.12032 43.0648C8.27842 43.0918 8.48936 43.1264 8.64805 43.1488C9.05733 43.2064 9.53536 43.2378 9.71231 43.2438C9.87247 43.2491 10.086 43.2574 10.2464 43.2556C10.3266 43.2547 10.4334 43.2543 10.5136 43.2527C10.5937 43.2509 10.7004 43.2464 10.7804 43.2438C10.8605 43.2412 10.9672 43.2343 11.0472 43.2291C11.2247 43.2172 11.2247 43.2172 11.5796 43.1815C11.6593 43.1734 11.765 43.1585 11.8444 43.1488C11.9941 43.1302 12.1531 43.1027 12.3731 43.0645C12.3754 43.0641 12.6098 43.0227 12.9022 42.9537C13.0589 42.9167 13.2666 42.8621 13.4213 42.8173C13.8924 42.6812 14.276 42.5294 14.465 42.4495C14.555 42.4114 14.742 42.3323 14.9797 42.2144C15.1295 42.1401 15.3247 42.0322 15.4706 41.9505L15.4707 41.9504C17.7699 40.6143 45.0094 24.8772 45.0094 24.8772L45.0095 24.8771C45.1696 24.7837 45.4443 24.6177 45.7532 24.3867C45.8296 24.3296 45.9307 24.2527 46.0033 24.1911C46.1296 24.084 46.2962 23.9391 46.4159 23.8249C46.6652 23.5868 46.8776 23.331 46.8795 23.3288C46.9841 23.1986 47.1203 23.0222 47.2177 22.8865C47.2822 22.7963 47.3606 22.6709 47.4189 22.5767C47.48 22.478 47.5566 22.3432 47.6084 22.2394C47.6845 22.0866 47.7784 21.879 47.845 21.7218C47.8931 21.6085 47.9444 21.4526 47.9828 21.3356C48.0099 21.2533 48.0394 21.1416 48.0627 21.0581C48.0973 20.9349 48.1302 20.7672 48.1543 20.6417C48.1709 20.5553 48.1876 20.4392 48.1987 20.352C48.2146 20.2278 48.2278 20.0613 48.2355 19.9364C48.241 19.8482 48.2406 19.7304 48.2428 19.6422L48.2435 19.3959C48.2439 19.3826 48.2451 19.3694 48.2451 19.3562Z" fill="#F18700" />
      <path d="M1.7583 35.9708L1.75781 36.1673C1.7582 36.128 1.76006 36.0886 1.76201 36.0492C1.76113 36.0232 1.7585 35.997 1.7583 35.9708Z" fill="#F18700" />
      <path d="M48.2442 18.8973C48.2447 18.9802 48.2411 19.0631 48.2344 19.1458C48.2392 19.2071 48.2421 19.2685 48.2431 19.3301L48.2442 18.8973Z" fill="#F18700" />
      <path d="M45.7222 22.9122C32.6139 30.5299 29.4724 32.2837 16.5983 39.7653C16.4823 39.8327 16.3634 39.8973 16.2428 39.9601L16.2422 40.1863C16.2421 40.2137 16.2408 40.24 16.2402 40.2667C16.2408 40.2398 16.2421 40.2136 16.2422 40.1863L16.2428 39.9601C14.601 40.8134 12.5431 41.2379 10.4677 41.2384C8.23975 41.238 6.02617 40.7493 4.3208 39.7656C2.6291 38.788 1.7793 37.5187 1.75918 36.2377L1.75781 36.7158C1.75996 36.8536 1.76611 37.0373 1.77734 37.1747C1.78789 37.3036 1.80811 37.475 1.82988 37.6024C1.85937 37.7748 1.90986 38.0025 1.95303 38.172C1.9832 38.2906 2.0332 38.4464 2.07422 38.5618C2.11514 38.6769 2.23955 39.0269 2.4666 39.4355C2.69121 39.8398 2.8876 40.0928 3.01758 40.2602C3.07861 40.3388 3.16318 40.441 3.23057 40.5142C3.28662 40.575 3.36006 40.6573 3.41758 40.7166C3.48379 40.7849 3.57305 40.8752 3.64316 40.9396C3.76514 41.0515 3.93037 41.198 4.05967 41.3013C4.23408 41.4406 4.29658 41.4845 4.5291 41.6475C4.71553 41.7782 5.06719 41.9892 5.27891 42.0984C5.54678 42.2366 5.58115 42.2544 5.78535 42.3469C6.02939 42.4574 6.23066 42.5342 6.29678 42.5595C6.82412 42.7608 7.28223 42.8776 7.33271 42.8903C7.55469 42.9459 7.70127 42.9828 7.85644 43.0132C7.93564 43.0287 8.04082 43.0513 8.12031 43.0649C8.27842 43.092 8.48936 43.1266 8.64805 43.1489C9.05732 43.2065 9.53535 43.238 9.71231 43.2439C9.87246 43.2492 10.086 43.2575 10.2464 43.2558C10.3266 43.2549 10.4334 43.2545 10.5136 43.2528C10.5937 43.2511 10.7004 43.2466 10.7804 43.2439C10.8604 43.2413 10.9672 43.2345 11.0472 43.2292C11.2247 43.2174 11.2247 43.2174 11.5796 43.1816C11.6593 43.1735 11.765 43.1587 11.8444 43.1489C11.9941 43.1304 12.1531 43.1028 12.3731 43.0646C12.3754 43.0643 12.6098 43.0229 12.9021 42.9538C13.0589 42.9169 13.2666 42.8622 13.4213 42.8175C13.8924 42.6813 14.276 42.5296 14.465 42.4496C14.555 42.4115 14.742 42.3324 14.9797 42.2146C15.1295 42.1402 15.3247 42.0323 15.4706 41.9507L15.4707 41.9506C17.7699 40.6145 45.0094 24.8773 45.0094 24.8773L45.0095 24.8772C45.1697 24.7839 45.4443 24.6179 45.7532 24.3868C45.8296 24.3298 45.9307 24.2528 46.0033 24.1912C46.1296 24.0842 46.2962 23.9393 46.4159 23.825C46.6652 23.5869 46.8776 23.3312 46.8795 23.3289C46.9841 23.1987 47.1203 23.0224 47.2177 22.8866C47.2822 22.7965 47.3606 22.6711 47.4189 22.5769C47.48 22.4781 47.5566 22.3434 47.6084 22.2396C47.6846 22.0867 47.7784 21.8791 47.845 21.722C47.8931 21.6087 47.9444 21.4527 47.9828 21.3357C48.0099 21.2534 48.0394 21.1417 48.0627 21.0582C48.0973 20.9351 48.1302 20.7674 48.1543 20.6418C48.1709 20.5555 48.1876 20.4394 48.1987 20.3521C48.2146 20.2279 48.2278 20.0614 48.2355 19.9365C48.241 19.8483 48.2406 19.7306 48.2428 19.6424L48.2435 19.396C48.2329 20.6729 47.3977 21.9375 45.7222 22.9122Z" fill="#F18700" />
      <path d="M4.321 39.7656C6.02627 40.7493 8.23985 41.2378 10.4679 41.2383C12.5433 41.2378 14.6012 40.8133 16.243 39.96C16.3637 39.8972 16.4825 39.8328 16.5985 39.7653C29.4727 32.2836 32.6141 30.5298 45.7224 22.9122C47.398 21.9375 48.2332 20.6729 48.2439 19.3959C48.2439 19.3826 48.2454 19.3694 48.2453 19.3563C48.2453 19.3475 48.2442 19.3388 48.244 19.33C48.2432 19.2686 48.24 19.2072 48.2354 19.1458C48.1409 17.9273 47.2938 16.7316 45.6827 15.8005C43.9774 14.8168 41.7639 14.3283 39.5358 14.3279C37.3079 14.3284 35.0996 14.817 33.4051 15.8009C19.8834 23.6587 35.1849 14.7713 25.5481 20.3716C25.5592 20.3781 25.5709 20.3848 25.5821 20.3914C16.6451 25.585 16.7338 25.4168 4.28077 32.6538C2.65801 33.5977 1.82442 34.8135 1.76358 36.0494C1.76163 36.0886 1.75967 36.1281 1.75938 36.1674C1.75928 36.1815 1.75772 36.1956 1.75782 36.2097C1.75791 36.219 1.75889 36.2284 1.75918 36.2376C1.7794 37.5187 2.6292 38.788 4.321 39.7656Z" fill="currentColor" />
      <path d="M46.5641 14.4957C45.5867 13.9314 42.8628 14.8978 41.6626 14.6107C41.4872 14.5687 41.3213 14.4971 41.1619 14.4051C40.8057 14.1994 40.482 13.8917 40.1588 13.5842C39.8359 13.2762 39.5133 12.9688 39.1591 12.7643C38.9014 12.6156 38.6269 12.5212 38.3233 12.5212C36.9999 12.5212 36.2493 14.3127 35.0076 14.6108C33.8113 14.8984 31.0766 13.9311 30.1049 14.4958C26.7645 16.4371 28.8562 17.6446 25.5158 19.5859C22.1755 21.5272 20.0839 20.3195 16.7435 22.2607C13.403 24.2019 15.4947 25.4094 12.1544 27.3507C8.81407 29.2919 6.72247 28.0843 3.38204 30.0255C2.41104 30.5898 4.08907 32.1711 3.59639 32.865C3.08682 33.5846 -0.0042924 34.0256 4.47541e-06 34.7921C0.000981038 34.9679 0.164653 35.1267 0.422661 35.2756C0.776762 35.48 1.30831 35.666 1.84034 35.8522C2.37286 36.0386 2.90606 36.225 3.2626 36.4309C3.42159 36.5226 3.54541 36.6183 3.61836 36.7196C4.11807 37.4138 2.4585 38.9948 3.43594 39.559C4.41397 40.1237 7.13721 39.1569 8.33741 39.444C8.51241 39.4859 8.67793 39.5573 8.83692 39.6491C9.19336 39.8549 9.517 40.1631 9.84063 40.471C10.1638 40.7787 10.4865 41.086 10.8405 41.2903C11.0985 41.4392 11.3731 41.5335 11.6767 41.5335C13.0001 41.5335 13.7514 39.7417 14.9924 39.444C16.1895 39.1569 18.9241 40.1232 19.8951 39.5589C23.2356 37.6177 21.1439 36.4102 24.4842 34.4689C27.8245 32.5277 29.9161 33.7353 33.2572 31.7937C36.5977 29.8525 34.506 28.645 37.8463 26.7037C41.1858 24.7628 43.2775 25.9705 46.618 24.0292C47.5898 23.4646 45.9116 21.884 46.4036 21.1898C46.9142 20.4696 50.0053 20.0293 50.0002 19.2624C49.9988 19.0865 49.8353 18.9278 49.5775 18.7789C49.2234 18.5745 48.6917 18.3886 48.1591 18.2028C47.6271 18.0166 47.0944 17.8298 46.7382 17.6242C46.5788 17.5322 46.4547 17.4363 46.3818 17.335C45.8819 16.6409 47.5423 15.0603 46.5641 14.4957Z" fill="#C3FB3A" />
      <path d="M46.6074 18.2969C46.6316 17.0508 45.8198 15.799 44.1732 14.8483C40.9409 12.9821 35.7173 12.9822 32.506 14.8484C30.9056 15.7785 30.1072 16.9966 30.1088 18.2156C30.1088 18.2117 30.1086 18.2078 30.1086 18.2039L30.1016 19.9349C30.0981 21.1657 30.9105 22.3984 32.5369 23.3373C35.7692 25.2034 40.9928 25.2035 44.2041 23.3374C45.7994 22.4104 46.598 21.197 46.6015 19.9819L46.6085 18.251C46.6084 18.2662 46.6077 18.2816 46.6074 18.2969Z" fill="#CD2A01" />
      <path d="M46.6083 18.2508L46.6013 19.9818C46.5978 21.1969 45.7992 22.4103 44.2039 23.3372C40.9927 25.2033 35.7691 25.2032 32.5369 23.3371C30.9104 22.3981 30.0981 21.1654 30.1016 19.9347L30.1086 18.2037C30.1051 19.4346 30.9175 20.6672 32.544 21.6062C35.7762 23.4723 40.9998 23.4724 44.211 21.6063C45.8063 20.6793 46.6049 19.466 46.6083 18.2508Z" fill="#CD2A01" />
      <path d="M44.1699 14.8482C47.4021 16.7143 47.4192 19.7402 44.2079 21.6064C40.9967 23.4726 35.7731 23.4724 32.5409 21.6063C29.3086 19.7402 29.2915 16.7146 32.5028 14.8485C35.714 12.9823 40.9376 12.9821 44.1699 14.8482Z" fill="#FF3502" />
      <path d="M34.3652 25.075C34.3894 23.8289 33.5776 22.5771 31.931 21.6263C28.6987 19.7602 23.4751 19.7603 20.2638 21.6265C18.6634 22.5566 17.8651 23.7747 17.8666 24.9937C17.8666 24.9898 17.8664 24.9859 17.8664 24.982L17.8594 26.713C17.8559 27.9438 18.6683 29.1764 20.2947 30.1154C23.527 31.9815 28.7506 31.9816 31.9619 30.1155C33.5572 29.1884 34.3558 27.9751 34.3593 26.76L34.3663 25.0291C34.3662 25.0442 34.3655 25.0595 34.3652 25.075Z" fill="#CD2A01" />
      <path d="M34.3663 25.029L34.3593 26.76C34.3558 27.9751 33.5572 29.1885 31.9619 30.1154C28.7507 31.9815 23.5271 31.9814 20.2947 30.1153C18.6682 29.1763 17.8559 27.9436 17.8594 26.7129L17.8664 24.9819C17.8629 26.2128 18.6753 27.4454 20.3018 28.3844C23.534 30.2505 28.7576 30.2506 31.969 28.3845C33.5643 27.4573 34.3629 26.244 34.3663 25.029Z" fill="#CD2A01" />
      <path d="M31.9317 21.6261C35.1639 23.4922 35.181 26.5182 31.9698 28.3843C28.7585 30.2504 23.5349 30.2503 20.3026 28.3842C17.0703 26.5181 17.0533 23.4925 20.2645 21.6264C23.4757 19.7603 28.6993 19.76 31.9317 21.6261Z" fill="#FF3502" />
      <path d="M22.1659 32.1439C22.1901 30.8978 21.3783 29.646 19.7317 28.6953C16.4994 26.8291 11.2758 26.8293 8.06446 28.6955C6.46407 29.6255 5.66573 30.8436 5.6673 32.0626C5.6673 32.0587 5.6671 32.0548 5.6671 32.0509L5.66017 33.7819C5.65665 35.0127 6.46905 36.2454 8.09552 37.1844C11.3277 39.0505 16.5514 39.0506 19.7627 37.1845C21.358 36.2575 22.1566 35.0441 22.1601 33.8291L22.1671 32.0981C22.1669 32.1133 22.1662 32.1286 22.1659 32.1439Z" fill="#CD2A01" />
      <path d="M22.1671 32.0979L22.1601 33.8289C22.1566 35.044 21.358 36.2574 19.7627 37.1844C16.5515 39.0505 11.3278 39.0504 8.09552 37.1843C6.46896 36.2452 5.65665 35.0125 5.66017 33.7817L5.6672 32.0508C5.66368 33.2816 6.47609 34.5143 8.10255 35.4533C11.3348 37.3194 16.5584 37.3195 19.7697 35.4534C21.3651 34.5265 22.1637 33.3132 22.1671 32.0979Z" fill="#CD2A01" />
      <path d="M19.7325 28.6954C22.9647 30.5615 22.9818 33.5873 19.7705 35.4536C16.5593 37.3197 11.3357 37.3196 8.10335 35.4535C4.87113 33.5874 4.85404 30.5618 8.06527 28.6957C11.2765 26.8295 16.5002 26.8293 19.7325 28.6954Z" fill="#FF3502" />
      <path d="M49.1544 13.4839L39.3779 7.80249C37.4937 8.89038 36.5219 10.295 35.6639 11.5331C34.8931 12.6458 34.2271 13.6075 32.8356 14.4108C31.4441 15.2141 30.7749 15.0234 30.0003 14.803C29.1381 14.558 28.1603 14.279 26.2772 15.3662C24.3931 16.4541 23.4212 17.8585 22.5632 19.0967C21.7924 20.2094 21.1265 21.1711 19.735 21.9745C18.3445 22.7772 17.6754 22.5864 16.8996 22.3666C16.0385 22.121 15.0607 21.8419 13.1776 22.9292C11.2935 24.0171 10.3216 25.4216 9.46357 26.6598C8.69277 27.7725 8.02685 28.7342 6.63535 29.5375C5.24492 30.3403 4.57578 30.1495 3.80117 29.9291C2.93896 29.684 1.9623 29.4043 0.078125 30.4922L0.0829102 32.1892L9.85938 37.8707C11.2509 37.0673 11.9201 37.2582 12.6947 37.4785C13.5559 37.7241 14.5336 38.0032 16.4167 36.916C18.3009 35.8281 19.2728 34.4236 20.1308 33.1854C20.9016 32.0727 21.5675 31.111 22.959 30.3077C24.3494 29.5049 25.0186 29.6958 25.7943 29.9155C26.6555 30.1611 27.6332 30.4402 29.5163 29.3529C31.4005 28.265 32.3724 26.8605 33.2304 25.6223C34.0012 24.5096 34.6671 23.5479 36.0586 22.7446C37.4491 21.9418 38.1193 22.132 38.8939 22.3524C39.7562 22.5974 40.7328 22.8771 42.617 21.7892C44.5012 20.7013 45.473 19.2967 46.331 18.0586C47.1018 16.9459 47.7677 15.9842 49.1592 15.1809L49.1544 13.4839Z" fill="#C60024" />
      <path d="M9.85928 37.8706L0.0829102 32.1892L0.078125 30.4922L9.85449 36.1736L9.85928 37.8706Z" fill="#FE0B37" />
      <path d="M9.85449 36.1737L0.078125 30.4922C1.9623 29.4043 2.93896 29.684 3.80117 29.9291C4.57578 30.1495 5.24492 30.3404 6.63535 29.5375C8.02685 28.7342 8.69277 27.7724 9.46357 26.6598C10.3217 25.4215 11.2935 24.017 13.1776 22.9292C15.0607 21.842 16.0384 22.121 16.8996 22.3666C17.6753 22.5865 18.3445 22.7773 19.735 21.9745C21.1265 21.1711 21.7924 20.2093 22.5632 19.0967C23.4213 17.8584 24.3931 16.454 26.2772 15.3662C28.1604 14.279 29.1381 14.558 30.0003 14.803C30.7749 15.0234 31.444 15.2143 32.8356 14.4108C34.2271 13.6075 34.8931 12.6457 35.6639 11.5331C36.522 10.2948 37.4937 8.89028 39.3779 7.80249L49.1544 13.4839C47.2702 14.5718 46.2983 15.9763 45.4403 17.2145C44.6695 18.3272 44.0036 19.2889 42.6121 20.0922C41.2206 20.8956 40.5514 20.7048 39.7768 20.4844C38.9145 20.2394 37.9367 19.9604 36.0537 21.0476C34.1695 22.1355 33.1977 23.54 32.3396 24.7782C31.5688 25.8909 30.9029 26.8526 29.5114 27.6559C28.121 28.4586 27.4519 28.2678 26.6761 28.0481C25.8149 27.8025 24.8372 27.5234 22.9541 28.6107C21.0699 29.6986 20.098 31.1031 19.24 32.3413C18.4692 33.454 17.8033 34.4157 16.4118 35.219C15.0214 36.0217 14.3522 35.8309 13.5776 35.6105C12.7152 35.3656 11.7387 35.0859 9.85449 36.1737Z" fill="#FF3E61" />
      <path d="M49.1554 13.4839L49.1602 15.1809C47.7687 15.9844 47.1027 16.946 46.3319 18.0586C45.4738 19.2969 44.5021 20.7014 42.6179 21.7892C40.7337 22.8771 39.757 22.5974 38.8948 22.3523C38.1202 22.1319 37.4499 21.9417 36.0595 22.7445C34.668 23.5479 34.0021 24.5097 33.2313 25.6223C32.3731 26.8605 31.4014 28.265 29.5172 29.3528C27.6341 30.44 26.6563 30.161 25.7952 29.9154C25.0195 29.6956 24.3503 29.5048 22.9599 30.3076C21.5684 31.1109 20.9024 32.0728 20.1316 33.1854C19.2735 34.4236 18.3018 35.8282 16.4176 36.9159C14.5345 38.0031 13.5567 37.7241 12.6956 37.4785C11.921 37.2581 11.2519 37.0672 9.86025 37.8707L9.85547 36.1737C11.7396 35.0858 12.7163 35.3655 13.5785 35.6105C14.3531 35.831 15.0223 36.0219 16.4127 35.219C17.8042 34.4157 18.4701 33.4539 19.2409 32.3413C20.099 31.103 21.0708 29.6985 22.955 28.6107C24.8381 27.5235 25.8157 27.8025 26.677 28.0481C27.4526 28.268 28.1219 28.4588 29.5123 27.656C30.9038 26.8526 31.5697 25.8908 32.3405 24.7782C33.1986 23.5399 34.1704 22.1354 36.0546 21.0477C37.9377 19.9604 38.9153 20.2395 39.7776 20.4845C40.5522 20.7049 41.2214 20.8958 42.613 20.0923C44.0045 19.289 44.6704 18.3271 45.4412 17.2146C46.2993 15.9762 47.2712 14.5717 49.1554 13.4839Z" fill="#C60024" />
      <path d="M48.2237 12.8253C48.2176 12.7365 48.2038 12.6183 48.1911 12.53C48.1706 12.3883 48.1277 12.0933 48.0153 11.7122C47.9908 11.6293 47.9562 11.5194 47.9269 11.4381C47.8869 11.3278 47.8334 11.1808 47.7847 11.0742C47.714 10.9192 47.6144 10.7149 47.5345 10.5644C47.483 10.4673 47.4054 10.343 47.3474 10.2499C47.292 10.161 47.2139 10.045 47.1512 9.96108C47.0512 9.82749 46.912 9.65386 46.8054 9.52554C46.8036 9.52339 46.5898 9.27651 46.3578 9.0603C46.2367 8.94741 46.0687 8.80435 45.9413 8.69858C45.8709 8.63999 45.7729 8.56714 45.699 8.51274C45.6266 8.45923 45.5291 8.38921 45.4537 8.33999C45.3133 8.24858 45.1236 8.13042 44.9801 8.04419C44.9714 8.03921 44.9622 8.03491 44.9534 8.03013C44.9622 8.03491 44.9713 8.03911 44.9799 8.04409C44.7591 7.91685 44.5854 7.82944 44.4741 7.77456C44.2004 7.63989 43.9592 7.54175 43.9568 7.54077C43.8371 7.49243 43.6145 7.4023 43.4442 7.34536C43.3675 7.31968 43.2657 7.28355 43.1883 7.25991C42.8413 7.15444 42.805 7.14341 42.6683 7.10942C42.3598 7.03267 42.2865 7.0144 42.1445 6.98657C42.0653 6.97105 41.9602 6.94849 41.8807 6.93481C41.5831 6.88384 41.4934 6.86841 41.3524 6.85073C41.2729 6.84077 41.1673 6.82603 41.0875 6.81802C40.7355 6.78257 40.7355 6.78257 40.5554 6.77056C40.4562 6.76392 40.1546 6.7438 39.7546 6.7439C39.6029 6.74399 39.2974 6.74761 38.9537 6.77056C38.6145 6.79321 38.4323 6.81616 38.1564 6.85083C38.0145 6.8687 37.9325 6.88276 37.6277 6.93511C37.5479 6.94878 37.4424 6.97144 37.3631 6.98716C37.2206 7.01519 37.1473 7.03355 36.8383 7.11069C36.7014 7.14487 36.6723 7.15376 36.3168 7.26245C36.2395 7.28608 36.1378 7.32232 36.061 7.34819C35.8926 7.40493 35.6842 7.4896 35.5464 7.54565C35.5369 7.54956 35.3104 7.64185 35.0213 7.78501C34.8715 7.85923 34.6763 7.96724 34.5304 8.04888C34.5331 8.04722 34.5361 8.04595 34.5389 8.04439C34.536 8.04605 34.533 8.04731 34.5303 8.04897C26.7113 12.5928 31.4344 9.73159 23.6152 14.2755C23.7376 14.2044 23.8665 14.1379 24 14.0754L16.4246 18.4778L14.1653 19.7908L11.8878 21.1143C9.58887 22.4502 7.29014 23.7862 4.99131 25.122C4.99404 25.1205 4.99687 25.1192 4.99971 25.1176C4.99697 25.1192 4.99395 25.1205 4.99121 25.1221C4.83105 25.2155 4.55635 25.3814 4.24746 25.6126C4.17109 25.6696 4.07002 25.7465 3.99727 25.8082C3.871 25.9152 3.70439 26.0601 3.58467 26.1744C3.33525 26.4125 3.12295 26.6682 3.12109 26.6705C3.0165 26.8006 2.88027 26.977 2.78291 27.1127C2.71836 27.2029 2.63994 27.3283 2.58164 27.4226C2.52061 27.5213 2.44395 27.6561 2.39219 27.7599C2.31611 27.9127 2.22217 28.1204 2.15557 28.2775C2.10762 28.3908 2.05615 28.5468 2.01777 28.6637C1.99072 28.746 1.96123 28.8578 1.93789 28.9413C1.90332 29.0644 1.87041 29.2321 1.84629 29.3577C1.82969 29.444 1.81299 29.5601 1.80186 29.6473C1.78604 29.7715 1.77275 29.9379 1.76504 30.0628C1.75957 30.151 1.75996 30.2688 1.75781 30.357C1.76484 31.6131 2.59922 32.8691 4.25918 33.8275C5.91895 34.7858 8.09014 35.2649 10.2587 35.2649C12.4271 35.2649 14.593 34.7857 16.2422 33.8272L26.7574 27.8331C26.7574 27.825 26.7571 27.8173 26.757 27.8094L45.7809 16.7541C47.4301 15.7957 48.2503 14.5396 48.2432 13.2835C48.2409 13.1463 48.2332 12.9628 48.2237 12.8253Z" fill="#FF9911" />
      <path d="M13.8764 24.5597C13.1881 23.2684 12.3404 22.1567 11.5792 21.2936C11.0672 21.5911 10.555 21.8888 10.043 22.1864C10.3054 23.1755 10.7104 24.3312 11.3356 25.5043C13.0154 28.6572 15.6476 30.7416 15.6476 30.7416C15.6476 30.7416 15.5562 27.7135 13.8764 24.5597Z" fill="currentColor" />
      <path d="M31.9336 9.5512C32.1967 10.5237 32.5965 11.6502 33.2062 12.794C34.8853 15.9472 37.5181 18.0313 37.5181 18.0313C37.5181 18.0313 37.4267 15.0032 35.746 11.8498C35.0741 10.5884 34.25 9.49885 33.5026 8.64465C32.8908 8.99944 32.3746 9.29749 31.9336 9.5512Z" fill="currentColor" />
      <path d="M25.9149 17.0308C27.5947 20.1837 30.2269 22.2681 30.2269 22.2681C30.2269 22.2681 30.1354 19.2401 28.4557 16.0863C27.7643 14.7889 26.912 13.6732 26.148 12.8085C25.7148 13.0578 25.2112 13.3488 24.6172 13.693C24.8794 14.6865 25.2858 15.8499 25.9149 17.0308Z" fill="currentColor" />
      <path d="M18.6251 21.2675C20.3042 24.4207 22.937 26.5048 22.937 26.5048C22.937 26.5048 22.8456 23.4767 21.1649 20.3233C20.477 19.0318 19.6294 17.9201 18.8681 17.057L17.332 17.9497C17.5948 18.9387 17.9999 20.0943 18.6251 21.2675Z" fill="currentColor" />
    </g>
    <defs>
      <clipPath id="clip0_2695_8045">
        <rect width="50" height="50" fill="white" />
      </clipPath>
    </defs>
  </svg>

);

