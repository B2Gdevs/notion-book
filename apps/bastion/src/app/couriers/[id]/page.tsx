// apps/bastion/src/app/couriers/[id]/page.tsx
'use client';
import { Box } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';
import {
	BatchOrder,
	BatchOrderStatus,
	CourierDetail,
	toast,
	useGetBatchOrdersByIds,
	useGetBatchOrdersByJobId,
	useGetCourierById,
	useGetDeliveryJobById,
	useUpdateBatchOrder,
} from 'ui';

const CourierDetailPage: React.FC = () => {
	const { id: courierId } = useParams<{ id: string }>();
	const [selectedBatchOrderId, setSelectedBatchOrderId] = useState<
		string | null
	>(null);
	const [batchOrderStatus, setBatchOrderStatus] = useState<
		BatchOrderStatus | ''
	>('');

	const {
		data: courier,
		isLoading: isLoadingCourier,
		error: errorCourier,
	} = useGetCourierById(courierId);

	const {
		data: batchOrders,
		isLoading: isLoadingBatchOrders,
		error: errorBatchOrders,
	} = useGetBatchOrdersByIds(courier?.current_batch_ids || []);

	const {
		data: deliveryJob,
		isLoading: isLoadingDeliveryJobs,
		error: errorDeliveryJobs,
	} = useGetDeliveryJobById(courier?.current_job_id ?? '');

	const {
		data: jobBatchOrders,
		isLoading: isLoadingJobBatchOrders,
		error: errorJobBatchOrders,
	} = useGetBatchOrdersByJobId(courier?.current_job_id ?? '');

	const updateBatchOrderMutation = useUpdateBatchOrder({
		onSuccess: () => {
			toast({
				title: 'Batch order status updated successfully',
				duration: 5000,
			});
		},
		onError: (error: Error) => {
			toast({
				title: 'Error updating batch order status',
				description: error.message,
				duration: 5000,
			});
		},
	});

	const handleStatusChange = (
		batchOrderId: string,
		status: BatchOrderStatus,
	) => {
		setSelectedBatchOrderId(batchOrderId);
		setBatchOrderStatus(status);
	};

	const updateStatus = () => {
		if (selectedBatchOrderId && batchOrderStatus) {
			updateBatchOrderMutation.mutate({
				batchOrderId: selectedBatchOrderId,
				batchOrderData: { status: batchOrderStatus } as BatchOrder,
			});
		}
	};

	if (
		isLoadingCourier ||
		isLoadingBatchOrders ||
		isLoadingDeliveryJobs ||
		isLoadingJobBatchOrders
	)
		return <div>Loading...</div>;
	if (errorCourier)
		return (
			<div>Error loading courier details: {(errorCourier as Error).message}</div>
		);
	if (errorBatchOrders)
		return (
			<div>Error loading batch orders: {(errorBatchOrders as Error).message}</div>
		);
	if (errorJobBatchOrders)
		return (
			<div>
				Error loading job batch orders: {(errorJobBatchOrders as Error).message}
			</div>
		);
	if (errorDeliveryJobs)
		return (
			<div>Error loading delivery jobs: {(errorDeliveryJobs as Error).message}</div>
		);
	if (!courier) return <div>No courier details found.</div>;

	return (
		<div className='m-8'>
			<h1 className='text-4xl  mb-6'>Courier Details</h1>
			<CourierDetail courier={courier} />
			<h2 className='text-3xl  my-4 border-b-2 border-black'>
				Current Job
			</h2>
			{deliveryJob ? (
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
			)}

			<h2 className='text-3xl  my-4'>Current Batch Orders</h2>
			{batchOrders && batchOrders.length > 0 ? (
				<ul>
					{batchOrders.map((batchOrder: BatchOrder) => (
						<li key={batchOrder.id}>
							<div>
								Batch Order ID: {batchOrder.id}
								<div>Status: {batchOrder.status}</div>
								<div>
									Update Status:
									<select
										value={
											selectedBatchOrderId === batchOrder.id
												? batchOrderStatus
												: ''
										}
										onChange={(e) =>
											handleStatusChange(
												batchOrder?.id ?? '',
												e.target.value as BatchOrderStatus,
											)
										}
									>
										<option value=''>Select Status</option>
										{Object.values(BatchOrderStatus).map((status) => (
											<option key={status} value={status}>
												{status}
											</option>
										))}
									</select>
									<button onClick={updateStatus}>Update</button>
								</div>
							</div>
						</li>
					))}
				</ul>
			) : (
				<div>No batch orders found for this courier.</div>
			)}

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
		</div>
	);
};

export default CourierDetailPage;
