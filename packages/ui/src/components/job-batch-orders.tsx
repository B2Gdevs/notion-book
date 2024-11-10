import React from 'react';
// JobBatchOrdersComponent.tsx
import { BatchOrder } from '../models/batchOrderModels';

const JobBatchOrdersComponent: React.FC<{ jobBatchOrders: BatchOrder[] }> = ({
	jobBatchOrders,
}) => {
	return (
		<>
			<h2 className='text-3xl  my-4'>Current Job Batch Orders</h2>
			{jobBatchOrders && jobBatchOrders.length > 0 ? (
				<ul>
					{jobBatchOrders.map((batchOrder: BatchOrder) => (
						<li key={batchOrder.id}>
							<div>
								Batch Order ID: {batchOrder.id}
								<div>Status: {batchOrder.status}</div>
							</div>
						</li>
					))}
				</ul>
			) : (
				<div>No job batch orders found for this courier.</div>
			)}
		</>
	);
};

export default JobBatchOrdersComponent;
