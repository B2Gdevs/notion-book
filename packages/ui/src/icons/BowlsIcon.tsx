import React from 'react';

type BowlsIconProps = {
  className?: string;
  onClick?: () => void;
};

export const BowlsIcon: React.FC<BowlsIconProps> = ({
  className,
  onClick }) => (

  <svg width="50"
    height="50"
    fill="None"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}>
    <g clipPath="url(#clip0_2701_8612)">
      <path d="M49.4884 16.3706C49.4843 16.3626 49.4843 16.3545 49.4803 16.3464C47.7424 10.302 37.4438 5.66077 25.0001 5.66077C12.5563 5.66077 2.25777 10.302 0.519842 16.3464C0.51581 16.3545 0.51581 16.3626 0.511777 16.3706C0.00370463 17.8585 -0.794695 23.7457 1.96341 29.4757C3.7457 33.1894 7.01995 36.8387 12.8346 39.1774L12.8305 39.1855V41.1452C12.8305 41.1452 16.0523 44.3711 25.0001 44.3388C33.9478 44.3711 37.1696 41.1452 37.1696 41.1452V39.1855L37.1656 39.1774C42.9802 36.8387 46.2544 33.1894 48.0367 29.4757C50.7948 23.7457 49.9964 17.8585 49.4884 16.3706Z" fill="#20BAB6" />
      <path d="M47.4481 21.3909C47.1457 20.5844 46.7021 20.0884 46.2626 19.79C46.0973 19.6771 45.9319 19.5884 45.7787 19.5239C48.9159 19.6207 45.2464 16.3988 44.5771 17.5682C43.948 14.2416 41.7262 16.54 41.7262 16.54C41.569 16.3706 41.3956 16.2174 41.2061 16.0803C40.8552 15.8263 40.452 15.6287 40.0125 15.5198C41.8633 13.6448 36.714 12.4149 37.202 14.8988C37.1213 14.7778 37.0447 14.6649 36.9641 14.5601C36.831 14.3867 36.6858 14.2254 36.5286 14.0843C35.7221 13.3504 34.6092 13.0198 33.5043 13.181C32.9599 13.2577 32.4761 13.3625 32.0486 13.4835C33.1535 11.177 30.3389 9.74551 27.1816 13.0843L27.1776 13.0883C26.9518 12.9794 26.7139 12.8786 26.4719 12.7859C24.6413 12.0802 22.5001 11.7697 21.2783 11.6407C20.5606 11.5681 19.8509 11.806 19.3307 12.306C19.2057 12.423 19.0767 12.5601 18.9436 12.7093H18.9396C18.9396 12.7093 17.5444 11.0641 16.0444 11.9593C15.6976 12.1649 15.5887 12.6165 15.7621 12.9794C15.9435 13.3585 16.1936 13.8061 16.4234 13.9351C15.7339 13.6407 14.9314 13.677 14.258 14.0601C13.9475 14.2375 13.6008 14.4432 13.2379 14.6851C11.9717 12.3423 8.63698 13.4754 8.37891 16.9916C7.99181 17.169 7.72971 17.4472 7.45954 17.7618C7.20551 15.5077 3.43528 18.161 5.44741 19.3061C4.9716 19.5199 4.64498 19.786 4.41111 20.0844C4.35869 20.1489 4.31433 20.2134 4.26997 20.282C3.76997 18.8021 1.06024 19.9029 3.46754 22.6368V22.6409C3.30625 22.9957 3.06028 23.2981 2.62479 23.5038C1.10863 21.8828 0.257812 20.0723 0.257812 18.161C0.257812 17.5521 0.342491 16.9553 0.511849 16.3706C0.515881 16.3626 0.515881 16.3545 0.519914 16.3464C2.25784 10.302 12.5564 5.66077 25.0001 5.66077C37.4439 5.66077 47.7424 10.302 49.4804 16.3464C49.4844 16.3545 49.4844 16.3626 49.4884 16.3706C49.6578 16.9553 49.7425 17.5521 49.7425 18.161C49.7425 19.8868 49.0489 21.532 47.7989 23.028H47.7949C47.7384 22.3747 47.6134 21.8344 47.4481 21.3909Z" fill="#008783" />
      <path d="M36.3107 29.2821C37.8188 28.8869 39.2382 28.4192 40.5447 27.8869C42.4036 27.1288 44.0367 26.2377 45.3915 25.2417C45.9238 24.8506 46.4117 24.4473 46.8512 24.032V24.028C47.198 23.7014 47.5125 23.3667 47.7988 23.028C49.0488 21.532 49.7424 19.8868 49.7424 18.161C49.7424 17.5521 49.6577 16.9553 49.4884 16.3706C49.9964 17.8585 50.7948 23.7457 48.0367 29.4757C47.8553 29.3668 42.4842 26.1732 40.7181 31.8709C40.1414 33.9233 37.5729 39.129 31.5566 35.637C30.2381 35.0201 28.6493 33.4838 25.0001 33.4838C21.3508 33.4838 19.7621 35.0201 18.4435 35.637C12.4273 39.129 9.8587 33.9233 9.28208 31.8709C7.87077 26.7135 2.1489 29.391 1.96341 29.4757C-0.794695 23.7457 0.00370463 17.8585 0.511777 16.3706C0.34242 16.9553 0.257741 17.5521 0.257741 18.161C0.257741 20.0723 1.10856 21.8828 2.62471 23.5038C3.39489 24.3264 4.33845 25.0966 5.42718 25.8062V25.8103C5.76186 26.028 6.11267 26.2417 6.47558 26.4474C7.9998 27.3184 9.76193 28.0764 11.7095 28.7055C12.1652 28.8547 12.6289 28.9918 13.1047 29.1248C14.766 29.5845 16.5443 29.9515 18.4072 30.2095C20.5081 30.5039 22.7178 30.6612 25.0001 30.6612C27.0848 30.6612 29.109 30.5321 31.0405 30.2862C32.8913 30.0523 34.6535 29.7136 36.3107 29.2821Z" fill="#FFC05A" />
      <path d="M47.794 23.028H47.798C47.5117 23.3667 47.1972 23.7014 46.8504 24.028C47.1045 23.3707 46.7416 22.7256 46.1367 22.4312C46.5722 22.5925 47.1408 22.3304 47.4472 21.3909C47.6125 21.8344 47.7376 22.3748 47.794 23.028Z" fill="#A0694A" />
      <path d="M46.2615 19.79C46.7011 20.0884 47.1446 20.5844 47.447 21.3909C47.1406 22.3304 46.572 22.5925 46.1365 22.4312C46.1123 22.4231 46.0881 22.411 46.0599 22.399C45.4672 22.1046 45.1768 21.0038 46.2615 19.79Z" fill="#B8D3CF" />
      <path d="M46.1361 22.4312C46.741 22.7255 47.1039 23.3707 46.8498 24.028V24.032C46.4103 24.4473 45.9224 24.8506 45.3901 25.2417C45.0756 24.4675 44.6926 23.8143 44.2974 23.2699C44.2087 23.1489 44.12 23.032 44.0312 22.9231C44.6966 22.2336 45.4789 22.157 46.0595 22.3989C46.0877 22.411 46.1119 22.4231 46.1361 22.4312Z" fill="#B8D3CF" />
      <path d="M44.5773 17.5682C45.2467 16.3989 48.9161 19.6207 45.7789 19.5239C45.2225 19.2941 44.8596 18.8223 44.5007 18.3424C44.4483 17.9836 44.4846 17.7336 44.5773 17.5682Z" fill="#E7F2F1" />
      <path d="M45.7784 19.5239C45.9316 19.5884 46.097 19.6771 46.2623 19.79C45.1776 21.0037 45.4679 22.1046 46.0607 22.3989C45.48 22.157 44.6978 22.2336 44.0324 22.9231C43.9276 22.7941 43.8268 22.6731 43.7219 22.5602C42.8026 21.5441 41.9517 21.0924 41.8711 21.0521C45.7945 21.8868 43.9598 18.9553 42.6735 18.7819H42.6695C42.6534 18.2497 42.5042 17.7295 42.2501 17.2658C42.2501 17.2658 43.6292 17.1811 44.5002 18.3424C44.859 18.8223 45.222 19.294 45.7784 19.5239Z" fill="#6FCEAE" />
      <path d="M37.167 39.1774L37.1711 39.1855V41.1452C37.1711 41.1452 33.9492 44.3711 25.0015 44.3388C16.0538 44.3711 12.832 41.1452 12.832 41.1452V39.1855L12.836 39.1774C7.02138 36.8387 3.74713 33.1894 1.96484 29.4757C2.15033 29.391 7.8722 26.7135 9.28351 31.8709C9.86013 33.9233 12.4287 39.129 18.4449 35.6371C19.7635 35.0201 21.3523 33.4838 25.0015 33.4838C28.6508 33.4838 30.2395 35.0201 31.5581 35.6371C37.5743 39.129 40.1429 33.9233 40.7195 31.8709C42.4857 26.1732 47.8567 29.3668 48.0382 29.4757C46.2559 33.1894 42.9816 36.8387 37.167 39.1774Z" fill="#20BAB6" />
      <path d="M44.5774 17.5682C44.4847 17.7335 44.4484 17.9835 44.5008 18.3424C43.6298 17.1811 42.2508 17.2658 42.2508 17.2658C42.1096 17.0037 41.9322 16.7617 41.7266 16.54C41.7266 16.54 43.9484 14.2415 44.5774 17.5682Z" fill="#B8D3CF" />
      <path d="M39.1418 25.8546C39.0127 25.7578 38.8676 25.6812 38.7103 25.6207C37.9401 25.3345 37.9079 24.5643 37.9079 24.4312C37.9079 24.4272 37.9079 24.4272 37.9079 24.4231C38.0127 23.9917 37.9926 23.5401 37.8555 23.1207C39.8434 22.7054 41.1257 21.9392 41.8636 21.0481C41.8676 21.0481 41.8676 21.0481 41.8717 21.0521C41.9523 21.0925 42.8031 21.5441 43.7225 22.5602C40.5491 22.6731 42.8193 25.0965 44.2991 23.2699C44.6943 23.8143 45.0774 24.4675 45.3919 25.2417C44.037 26.2377 42.4039 27.1288 40.545 27.8869C40.1579 27.8466 39.916 27.3546 39.7789 26.8466C39.7628 26.8063 39.7547 26.7619 39.7426 26.7216C39.6499 26.3627 39.4321 26.0643 39.1418 25.8546Z" fill="#7F5D46" />
      <path d="M44.0342 22.9231C44.1229 23.032 44.2116 23.1489 44.3003 23.2699C42.8204 25.0965 40.5502 22.6731 43.7237 22.5602C43.8285 22.6731 43.9293 22.7941 44.0342 22.9231Z" fill="#E7F2F1" />
      <path d="M42.6738 18.782C43.9601 18.9554 45.7948 21.8869 41.8713 21.0522C41.8673 21.0481 41.8673 21.0481 41.8633 21.0481C41.9762 20.9151 42.077 20.778 42.1617 20.6369C42.5367 20.036 42.6939 19.3989 42.6697 18.782H42.6738Z" fill="#B8D3CF" />
      <path d="M42.6683 18.7819C42.6925 19.3989 42.5352 20.036 42.1602 20.6368C41.5272 20.915 41.0957 20.6812 40.8255 20.3908C40.5554 20.1005 40.1723 19.9634 39.7771 19.9916C38.9344 20.0562 38.5715 19.3223 38.5715 19.3223L38.5352 19.3182C38.5876 19.0037 38.5795 18.665 38.5069 18.3182C38.2892 17.2497 37.9908 16.3988 37.6602 15.7174C38.4263 15.4029 39.1682 15.3464 39.8336 15.4795C39.4787 17.7739 41.4425 19.3223 41.2046 16.0803C41.3941 16.2174 41.5675 16.3706 41.7247 16.54C41.9304 16.7617 42.1078 17.0037 42.2489 17.2658C42.503 17.7295 42.6522 18.2497 42.6683 18.7819Z" fill="#C49E83" />
      <path d="M42.162 20.6368C42.0773 20.7779 41.9765 20.915 41.8636 21.0481C41.1257 21.9392 39.8434 22.7054 37.8555 23.1207C37.7426 22.7618 37.5369 22.4231 37.2507 22.1449C36.6982 21.6086 35.7305 21.1812 35.7305 21.1812C37.3192 21.4231 38.3474 20.5279 38.537 19.3182L38.5733 19.3223C38.5733 19.3223 38.9362 20.0562 39.7789 19.9916C40.1741 19.9634 40.5572 20.1005 40.8273 20.3908C41.0975 20.6812 41.5289 20.915 42.162 20.6368Z" fill="#9E4949" />
      <path d="M41.207 16.0803C41.4449 19.3223 39.4811 17.7739 39.836 15.4795C39.8965 15.4916 39.957 15.5037 40.0134 15.5198C40.4529 15.6287 40.8562 15.8263 41.207 16.0803Z" fill="#E7F2F1" />
      <path d="M37.2007 14.8989C36.7128 12.415 41.8621 13.6448 40.0113 15.5199C39.9548 15.5037 39.8943 15.4916 39.8339 15.4795C39.1685 15.3465 38.4266 15.4029 37.6604 15.7174C37.5153 15.411 37.358 15.1408 37.2007 14.9029V14.8989Z" fill="#E7F2F1" />
      <path d="M39.7783 26.8466C39.9154 27.3547 40.1574 27.8467 40.5445 27.887C39.238 28.4192 37.8186 28.887 36.3105 29.2822C34.2177 28.9354 34.125 27.27 34.125 27.27V27.266C34.2218 27.2539 34.3105 27.2458 34.3952 27.2337C36.1654 26.9474 37.1331 25.9555 37.6493 25.0603C37.7662 24.8587 37.8509 24.649 37.9073 24.4313C37.9073 24.5643 37.9396 25.3345 38.7098 25.6208C38.867 25.6813 39.0122 25.7579 39.1412 25.8547C37.2178 26.52 38.0968 28.0523 39.7783 26.8466Z" fill="#E0BB86" />
      <path d="M39.7425 26.7216C39.7546 26.7619 39.7627 26.8062 39.7788 26.8466C38.0973 28.0522 37.2183 26.5199 39.1417 25.8546C39.432 26.0643 39.6498 26.3627 39.7425 26.7216Z" fill="#E7F2F1" />
      <path d="M38.5097 18.3182C38.5822 18.6649 38.5903 19.0037 38.5379 19.3182C38.3484 20.5279 37.3201 21.4231 35.7314 21.1811C34.7838 20.919 34.2878 20.7416 33.4531 20.54C34.812 19.7254 33.2394 18.048 34.8886 17.7617C37.5863 17.4553 35.5257 14.9996 36.5298 14.0842C36.687 14.2254 36.8322 14.3867 36.9653 14.56C37.0459 14.6649 37.1225 14.7778 37.2032 14.8988V14.9028C37.3604 15.1407 37.5177 15.4109 37.6629 15.7173C37.9935 16.3988 38.2919 17.2496 38.5097 18.3182Z" fill="#AD6A6A" />
      <path d="M37.909 24.4231V24.4312C37.8525 24.6489 37.7679 24.8586 37.6509 25.0602C37.1348 25.9554 36.167 26.9474 34.3968 27.2337C34.3122 27.2458 34.2234 27.2538 34.1267 27.2659C33.538 27.3425 32.7597 27.4312 31.8968 27.4877C29.0782 27.6692 25.3564 27.4554 24.3281 24.9352C27.675 26.9151 27.4451 23.9594 29.7274 24.3465C31.4936 24.6651 31.8121 26.2095 33.5702 24.9675C33.7839 25.2941 34.1146 25.6086 34.5178 25.4836C35.0017 25.3102 35.0541 24.8546 34.9533 24.411C36.4211 24.1651 36.159 22.536 37.8566 23.1207C37.9937 23.5401 38.0138 23.9917 37.909 24.4231Z" fill="#AD6A6A" />
      <path d="M37.2496 22.1449C37.5359 22.4232 37.7415 22.7619 37.8544 23.1208C36.1568 22.5361 36.4189 24.1651 34.9512 24.4111C34.9108 24.2377 34.8463 24.0684 34.7778 23.9151C33.9794 22.6933 32.9753 23.3829 33.3261 24.4958C33.3665 24.6087 33.4511 24.7901 33.5681 24.9676C31.81 26.2095 31.4914 24.6651 29.7253 24.3466C27.443 23.9595 27.6728 26.9152 24.326 24.9353C24.2131 24.6571 24.1324 24.3547 24.0881 24.0159C24.1728 23.8426 24.2695 23.6651 24.3744 23.4877C24.3744 23.4877 25.1929 22.2296 23.3945 21.0401C24.197 20.9796 24.947 20.532 25.5155 19.8868C26.576 18.6771 27.4793 18.2134 28.1849 17.4271C28.8301 19.5965 29.818 19.8465 31.0882 20.0683C32.185 20.2578 32.8947 20.403 33.4511 20.5401C34.2858 20.7417 34.7818 20.9191 35.7294 21.1812C35.7294 21.1812 36.6972 21.6086 37.2496 22.1449ZM28.6406 22.782C29.0438 22.6893 29.2454 22.0643 29.0882 21.3869C28.9309 20.7054 28.4753 20.2336 28.072 20.3264C27.6648 20.4191 27.4672 21.0441 27.6244 21.7215C27.7817 22.399 28.2374 22.8748 28.6406 22.782Z" fill="#C49E83" />
      <path d="M36.5304 14.0843C35.5263 14.9996 37.5868 17.4553 34.8892 17.7618C33.24 18.0481 34.8126 19.7255 33.4537 20.54C32.8973 20.4029 32.1876 20.2578 31.0908 20.0683C29.8206 19.8465 28.8327 19.5965 28.1875 17.4271C28.4859 17.0924 28.752 16.6972 28.9819 16.165C29.1351 15.8061 29.1794 15.423 29.1149 15.0601H29.119C29.123 15.0601 29.4577 14.6408 30.2924 14.1851C30.7279 13.9432 31.3085 13.6891 32.0505 13.4835C32.4779 13.3625 32.9618 13.2577 33.5061 13.1811C34.611 13.0198 35.7239 13.3504 36.5304 14.0843ZM34.9537 15.3303C34.865 14.1407 33.869 14.2416 33.6795 15.1771C33.6392 15.4472 33.615 16.2456 34.1392 16.3505C34.7199 16.4432 34.9174 15.8142 34.9537 15.3303ZM32.8852 18.2537C33.4174 17.1166 32.4497 16.7013 31.7924 17.4674C31.6109 17.6932 31.1795 18.415 31.6109 18.782C32.0989 19.161 32.6029 18.6852 32.8852 18.2537Z" fill="#7F5D46" />
      <path d="M34.9509 24.4111C35.0517 24.8546 34.9993 25.3103 34.5154 25.4837C34.1122 25.6087 33.7815 25.2941 33.5678 24.9675C33.4509 24.7901 33.3662 24.6086 33.3259 24.4957C32.9751 23.3828 33.9791 22.6933 34.7775 23.9151C34.8461 24.0683 34.9106 24.2377 34.9509 24.4111Z" fill="#E7F2F1" />
      <path d="M34.1238 27.27C34.1238 27.27 34.2165 28.9354 36.3093 29.2822C34.652 29.7136 32.8899 30.0523 31.0391 30.2862C32.2931 29.2499 31.8939 27.4878 31.8939 27.4878C32.7568 27.4313 33.5351 27.3426 34.1238 27.266V27.27Z" fill="#A0694A" />
      <path d="M33.6791 15.1771C33.8686 14.2416 34.8646 14.1408 34.9533 15.3303C34.917 15.8142 34.7194 16.4432 34.1387 16.3505C33.6145 16.2456 33.6387 15.4472 33.6791 15.1771Z" fill="#E7F2F1" />
      <path d="M31.789 17.4674C32.4462 16.7012 33.414 17.1166 32.8817 18.2537C32.5995 18.6851 32.0954 19.161 31.6075 18.7819C31.1761 18.415 31.6075 17.6932 31.789 17.4674Z" fill="#E7F2F1" />
      <path d="M27.1798 13.0843C30.3371 9.7455 33.1517 11.177 32.0468 13.4835C31.3049 13.6891 30.7242 13.9432 30.2887 14.1851C31.4904 12.7133 30.196 11.7617 28.4419 13.8504C28.3814 13.794 28.3129 13.7415 28.2443 13.6931C27.9218 13.4673 27.5589 13.2657 27.1758 13.0883L27.1798 13.0843Z" fill="#6FCEAE" />
      <path d="M24.3257 24.9352C25.3539 27.4554 29.0758 27.6692 31.8944 27.4877C31.8944 27.4877 32.2936 29.2498 31.0395 30.2861C29.108 30.5321 27.0838 30.6611 24.9991 30.6611C22.7168 30.6611 20.5071 30.5039 18.4062 30.2095C19.2208 29.8426 19.7087 29.0643 19.7087 29.0643V29.0603C20.2974 29.1692 20.8458 29.2418 21.2894 29.2579C22.4991 29.0805 22.8055 28.403 23.0515 27.3748C23.2652 26.4836 23.4265 25.3304 24.0878 24.0159C24.1321 24.3546 24.2128 24.657 24.3257 24.9352ZM25.6281 29.4716C26.9507 29.2256 26.7128 28.1369 25.6402 28.0442C25.3297 28.0321 24.4346 28.1006 24.3822 28.7014C24.3539 29.3547 25.0797 29.4958 25.6281 29.4716Z" fill="#E0BB86" />
      <path d="M28.4453 13.8504C30.1994 11.7616 31.4937 12.7132 30.2921 14.185C29.4574 14.6407 29.1227 15.0601 29.1187 15.0601H29.1147C29.0421 14.6004 28.8123 14.1689 28.4453 13.8504Z" fill="#D6EAE8" />
      <path d="M29.088 21.3868C29.2453 22.0643 29.0437 22.6893 28.6404 22.782C28.2372 22.8748 27.7815 22.3989 27.6243 21.7215C27.467 21.0441 27.6646 20.4191 28.0719 20.3263C28.4751 20.2336 28.9308 20.7054 29.088 21.3868Z" fill="#E7F2F1" />
      <path d="M29.1115 15.0601C29.176 15.423 29.1317 15.8061 28.9785 16.165C28.7486 16.6972 28.4825 17.0924 28.1841 17.4271C27.4784 18.2134 26.5752 18.6771 25.5147 19.8868C24.9461 20.532 24.1961 20.9796 23.3937 21.0401C23.0671 21.0642 22.7324 21.0239 22.4017 20.911C21.9421 20.7497 21.4259 20.536 20.7969 20.3142C22.5913 19.8263 23.5792 18.6811 24.0873 17.8303C24.4582 17.2093 24.9623 16.6811 25.555 16.2658C27.6236 14.8182 26.4704 12.7859 26.4704 12.7859C26.7123 12.8786 26.9502 12.9794 27.176 13.0883C27.5591 13.2657 27.922 13.4674 28.2446 13.6932C28.3131 13.7415 28.3817 13.794 28.4422 13.8504C28.8091 14.169 29.0389 14.6004 29.1115 15.0601Z" fill="#AD6A6A" />
      <path d="M26.4719 12.7859C26.4719 12.7859 27.6251 14.8182 25.5566 16.2658C24.9638 16.6811 24.4598 17.2094 24.0888 17.8303C23.5807 18.6812 22.5928 19.8263 20.7984 20.3143C20.1049 20.0723 19.2661 19.8263 18.2056 19.6489C18.0968 19.6288 17.9919 19.6046 17.8952 19.5723C17.8911 19.5723 17.8911 19.5723 17.8871 19.5723C16.8467 19.2376 16.4959 18.2094 16.7217 17.2255C16.9395 16.2698 17.2419 15.4553 17.5726 14.7698C18.0081 13.8787 18.5 13.2053 18.9436 12.7093C19.0766 12.5601 19.2057 12.423 19.3307 12.3061C19.8508 11.8061 20.5605 11.5682 21.2783 11.6407C22.5001 11.7698 24.6412 12.0803 26.4719 12.7859ZM23.3993 16.0319C24.0444 15.7214 23.8065 14.9553 23.5041 14.4432C22.5847 13.3101 21.6533 14.0964 22.117 15.169C22.2662 15.4714 22.7985 16.29 23.3993 16.0319ZM20.8468 18.4513C22.1372 17.7578 21.5283 16.7053 20.3831 16.9634C20.0565 17.0521 19.1492 17.4231 19.2944 18.0602C19.4839 18.7457 20.2863 18.6529 20.8468 18.4513Z" fill="#C49E83" />
      <path d="M25.6417 28.0442C26.7143 28.1369 26.9522 29.2257 25.6296 29.4716C25.0812 29.4958 24.3554 29.3547 24.3836 28.7015C24.436 28.1006 25.3312 28.0321 25.6417 28.0442Z" fill="#E7F2F1" />
      <path d="M23.3972 21.0401C25.1956 22.2296 24.377 23.4877 24.377 23.4877C24.2722 23.6651 24.1754 23.8426 24.0907 24.016C23.4294 25.3305 23.2681 26.4837 23.0544 27.3749C20.0584 28.5765 18.1067 27.0039 17.8648 25.3628C17.7842 24.8023 17.4293 24.3023 16.9414 24.0079C15.3325 23.0361 15.514 20.7014 15.514 20.7014V20.6974C16.4535 19.9312 17.4374 19.4917 17.889 19.5723H17.8971C17.9938 19.6046 18.0987 19.6288 18.2075 19.6489C19.2681 19.8264 20.1068 20.0723 20.8003 20.3143C21.4294 20.5361 21.9455 20.7498 22.4052 20.9111C22.7358 21.024 23.0705 21.0643 23.3972 21.0401ZM20.514 25.7539C21.2278 25.8103 21.4092 25.0281 21.4052 24.4353C21.1874 22.9958 19.9818 23.2095 19.8406 24.3668C19.8164 24.7015 19.8608 25.6732 20.514 25.7539Z" fill="#7F5D46" />
      <path d="M23.5023 14.4431C23.8048 14.9552 24.0427 15.7214 23.3975 16.0318C22.7967 16.2899 22.2644 15.4714 22.1152 15.1689C21.6515 14.0963 22.583 13.31 23.5023 14.4431Z" fill="#E7F2F1" />
      <path d="M23.0527 27.3748C22.8067 28.403 22.5003 29.0805 21.2906 29.2579C20.847 29.2418 20.2986 29.1692 19.7099 29.0603C18.5163 28.8466 17.1655 28.4958 16.2179 28.2296C15.0768 27.9111 14.0929 27.1369 13.6251 26.0562C12.9921 24.5925 13.4195 23.1892 14.2259 22.0642C14.5969 21.54 15.0485 21.0803 15.5123 20.6973V20.7013C15.5123 20.7013 15.3308 23.036 16.9397 24.0078C17.4276 24.3022 17.7825 24.8022 17.8631 25.3627C18.105 27.0038 20.0567 28.5764 23.0527 27.3748ZM16.2098 25.4433C16.1857 24.4554 15.1937 24.4231 14.9558 25.1691C14.8993 25.3869 14.8348 26.0401 15.351 26.1893C15.9236 26.3345 16.1534 25.8425 16.2098 25.4433Z" fill="#AD6A6A" />
      <path d="M21.4014 24.4352C21.4054 25.028 21.224 25.8103 20.5102 25.7538C19.857 25.6732 19.8127 24.7014 19.8368 24.3667C19.978 23.2094 21.1836 22.9957 21.4014 24.4352Z" fill="#E7F2F1" />
      <path d="M20.3817 16.9633C21.5269 16.7053 22.1357 17.7577 20.8454 18.4513C20.2849 18.6529 19.4825 18.7456 19.2929 18.0601C19.1478 17.423 20.0551 17.0521 20.3817 16.9633Z" fill="#E7F2F1" />
      <path d="M11.2789 21.7779C12.7588 21.5118 14.2265 22.0642 14.2265 22.0642C13.4201 23.1892 12.9927 24.5925 13.6257 26.0562C14.0935 27.1369 15.0774 27.9111 16.2185 28.2296C17.1661 28.4958 18.5169 28.8466 19.7105 29.0603V29.0643C19.7105 29.0643 19.2226 29.8426 18.4081 30.2095C16.5451 29.9514 14.7669 29.5845 13.1056 29.1248C13.3193 26.1409 11.662 27.653 11.7104 28.7055C9.76276 28.0764 8.00064 27.3183 6.47642 26.4474C6.44013 25.8385 6.66997 25.3143 7.00465 24.8788C7.25466 24.5522 7.56112 24.278 7.85548 24.0562C8.29903 23.7215 8.73855 23.3828 9.14582 23.0118C9.26276 22.911 9.37566 22.8021 9.48453 22.6933C10.0087 22.165 10.6458 21.8989 11.2789 21.7779ZM10.8596 25.8102C11.4805 25.7699 11.541 25.0764 11.4644 24.5643C11.0975 23.3505 10.0853 23.6852 10.1095 24.6973C10.1297 24.9877 10.291 25.8223 10.8596 25.8102Z" fill="#7F5D46" />
      <path d="M18.9384 12.7092H18.9424C18.4989 13.2052 18.0069 13.8786 17.5714 14.7697C17.5714 14.7697 17.3335 14.5601 17.019 14.298C16.8375 14.1447 16.64 14.0238 16.4262 13.9391C16.4262 13.9391 16.4222 13.9391 16.4222 13.9351C16.1924 13.806 15.9424 13.3584 15.7609 12.9794C15.5875 12.6165 15.6964 12.1649 16.0432 11.9592C17.5432 11.064 18.9384 12.7092 18.9384 12.7092Z" fill="#E7F2F1" />
      <path d="M9.48731 19.6933C9.39457 19.2941 9.40667 18.8788 9.5236 18.4876C9.59619 18.2296 9.71312 17.9876 9.87038 17.7618C10.0801 17.4674 10.3099 17.1892 10.5478 16.9231C11.068 16.3505 11.6486 15.8424 12.2293 15.3989C12.572 15.1368 12.9108 14.8948 13.2374 14.6851C13.6003 14.4432 13.9471 14.2376 14.2576 14.0601C14.931 13.6771 15.7334 13.6408 16.4229 13.9351C16.4229 13.9392 16.4269 13.9392 16.4269 13.9392C16.6407 14.0238 16.8382 14.1448 17.0197 14.298C17.3342 14.5601 17.5721 14.7698 17.5721 14.7698C17.2415 15.4553 16.939 16.2698 16.7213 17.2255C16.4955 18.2094 16.8463 19.2376 17.8866 19.5723C17.435 19.4917 16.4511 19.9312 15.5116 20.6973C15.0479 21.0804 14.5963 21.5401 14.2253 22.0643C14.2253 22.0643 12.7575 21.5119 11.2777 21.778C10.7615 21.6006 10.326 21.1691 9.98732 20.7014C9.91877 20.6046 9.85022 20.5078 9.78974 20.411C9.64457 20.1852 9.5478 19.9433 9.48731 19.6933ZM14.7011 17.2941C15.0035 16.669 14.943 16.0158 14.568 15.8344C14.193 15.6569 13.6446 16.0239 13.3422 16.6489C13.0398 17.2779 13.1003 17.9312 13.4753 18.1086C13.8503 18.29 14.3987 17.9231 14.7011 17.2941Z" fill="#E0BB86" />
      <path d="M12.228 15.3989C11.6473 15.8424 11.0667 16.3505 10.5465 16.9231C10.2723 16.8707 10.0263 16.8344 9.80455 16.8182V16.8142C9.38519 15.794 11.4981 13.8384 12.228 15.3989Z" fill="#E7F2F1" />
      <path d="M14.9554 25.1691C15.1933 24.4231 16.1852 24.4554 16.2094 25.4433C16.153 25.8425 15.9231 26.3344 15.3505 26.1893C14.8344 26.0401 14.8989 25.3868 14.9554 25.1691Z" fill="#E7F2F1" />
      <path d="M14.5669 15.8344C14.9419 16.0158 15.0024 16.6691 14.7 17.2941C14.3976 17.9231 13.8492 18.2901 13.4742 18.1086C13.0992 17.9312 13.0387 17.2779 13.3411 16.6489C13.6435 16.0239 14.1919 15.6569 14.5669 15.8344Z" fill="#E7F2F1" />
      <path d="M11.7081 28.7054C11.6597 27.653 13.317 26.1409 13.1033 29.1248C12.6274 28.9917 12.1637 28.8546 11.7081 28.7054Z" fill="#E7F2F1" />
      <path d="M13.2379 14.6851C12.9112 14.8947 12.5725 15.1367 12.2298 15.3988C11.4999 13.8383 9.38699 15.7939 9.80635 16.8141V16.8182C9.16924 16.7577 8.72569 16.8343 8.37891 16.9915C8.63697 13.4754 11.9717 12.3423 13.2379 14.6851Z" fill="#6FCEAE" />
      <path d="M11.4647 24.5644C11.5413 25.0765 11.4808 25.77 10.8598 25.8103C10.2913 25.8224 10.13 24.9878 10.1098 24.6974C10.0856 23.6853 11.0977 23.3506 11.4647 24.5644Z" fill="#E7F2F1" />
      <path d="M9.98928 20.7013C10.328 21.169 10.7635 21.6005 11.2796 21.7779C10.6465 21.8989 10.0094 22.165 9.48524 22.6933C9.37637 22.8021 9.26346 22.911 9.14652 23.0118C7.16665 23.1328 6.44487 22.1045 6.69084 20.9836C6.70294 20.9594 6.70697 20.9352 6.711 20.911C6.96504 19.919 7.96505 18.8706 9.52153 18.4875H9.52556C9.40863 18.8787 9.39653 19.294 9.48927 19.6932C6.63035 21.1529 7.9328 22.915 9.98928 20.7013Z" fill="#6FCEAE" />
      <path d="M10.5493 16.923C10.3114 17.1891 10.0816 17.4674 9.8719 17.7617C9.71464 17.9875 9.59771 18.2295 9.52513 18.4875H9.52109C7.96462 18.8706 6.9646 19.919 6.71056 20.911C6.71863 20.8868 6.72669 20.8585 6.73072 20.8303C6.8154 20.1206 6.47266 18.7617 6.47266 18.7617C6.90411 18.4432 7.18638 18.0843 7.46058 17.7617C7.73074 17.4472 7.99284 17.169 8.37995 16.9915C8.72672 16.8343 9.17028 16.7577 9.80739 16.8182C10.0292 16.8343 10.2751 16.8706 10.5493 16.923Z" fill="#B8D3CF" />
      <path d="M9.79119 20.411C9.85168 20.5078 9.92023 20.6045 9.98878 20.7013C7.93229 22.9151 6.62985 21.1529 9.48877 19.6932C9.54926 19.9432 9.64603 20.1852 9.79119 20.411Z" fill="#D6EAE8" />
      <path d="M6.68958 20.9836C6.44361 22.1045 7.1654 23.1328 9.14527 23.0118C8.738 23.3828 8.29848 23.7215 7.85492 24.0562C7.56056 24.278 7.25411 24.5522 7.0041 24.8788C6.58071 23.0158 4.621 22.8667 5.42746 25.8062C4.33874 25.0965 3.39517 24.3264 2.625 23.5038C3.06049 23.2981 3.30646 22.9957 3.46776 22.6408V22.6368C3.78631 21.9392 3.78228 21.04 4.27019 20.2819C4.31454 20.2134 4.3589 20.1489 4.41132 20.0844C4.33067 22.1166 6.26619 22.5158 6.68958 20.9836Z" fill="#B8D3CF" />
      <path d="M6.47312 18.7618C6.47312 18.7618 6.81587 20.1207 6.73119 20.8304C6.72716 20.8586 6.71909 20.8869 6.71103 20.9111C6.707 20.9353 6.70296 20.9595 6.69087 20.9837C6.26747 22.5159 4.33196 22.1167 4.4126 20.0844C4.64648 19.7861 4.9731 19.5199 5.44891 19.3062C5.4852 19.286 5.52553 19.2699 5.56585 19.2538C5.93279 19.1127 6.22715 18.9433 6.47312 18.7618Z" fill="#E7F2F1" />
      <path d="M5.44813 19.3062C3.436 18.161 7.20623 15.5077 7.46026 17.7618C7.18606 18.0844 6.9038 18.4432 6.47234 18.7618C6.22637 18.9432 5.93201 19.1126 5.56507 19.2537C5.52475 19.2699 5.48442 19.286 5.44813 19.3062Z" fill="#E7F2F1" />
      <path d="M7.00366 24.8788C6.66897 25.3143 6.43913 25.8385 6.47542 26.4474C6.11251 26.2417 5.7617 26.028 5.42702 25.8103V25.8062C4.62055 22.8667 6.58026 23.0159 7.00366 24.8788Z" fill="#E7F2F1" />
      <path d="M4.2696 20.282C3.78169 21.0401 3.78573 21.9393 3.46717 22.6369C1.05988 19.9029 3.7696 18.8021 4.2696 20.282Z" fill="#E7F2F1" />
      <path d="M48.037 29.4757C31.0408 48.6768 6.39844 35.3077 6.39844 35.3077C8.08758 36.7895 10.2005 38.1182 12.8348 39.1779L12.8308 39.1859V41.1453C12.8308 41.1453 16.0526 44.3711 25.0004 44.3389C33.9481 44.3711 37.1699 41.1453 37.1699 41.1453V39.1855L37.1659 39.1775C42.9805 36.8387 46.2547 33.1895 48.037 29.4757Z" fill="#21AAA3" />
      <path d="M22.5641 41.871C22.55 41.871 22.5359 41.8702 22.5214 41.869C19.5923 41.5589 16.8935 41.0028 14.4999 40.2153C14.2886 40.146 14.1733 39.9182 14.243 39.7065C14.3124 39.4948 14.5402 39.3798 14.7519 39.4496C17.091 40.219 19.7338 40.7629 22.6065 41.067C22.8278 41.0904 22.9883 41.2891 22.9649 41.5105C22.9428 41.7174 22.7677 41.871 22.5641 41.871Z" fill="#1FA097" />
      <path d="M27.4339 41.8711C27.2303 41.8711 27.0557 41.7175 27.0335 41.5102C27.0101 41.2888 27.1706 41.09 27.392 41.0666C30.2856 40.7602 32.9453 40.2102 35.2978 39.4323C35.5095 39.3622 35.7373 39.4771 35.807 39.6884C35.8772 39.8997 35.7623 40.1279 35.551 40.1977C33.1441 40.9941 30.4275 41.5562 27.4771 41.8687C27.4626 41.8703 27.448 41.8711 27.4339 41.8711Z" fill="#1FA097" />
    </g>
    <defs>
      <clipPath id="clip0_2701_8612">
        <rect width="50" height="50" fill="white" />
      </clipPath>
    </defs>
  </svg>


);

