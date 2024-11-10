import React from 'react';

type PizzaIconProps = {
  className?: string;
  onClick?: () => void;
};

export const PizzaIcon: React.FC<PizzaIconProps> = ({
  className,
  onClick }) => (

  <svg width="50"
    height="50"
    fill="None"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}>
    <path d="M50 24.1485C47.2754 20.3674 43.2823 16.8897 38.1909 13.95C33.2908 11.1208 27.3734 8.78975 20.5858 7.16309L18.6562 9.88193L18.6468 13.2184C18.6512 13.2195 18.6555 13.2208 18.6599 13.222L0.00947266 39.5003L0 42.8369L49.9905 30.8303L50 27.4937C49.997 27.4895 49.9936 27.4853 49.9905 27.4811L50 24.1485Z" fill="#FEC377" />
    <path d="M49.9999 27.4937L49.9905 30.8303L0 42.8369L0.00947266 39.5004L49.9999 27.4937Z" fill="#FF9911" />
    <path d="M38.1892 17.2951C43.2809 20.2348 47.2736 23.7123 49.9982 27.4937L0.0078125 39.5004L20.584 10.5083C27.3717 12.1349 33.289 14.466 38.1892 17.2951Z" fill="#FFEB9A" />
    <path d="M49.9994 24.1486L49.99 27.485L45.3008 28.6116L45.3103 25.2751L49.9994 24.1486Z" fill="#FF9911" />
    <path d="M45.3127 25.2752L45.3032 28.6116C42.6231 25.2585 38.927 22.1719 34.336 19.5213C31.9714 18.1561 29.3693 16.9066 26.5469 15.7964L26.5563 12.46C29.3788 13.5703 31.9809 14.8198 34.3455 16.1849C38.9365 18.8354 42.6326 21.9221 45.3127 25.2752Z" fill="#FFA834" />
    <path d="M19.9894 10.2485C19.5496 10.1233 19.1058 10.0011 18.6579 9.88208L18.6484 13.2186C19.0963 13.3375 19.54 13.4597 19.9799 13.585C22.2832 14.241 24.4743 14.9811 26.5467 15.7964L26.5562 12.46C24.4838 11.6447 22.2927 10.9044 19.9894 10.2485Z" fill="#FF9911" />
    <path d="M38.191 13.95C43.2825 16.8898 47.2755 20.3673 50.0001 24.1486L45.3108 25.2752C42.6308 21.9221 38.9347 18.8355 34.3437 16.1849C29.9112 13.626 24.6447 11.4735 18.6562 9.88206L20.5858 7.16321C27.3735 8.78977 33.291 11.1208 38.191 13.95Z" fill="#FEC377" />
    <path d="M20.2568 19.8315C21.3491 19.1968 21.8958 18.3661 21.8981 17.5343L21.9039 15.5068C21.9038 15.5313 21.9017 15.5558 21.9008 15.5801C21.9366 14.7135 21.3827 13.8394 20.2374 13.1781C19.5165 12.7619 18.6498 12.4818 17.7342 12.3369L13.4784 18.334L13.4727 20.3614C15.6324 21.0729 18.4235 20.897 20.2568 19.8315Z" fill="#FF5023" />
    <path d="M32.7575 21.7722C32.7574 21.7966 32.7553 21.8208 32.7544 21.8453C32.7901 20.9787 32.236 20.1044 31.0903 19.4429C28.8782 18.1658 25.3026 18.1658 23.1041 19.4434C22.0083 20.0802 21.4619 20.9141 21.4631 21.7487C21.4631 21.746 21.4628 21.7434 21.4628 21.7408L21.457 23.7682C21.4547 24.6107 22.0107 25.4543 23.1237 26.0969C25.3366 27.3745 28.9122 27.3744 31.1107 26.0969C32.2029 25.4622 32.7496 24.6317 32.7519 23.7998L32.7575 21.7722Z" fill="#FF5023" />
    <path d="M17.2529 24.4976C17.2528 24.522 17.2507 24.5462 17.2498 24.5706C17.2855 23.704 16.7314 22.8298 15.5857 22.1683C14.4415 21.5078 12.9329 21.1896 11.4381 21.212L7.52139 26.7315L7.51562 28.7589C7.55049 28.78 7.58389 28.8012 7.61963 28.8218C9.83252 30.0995 13.4082 30.0994 15.6059 28.8222C16.698 28.1875 17.2447 27.357 17.2471 26.5251L17.2529 24.4976Z" fill="#FF5023" />
    <path d="M26.4342 28.4335C24.2213 27.1559 20.6456 27.156 18.4472 28.4335C17.3519 29.0701 16.8058 29.9037 16.8068 30.7381C16.8068 30.7355 16.8065 30.7328 16.8065 30.7299L16.8008 32.7574C16.7984 33.5999 17.3546 34.4439 18.4683 35.0869C18.5024 35.1066 18.5382 35.1253 18.5731 35.1446L28.0921 32.8579C28.093 32.8348 28.0935 32.8117 28.0936 32.7885L28.0993 30.7611C28.0992 30.7842 28.0987 30.8073 28.0979 30.8305C28.1316 29.9655 27.5775 29.0936 26.4342 28.4335Z" fill="#FF5023" />
    <path d="M10.9296 31.1584C9.29629 30.2154 6.91982 29.9693 4.90264 30.4194L1.79482 34.7982L1.78906 36.8256C2.06484 37.1832 2.45537 37.5183 2.96357 37.8117C3.46943 38.1038 4.0459 38.3278 4.66025 38.486L12.2231 36.6702C12.4666 36.2986 12.5889 35.9064 12.5899 35.5139L12.5957 33.4865C12.5957 33.4907 12.5952 33.4949 12.5952 33.4989C12.6031 32.6526 12.048 31.8041 10.9296 31.1584Z" fill="#FF5023" />
    <path d="M41.941 25.7079C39.7281 24.4303 36.1524 24.4304 33.954 25.7079C32.8586 26.3445 32.3133 27.178 32.3149 28.012C32.3149 28.0091 32.3144 28.0061 32.3144 28.0032L32.3086 30.0306C32.3069 30.5955 32.5565 31.1611 33.0564 31.6663L43.3949 29.183L43.4007 27.1556C43.1476 26.6257 42.662 26.1242 41.941 25.7079Z" fill="#FF5023" />
    <path d="M21.904 15.5068L21.8982 17.5343C21.8959 18.3661 21.3491 19.1968 20.2569 19.8315C18.4236 20.897 15.6325 21.0729 13.4727 20.3615L13.4784 18.3341C15.6383 19.0455 18.4294 18.8695 20.2627 17.8041C21.355 17.1693 21.9017 16.3386 21.904 15.5068Z" fill="#CD2A01" />
    <path d="M20.2356 13.1781C22.4478 14.4553 22.4594 16.5265 20.2608 17.804C18.4275 18.8694 15.6364 19.0454 13.4766 18.334L17.7323 12.3369C18.648 12.4818 19.5146 12.7619 20.2356 13.1781Z" fill="#FF5023" />
    <path d="M32.7537 21.7721L32.748 23.7996C32.7456 24.6314 32.1988 25.462 31.1067 26.0966C28.9082 27.3743 25.3326 27.3743 23.1198 26.0966C22.0067 25.454 21.4508 24.6104 21.4531 23.7679L21.4589 21.7405C21.4566 22.583 22.0125 23.4265 23.1256 24.0692C25.3385 25.3467 28.9141 25.3467 31.1125 24.0692C32.2046 23.4345 32.7514 22.604 32.7537 21.7721Z" fill="#CD2A01" />
    <path d="M31.0885 19.4429C33.3014 20.7204 33.3131 22.7916 31.1145 24.0692C28.916 25.3469 25.3404 25.3469 23.1276 24.0692C20.9155 22.7921 20.9038 20.7209 23.1023 19.4434C25.3008 18.1658 28.8765 18.1657 31.0885 19.4429Z" fill="#FF5023" />
    <path d="M17.2489 24.4976L17.2432 26.525C17.2408 27.3568 16.694 28.1874 15.602 28.8221C13.4043 30.0992 9.82861 30.0992 7.61572 28.8217C7.57998 28.8011 7.54668 28.78 7.51172 28.7588L7.51748 26.7313C7.55234 26.7524 7.58574 26.7735 7.62148 26.7942C9.83438 28.0718 13.4101 28.0718 15.6077 26.7946C16.6998 26.16 17.2466 25.3293 17.2489 24.4976Z" fill="#CD2A01" />
    <path d="M15.5838 22.1683C17.7967 23.4458 17.8083 25.517 15.6098 26.7947C13.4121 28.0718 9.83643 28.0718 7.62354 26.7943C7.58779 26.7737 7.55449 26.7526 7.51953 26.7314L11.4361 21.2121C12.9311 21.1895 14.4397 21.5077 15.5838 22.1683Z" fill="#FF5023" />
    <path d="M28.101 30.761L28.0952 32.7884C28.0951 32.8116 28.0947 32.8346 28.0938 32.8579L28.0995 30.8304C28.1005 30.8073 28.101 30.7841 28.101 30.761Z" fill="#CD2A01" />
    <path d="M28.0989 30.8306L28.0933 32.858L18.5742 35.1446L18.58 33.1172L28.0989 30.8306Z" fill="#CD2A01" />
    <path d="M16.8008 32.7574L16.8065 30.73C16.8042 31.5726 17.3604 32.4165 18.4739 33.0595C18.5081 33.0792 18.5439 33.0979 18.5787 33.1172L18.573 35.1446C18.5381 35.1254 18.5023 35.1065 18.4682 35.0869C17.3546 34.4439 16.7984 33.6 16.8008 32.7574Z" fill="#FF3502" />
    <path d="M26.4324 28.4335C27.5757 29.0937 28.1298 29.9655 28.0959 30.8306L18.5769 33.1172C18.542 33.098 18.5062 33.0791 18.4721 33.0595C16.2592 31.7819 16.2476 29.7108 18.4452 28.4336C20.6438 27.1558 24.2195 27.1558 26.4324 28.4335Z" fill="#FF5023" />
    <path d="M12.5952 33.4866L12.5895 35.514C12.5884 35.9065 12.4661 36.2987 12.2227 36.6703L12.2284 34.6428C12.4719 34.2712 12.594 33.879 12.5952 33.4866Z" fill="#CD2A01" />
    <path d="M12.2287 34.6429L12.223 36.6704L4.66016 38.4862L4.66592 36.4588L12.2287 34.6429Z" fill="#CD2A01" />
    <path d="M4.66602 36.4587L4.66025 38.4861C4.046 38.3279 3.46943 38.1038 2.96357 37.8118C2.45537 37.5185 2.06504 37.1833 1.78906 36.8258L1.79482 34.7983C2.07061 35.1559 2.46113 35.491 2.96934 35.7844C3.4752 36.0763 4.05176 36.3005 4.66602 36.4587Z" fill="#FF3502" />
    <path d="M10.9277 31.1584C12.5594 32.1005 12.9929 33.4738 12.2271 34.6428L4.66416 36.4587C4.0499 36.3005 3.47334 36.0763 2.96748 35.7843C2.45928 35.491 2.06895 35.1558 1.79297 34.7983L4.90078 30.4195C6.91797 29.9692 9.29443 30.2154 10.9277 31.1584Z" fill="#FF5023" />
    <path d="M43.399 27.1556L43.3933 29.1832L33.0547 31.6666L33.0604 29.639L43.399 27.1556Z" fill="#CD2A01" />
    <path d="M32.3047 30.0307L32.3105 28.0033C32.3088 28.5682 32.5583 29.1338 33.0582 29.639L33.0524 31.6665C32.5525 31.1612 32.3031 30.5956 32.3047 30.0307Z" fill="#FF3502" />
    <path d="M41.9392 25.708C42.6601 26.1242 43.1458 26.6258 43.3988 27.1557L33.0602 29.639C31.8249 28.3903 32.1189 26.7735 33.9522 25.708C36.1508 24.4305 39.7263 24.4305 41.9392 25.708Z" fill="#FF5023" />
  </svg>


);

