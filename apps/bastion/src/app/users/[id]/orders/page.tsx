'use client';
import { useParams } from 'next/navigation';
import { OrdersTable, useGetOrders } from 'ui';
import { motion } from 'framer-motion'; // Import motion

export default function OrdersPage() {
  const params = useParams();
  const userId = params.id as string;

  const { isLoading } = useGetOrders({
    "userId": userId,
    sortBy: "fulfillment_info.delivery_time",
    sortDirection: "desc"
  })

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex flex-col justify-between p-2 space-y-2'>
      <motion.p
        className="text-lg text-gray-700 self-center"
        initial={{ opacity: 0 }} // Start invisible
        animate={{ opacity: 1 }} // Fade in
        transition={{ duration: 2 }} // Duration of 2 seconds
      >
        "In the midst of chaos, there is also opportunity" - Sun Tzu
      </motion.p> {/* Affirmation */}
      <div className='w-full'> {/* Adjust width to full */}
        <OrdersTable
          userId={userId}
          isInBastion={true}
        />
      </div>
    </div>
  );
}