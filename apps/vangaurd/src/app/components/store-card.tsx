'use client';
// StoreCard.tsx
import { Info, Menu as MenuIcon } from 'lucide-react';
import React from 'react';
import { Store } from 'ui';

interface StoreCardProps {
	store: Store;
	onClick: () => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onClick }) => {
	return (
		<div className='w-full bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden m-4'>
			<div className='px-6 py-4'>
				<div className=' text-xl mb-2'>{store?.name}</div>
				<div className='text-sm bg-green-100 text-green-800 py-1 px-3 inline-block rounded-full mb-4'>
					{store.store_state}
				</div>
				<div className='text-gray-600 text-sm my-2'>
					<Info className='inline-block mr-1' size={18} />
					Store ID: {store?.id}
				</div>
				<div className='flex items-center mt-4'>
					{store.menus && Object.keys(store.menus).length > 0 && (
						<div className='flex items-center mr-6'>
							<MenuIcon className='inline-block mr-1' size={18} />
							<span className='text-gray-600 text-sm'>Menus Available</span>
						</div>
					)}
					<button
						onClick={onClick}
						className='text-white bg-blue-500 hover:bg-blue-600 font-medium py-2 px-4 rounded-lg transition-colors duration-200'
					>
						Edit Store
					</button>
				</div>
			</div>
		</div>
	);
};

export default StoreCard;
