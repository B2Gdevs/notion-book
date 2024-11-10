import React from 'react';

interface ColorfullLogoProps {
	onClick?: () => void;
	className?: string;
}

export const ColorfullLogo: React.FC<ColorfullLogoProps> = ({
	onClick,
	className,
}) => (
	<svg
		className={`${className} ${onClick ? 'cursor-pointer' : ''}`}
		viewBox='0 0 266 57'
		fill='none'
		xmlns='http://www.w3.org/2000/svg'
		data-testid='playwright-logo'
		onClick={onClick}
		onKeyDown={(event) => {
			if (event.key === 'Enter') {
				onClick?.();
			}
		}}
		width='188'
		height='40'
	>
		<title>Colorful Logo</title>
		<path
			d='M42.187 50.4639C39.9084 52.4235 37.3563 53.9274 34.5308 54.9756C31.7052 56.0238 28.7772 56.5479 25.7466 56.5479C23.4224 56.5479 21.1779 56.2402 19.0132 55.625C16.8713 55.0326 14.8547 54.1895 12.9634 53.0957C11.0949 51.9792 9.3859 50.6462 7.83643 49.0967C6.28695 47.5472 4.95394 45.8382 3.8374 43.9697C2.74365 42.0785 1.88916 40.0619 1.27393 37.9199C0.681478 35.7552 0.385254 33.5108 0.385254 31.1865C0.385254 28.8623 0.681478 26.6179 1.27393 24.4531C1.88916 22.2884 2.74365 20.2718 3.8374 18.4033C4.95394 16.5121 6.28695 14.7917 7.83643 13.2422C9.3859 11.6927 11.0949 10.3711 12.9634 9.27736C14.8547 8.16082 16.8713 7.30633 19.0132 6.71388C21.1779 6.09865 23.4224 5.79103 25.7466 5.79103C28.7772 5.79103 31.7052 6.31512 34.5308 7.3633C37.3563 8.38869 39.9084 9.89259 42.187 11.875L36.9917 20.4199C35.5562 18.8705 33.8586 17.6856 31.8989 16.8652C29.9393 16.0222 27.8885 15.6006 25.7466 15.6006C23.5819 15.6006 21.5539 16.0108 19.6626 16.8311C17.7713 17.6514 16.1193 18.7679 14.7065 20.1807C13.2938 21.5707 12.1772 23.2227 11.3569 25.1367C10.5366 27.028 10.1265 29.0446 10.1265 31.1865C10.1265 33.3285 10.5366 35.3451 11.3569 37.2363C12.1772 39.1048 13.2938 40.7455 14.7065 42.1582C16.1193 43.571 17.7713 44.6875 19.6626 45.5078C21.5539 46.3281 23.5819 46.7383 25.7466 46.7383C27.8885 46.7383 29.9393 46.3281 31.8989 45.5078C33.8586 44.6647 35.5562 43.4684 36.9917 41.919L42.187 50.4639ZM80.981 36.8604C80.981 39.5947 80.491 42.1468 79.5112 44.5166C78.5314 46.8636 77.1984 48.903 75.5122 50.6348C73.826 52.3438 71.8436 53.6996 69.5649 54.7022C67.3091 55.682 64.8823 56.1719 62.2847 56.1719C59.7098 56.1719 57.283 55.682 55.0044 54.7022C52.7485 53.6996 50.7661 52.3438 49.0571 50.6348C47.3709 48.903 46.0379 46.8636 45.0581 44.5166C44.0783 42.1468 43.5884 39.5947 43.5884 36.8604C43.5884 34.0804 44.0783 31.5055 45.0581 29.1358C46.0379 26.766 47.3709 24.7266 49.0571 23.0176C50.7661 21.2858 52.7485 19.93 55.0044 18.9502C57.283 17.9704 59.7098 17.4805 62.2847 17.4805C64.8823 17.4805 67.3091 17.9476 69.5649 18.8819C71.8436 19.7933 73.826 21.1035 75.5122 22.8125C77.1984 24.4987 78.5314 26.5381 79.5112 28.9307C80.491 31.3005 80.981 33.9437 80.981 36.8604ZM71.5815 36.8604C71.5815 35.3565 71.3309 34.0007 70.8296 32.793C70.3511 31.5625 69.6903 30.5143 68.8472 29.6485C68.0041 28.7598 67.0129 28.0876 65.8735 27.6319C64.757 27.1533 63.5607 26.9141 62.2847 26.9141C61.0086 26.9141 59.8009 27.1533 58.6616 27.6319C57.5451 28.0876 56.5653 28.7598 55.7222 29.6485C54.9019 30.5143 54.2524 31.5625 53.7739 32.793C53.2954 34.0007 53.0562 35.3565 53.0562 36.8604C53.0562 38.2731 53.2954 39.5833 53.7739 40.791C54.2524 41.9987 54.9019 43.0469 55.7222 43.9356C56.5653 44.8242 57.5451 45.5306 58.6616 46.0547C59.8009 46.556 61.0086 46.8067 62.2847 46.8067C63.5607 46.8067 64.757 46.5674 65.8735 46.0889C67.0129 45.6104 68.0041 44.9382 68.8472 44.0723C69.6903 43.2064 70.3511 42.1582 70.8296 40.9277C71.3309 39.6973 71.5815 38.3415 71.5815 36.8604ZM95.5415 55.4883H86.1421V4.3213H95.5415V55.4883ZM138.061 36.8604C138.061 39.5947 137.571 42.1468 136.591 44.5166C135.611 46.8636 134.278 48.903 132.592 50.6348C130.906 52.3438 128.924 53.6996 126.645 54.7022C124.389 55.682 121.962 56.1719 119.365 56.1719C116.79 56.1719 114.363 55.682 112.084 54.7022C109.829 53.6996 107.846 52.3438 106.137 50.6348C104.451 48.903 103.118 46.8636 102.138 44.5166C101.158 42.1468 100.668 39.5947 100.668 36.8604C100.668 34.0804 101.158 31.5055 102.138 29.1358C103.118 26.766 104.451 24.7266 106.137 23.0176C107.846 21.2858 109.829 19.93 112.084 18.9502C114.363 17.9704 116.79 17.4805 119.365 17.4805C121.962 17.4805 124.389 17.9476 126.645 18.8819C128.924 19.7933 130.906 21.1035 132.592 22.8125C134.278 24.4987 135.611 26.5381 136.591 28.9307C137.571 31.3005 138.061 33.9437 138.061 36.8604ZM128.662 36.8604C128.662 35.3565 128.411 34.0007 127.91 32.793C127.431 31.5625 126.77 30.5143 125.927 29.6485C125.084 28.7598 124.093 28.0876 122.954 27.6319C121.837 27.1533 120.641 26.9141 119.365 26.9141C118.089 26.9141 116.881 27.1533 115.742 27.6319C114.625 28.0876 113.645 28.7598 112.802 29.6485C111.982 30.5143 111.333 31.5625 110.854 32.793C110.375 34.0007 110.136 35.3565 110.136 36.8604C110.136 38.2731 110.375 39.5833 110.854 40.791C111.333 41.9987 111.982 43.0469 112.802 43.9356C113.645 44.8242 114.625 45.5306 115.742 46.0547C116.881 46.556 118.089 46.8067 119.365 46.8067C120.641 46.8067 121.837 46.5674 122.954 46.0889C124.093 45.6104 125.084 44.9382 125.927 44.0723C126.77 43.2064 127.431 42.1582 127.91 40.9277C128.411 39.6973 128.662 38.3415 128.662 36.8604ZM152.553 55.4883H143.222V18.8819H145.478L148.554 23.2227C150.058 21.8555 151.767 20.8073 153.681 20.0781C155.595 19.3262 157.578 18.9502 159.628 18.9502H167.866V28.2471H159.628C158.649 28.2471 157.726 28.4294 156.86 28.794C155.994 29.1585 155.242 29.6598 154.604 30.2979C153.966 30.9359 153.465 31.6878 153.1 32.5537C152.736 33.4196 152.553 34.3425 152.553 35.3223V55.4883ZM184.067 55.4883H174.736V28.1787H170.19V18.8819H174.736V17.1387C174.736 14.8828 175.157 12.7637 176 10.7813C176.866 8.79884 178.04 7.07847 179.521 5.62013C181.025 4.13901 182.768 2.9769 184.75 2.1338C186.733 1.26792 188.852 0.834976 191.108 0.834976H198.115V10.1319H191.108C190.105 10.1319 189.171 10.3141 188.305 10.6787C187.462 11.0205 186.722 11.5104 186.083 12.1485C185.468 12.7637 184.978 13.5042 184.614 14.3701C184.249 15.2132 184.067 16.1361 184.067 17.1387V18.8819H195.517V28.1787H184.067V55.4883ZM226.586 51.2158C225.834 51.8994 225.026 52.5488 224.16 53.1641C223.317 53.7565 222.428 54.2806 221.494 54.7363C220.559 55.1693 219.591 55.5111 218.588 55.7617C217.609 56.0352 216.606 56.1719 215.581 56.1719C213.325 56.1719 211.206 55.7731 209.223 54.9756C207.241 54.1781 205.498 53.0501 203.994 51.5918C202.513 50.1107 201.339 48.322 200.473 46.2256C199.63 44.1065 199.208 41.7367 199.208 39.1162V18.8819H208.505V39.1162C208.505 40.3467 208.688 41.4518 209.052 42.4317C209.44 43.3887 209.952 44.1976 210.59 44.8584C211.228 45.5192 211.969 46.0205 212.812 46.3623C213.678 46.7041 214.601 46.875 215.581 46.875C216.538 46.875 217.438 46.6585 218.281 46.2256C219.147 45.7699 219.899 45.1774 220.537 44.4483C221.175 43.7191 221.676 42.8988 222.041 41.9873C222.405 41.0531 222.587 40.096 222.587 39.1162V18.8819H231.918V55.4883H229.663L226.586 51.2158ZM248.461 55.4883H239.062V4.3213H248.461V55.4883ZM265.004 55.4883H255.605V4.3213H265.004V55.4883Z'
			fill='url(#paint0_linear_693_1625)'
		/>
		<defs>
			<linearGradient
				id='paint0_linear_693_1625'
				x1='-0.0904838'
				y1='32.6743'
				x2='261.958'
				y2='34.4352'
				gradientUnits='userSpaceOnUse'
			>
				<stop stopColor='#F08783' />
				<stop offset='0.534359' stopColor='#ECDB8D' />
				<stop offset='1' stopColor='#759E83' />
			</linearGradient>
		</defs>
	</svg>
);
