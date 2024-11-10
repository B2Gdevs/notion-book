import { Photo } from '../models/menuModels';

interface ImageCarouselProps {
	images?: Photo[];
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
	return (
		<div className='relative w-[125px] h-[125px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px]'>
			<div className='absolute w-[125px] h-[125px] md:w-[150px] md:h-[150px] lg:w-[200px] lg:h-[200px] inset-0 rounded-xl overflow-hidden'>
				<img
					className='object-cover w-full h-full rounded-xl'
					src={images?.[0]?.url ?? "https://res.cloudinary.com/dzmqies6h/image/upload/v1710964654/Burger_Menu_Item_Card_Holder_vgzofu.png"}
					alt=''
					style={{ objectFit: 'cover', objectPosition: 'center' }}
				/>
			</div>
		</div>
	);
};
