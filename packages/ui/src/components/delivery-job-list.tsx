import { DeliveryJobCourierDisplay, DeliveryJobQueryParams, getStartAndEndOfDay, useGetBatchOrdersByIds, useGetDeliveryJobs } from "..";

interface DeliveryJobListProps {
    areaId: string;
    isColorfullUser: boolean;
    isSearchingToday?: boolean;
    courierId?: string;
}

export const DeliveryJobList: React.FC<DeliveryJobListProps> = ({ areaId, isColorfullUser, isSearchingToday, courierId }) => {

    let queryParams: DeliveryJobQueryParams = {
        area_id: areaId,
        sortBy: '',
        sortDirection: undefined,
        startDate: '',
        endDate: '',
        dateTimeField: 'delivery_date',
    };

    if (isSearchingToday) {
        const dateToUse = new Date();

        // ***UNCOMMENT THE LINE ABOVE AND REMOVE THE LINES BELOW BEFORE DEV MERGE***
        // Note: JavaScript months are 0-indexed, so September is 8.
        // const dateToUse = new Date(2024, 8, 16);
        // console.log('dateToUse:', dateToUse);
        const { startDateStartOfDay, endDateEndOfDay } = getStartAndEndOfDay(dateToUse)
        // ***REMOVE THE LINES ABOVE BEFORE DEV MERGE***

        queryParams = {
            ...queryParams,
            startDate: startDateStartOfDay.toISOString(),
            endDate: endDateEndOfDay.toISOString(),
        };
    } else {
        queryParams = {
            ...queryParams,
            sortBy: 'delivery_date',
            sortDirection: 'desc',
        };
    }
    // Get delivery jobs for the area and today
    const { data: deliveryJobs, isLoading } = useGetDeliveryJobs(queryParams);
    // console.log('deliveryJobs:', deliveryJobs);

    // Get all the batch IDs from each delivery job's batch_ids array of strings
    const batchIds = deliveryJobs?.reduce((acc: string[], job) => {
        if (job.batch_ids) {
            return [...acc, ...job.batch_ids];
        }
        return acc;
    }, []);
    // console.log('batchIds:', batchIds);

    const { data: batchOrders } = useGetBatchOrdersByIds(batchIds || []);

    // Filter deliveryJobs based on batchOrders with the matching courier_id
    const deliveryJobsToDisplay = deliveryJobs?.filter(job => 
        job.batch_ids.some(batchId => 
            batchOrders?.find(batch => batch.id === batchId && batch.courier_id === courierId)
        )
    );
    // console.log('deliveryJobsToDisplay:', deliveryJobsToDisplay);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isColorfullUser && deliveryJobs && deliveryJobs.length > 0) {
        return (
            <div className="w-full space-y-2">
                {deliveryJobs?.map((job) => (
                    <DeliveryJobCourierDisplay job={job} isColorfullUser={isColorfullUser} />
                ))}
            </div>
        );
    }

    if (!isColorfullUser && deliveryJobsToDisplay && deliveryJobsToDisplay.length > 0) {
        return (
            <div className="w-full space-y-2">
                {deliveryJobsToDisplay.map((job) => (
                    <DeliveryJobCourierDisplay job={job} isColorfullUser={isColorfullUser} isDisabled={!isSearchingToday} />
                ))}
            </div>
        )
    }
    else {
        return <div>No delivery jobs found for today.</div>;
    }
};