import { Box } from 'lucide-react';
// DeliveryJobComponent.tsx
import React from 'react';

const DeliveryJobComponent: React.FC<{ deliveryJob: any }> = ({
	deliveryJob,
}) => {
	return deliveryJob ? (
		<div className='bg-primary spinich-green p-4 rounded-lg shadow-md border-4 border-darkgreen-500'>
			<h2 className='text-2xl  text-off-white mb-2'>
				Delivery Job Details
			</h2>
			<ul className='list-disc list-inside text-off-white'>
				<li>
					<div className='flex items-center'>
						<Box className='mr-2 text-off-white' size={24} />
						<span>Delivery Job ID: {deliveryJob.id}</span>
					</div>
					<div className='flex items-center'>
						<Box className='mr-2 text-off-white' size={24} />
						<span>Status: {deliveryJob.status}</span>
					</div>
				</li>
			</ul>
		</div>
	) : (
		<div className='bg-secondary creamer-beige p-4 rounded-lg shadow-md border-4 border-darkgreen-500'>
			<h2 className='text-2xl  text-almost-black mb-2'>
				No Job Assigned
			</h2>
			<div className='text-almost-black'>
				This courier has not been assigned a job yet.
			</div>
		</div>
	);
};

export default DeliveryJobComponent;
