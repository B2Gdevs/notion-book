'use client';

import { motion, useInView } from 'framer-motion';
import { FC, useRef } from 'react';
import { ColorfullIcon } from '..';

type FooterProps = {
	isInSidebar?: boolean;
};

export const Footer: FC<FooterProps> = ({ isInSidebar }) => {
	const affirmations = [
		'You are doing great!',
		"Keep going, you're making progress!",
		'Believe in yourself and all that you are.',
		'You are capable of amazing things.',
		"Don't wait for opportunity. Create it.",
		"Believe you can and you're halfway there.",
		'Seize the day, one task at a time.',
		'Great achievements start with small steps.',
		'Innovation is served with the courage to be different.',
		'Teamwork makes the dream work.',
		'Transform challenges into opportunities.',
		'Believe in the power of a fresh perspective.',
		'Your potential is endless; go after it.',
		'Stay positive, work hard, make it happen.',
		'Every day is a chance to be better than yesterday.',
		'Dedication is the recipe for success.',
		'Cultivate kindness, harvest success.',
		'Motivation is what gets you started. Habit is what keeps you going.',
		'Success is the sum of small efforts, repeated day in and day out.',
		"Balance is not something you find, it's something you create.",
		'Ambition is the path to success. Persistence is the vehicle you arrive in.',
		"Opportunities don't happen, you create them.",
		'Progress is progress, no matter how small.',
		'Stay hungry for success and thirsty for achievement.',
	];

	const ref = useRef(null);
	const isInView = useInView(ref);

	const date = new Date();
	const index = date.getDate() % affirmations.length;
	const affirmation = affirmations[index];

	return (
		<div
			className={`
				bg-primary-off-white py-4 z-50`}
			ref={ref}
		>
			<div className='container w-full lg:w-3/4 px-4 flex flex-col justify-center items-center space-x-4 z-50'>
				<motion.div
					initial={{ opacity: 0, x: -100 }}
					animate={isInView ? { opacity: 1, x: 0 } : {}}
					transition={{ duration: 0.6 }}
					className='text-sm italic my-4'
				>
					{isInSidebar ? (
						<div className='flex flex-col justify-center items-center'>
							<span className=' mr-1 text-center'>{`"${affirmation}"`}</span>
							<div className='flex justify-center items-center mt-1'>
								<span className='mx-1'> - </span><ColorfullIcon className='h-5 w-5 ml-1 hidden lg:block' /><img
									src='https://res.cloudinary.com/dzmqies6h/image/upload/v1697226403/branding/Logo_256_eqmgsw.svg'
									alt='Colorfull icon'
									className='w-5 h-5 lg:hidden flex justify-center items-center'
								/>
							</div>
						</div>
					) : (
						<div className='flex items-center justify-center'>
							<span className=' mr-1'>{`"${affirmation}"`}</span><span className='mx-1'> - </span><ColorfullIcon className='h-5 w-5 ml-1' />
						</div>
					)}
				</motion.div>

				{!isInSidebar &&
					<motion.div
						initial={{ opacity: 0, x: -100 }}
						animate={isInView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.5 }}
						className='text-xs lg:hidden mb-2 text-gray-600'>

						Contact us at <a href="mailto:help@colorfull.ai" className="text-primary-spinach-green underline">help@colorfull.ai</a></motion.div>}
				<motion.div
					initial={{ opacity: 0, x: -100 }}
					animate={isInView ? { opacity: 1, x: 0 } : {}}
					transition={{ duration: 0.5 }}
					className='text-gray-600 text-sm'
				>
					© 2024 Colorfull
				</motion.div>
			</div>
		</div>
	);
};
