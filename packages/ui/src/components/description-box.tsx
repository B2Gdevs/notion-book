'use client';
import * as React from 'react';
import { Item, Photo } from '../models/menuModels';
import {
	DietaryClassifications
} from './dietary-classifications';
import { ImageCarousel } from './image-carousel';

interface DescriptionBoxProps {
	description: string;
	photos: Photo[];
	item? : Item;
}

export const ItemDescriptionBox: React.FC<DescriptionBoxProps> = ({
	photos,
	description,
	item
}) => {
	function capitalizeWords(s: string): string {
		return s
			.split(',')
			.map((word) => word.trim().charAt(0).toUpperCase() + word.trim().slice(1))
			.join(', ');
	}
	const hasDescription = description !== '';
	const capitalizedDescription = capitalizeWords(description);

	return (
		<div className='w-full h-fit flex flex-col md:flex-row px-6 py-4'>
			<div className={`${hasDescription ? 'md:w-1/2' : 'md:w-full'} flex justify-center items-start pb-4 md:pb-0`}>
				<ImageCarousel images={photos} />
			</div>

			{hasDescription &&
				<div className='md:w-1/2 flex flex-col justify-between'>
					<div className="w-full text-zinc-800 text-base font-normal font-sans leading-normal">
						{capitalizedDescription}
					</div>
					<DietaryClassifications
						layout='horizontal'
						className='someClassName'
						item={item}
					/>
				</div>
			}
		</div>
	);
};
