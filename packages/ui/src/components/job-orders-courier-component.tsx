'use client'

import { useEffect, useMemo, useState } from "react";
import { CodeBlock, Order, OrderStatus, OrderTotal, SearchBar, Switch, useGetOrderTotals, useGetOrdersByIds, useStoresAndBrands } from "..";
import { SubOrderDetail } from "./suborder-detail";
import { TitleComponent } from "./title-component";
import { Button } from "./ui/button";
import { OrderContextActions } from "./order-actions";
import { ShoppingBasket } from "lucide-react";

interface JobOrdersCourierComponentProps {
    currentPage: number;
    totalPages: number;
    handlePrev: () => void;
    handleNext: () => void;
    isLoadingOrders: boolean;
    shownOrderIds: { [key: string]: boolean };
    setShownOrderIds: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
    refundAmounts: { [key: string]: number };
    setRefundAmounts: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
    allOrders: Order[];
    onSubOrdersStatusChange?: (allPickedUp: boolean) => void;
    isColorfullUser?: boolean;
}

export const JobOrdersCourierComponent: React.FC<JobOrdersCourierComponentProps> = ({
    currentPage,
    totalPages,
    handlePrev,
    handleNext,
    isLoadingOrders,
    shownOrderIds,
    setShownOrderIds,
    allOrders,
    onSubOrdersStatusChange,
    isColorfullUser,
}) => {
    const [subOrdersMap, setSubOrdersMap] = useState<{ [key: string]: Order[] }>({});
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [showOrders, setShowOrders] = useState<boolean>(false);

    // Calculate paginated orders within the component
    const paginatedOrders = useMemo(() => {
        const startIndex = currentPage * 10; // Assuming 10 items per page
        return allOrders.slice(startIndex, startIndex + 10);
    }, [allOrders, currentPage]);

    // Get all unique sub-order IDs from allOrders, not just paginated
    const allSubOrderIds = useMemo(() => {
        const ids = new Set();
        allOrders.forEach(order => {
            order?.sub_order_ids?.forEach(id => {
                if (id) {
                    ids.add(id);
                }
            });
        });
        return Array.from(ids);
    }, [allOrders]);

    // Fetch all sub-orders by their ids
    const { data: allSubOrders } = useGetOrdersByIds(allSubOrderIds as string[]);

    const filteredOrders = useMemo(() => {
        if (!searchTerm || !allSubOrders) return paginatedOrders;

        const searchWords = searchTerm.toLowerCase().split(' ');

        const subOrderMatches = allSubOrders.filter(subOrder => {
            const status = subOrder.status?.toLowerCase() ?? '';
            // Change here: use `some` to check if any word in searchWords is part of the status
            return searchWords.some(word => status.includes(word));
        });

        const parentOrderIds = new Set(subOrderMatches.map(subOrder => subOrder.parent_order_id));

        const parentOrderMatches = allOrders.filter(order => {
            const firstName = order.customer?.first_name?.toLowerCase() ?? '';
            const lastName = order.customer?.last_name?.toLowerCase() ?? '';

            return searchWords.every(word =>
                firstName.includes(word) ||
                lastName.includes(word)
            ) || parentOrderIds.has(order.id);
        });

        return parentOrderMatches;
    }, [paginatedOrders, allOrders, searchTerm, allSubOrders]);

    // Compute counts of each OrderStatus for suborders, excluding 'CANCELED' and 'REJECTED'
    const subOrderStatusCounts = useMemo(() => {
        const counts: { [key in OrderStatus]?: number } = {};
        allSubOrders?.forEach(subOrder => {
            const status = subOrder.status;
            if (status && status !== OrderStatus.CANCELED && status !== OrderStatus.REJECTED) {
                counts[status] = (counts[status] || 0) + 1;
            }
        });
        return counts;
    }, [allSubOrders]);

    // Check if all suborders in subOrderStatusCounts are of status 'PICKED_UP'
    const allSubOrdersPickedUp = useMemo(() => {
        return Object.keys(subOrderStatusCounts).every(status => status === OrderStatus.PICKED_UP);
    }, [subOrderStatusCounts]);

    // Invoke the callback whenever allSubOrdersPickedUpOrPrepared changes
    useEffect(() => {
        if (onSubOrdersStatusChange) {
            onSubOrdersStatusChange(allSubOrdersPickedUp);
        }
    }, [allSubOrdersPickedUp, onSubOrdersStatusChange]);


    // Map sub-orders to their parent orders
    useEffect(() => {
        if (allSubOrders) {
            const map: { [key: string]: Order[] } = {};
            allSubOrders.forEach(subOrder => {
                const parentOrderId = subOrder?.parent_order_id;
                if (parentOrderId) {
                    if (!map[parentOrderId]) {
                        map[parentOrderId] = [];
                    }
                    map[parentOrderId].push(subOrder);
                }
            });
            setSubOrdersMap(map);
        }
    }, [allSubOrders]);

    const { storeMap, brandMap } = useStoresAndBrands(paginatedOrders);
    const orderTotalIds = paginatedOrders?.map(order => order.order_total_id).filter((id): id is string => id !== undefined);

    const { data: orderTotals } = useGetOrderTotals({
        ids: orderTotalIds
    })

    const orderTotalsMap = useMemo(() => {
        const map: { [key: string]: OrderTotal } = {};
        orderTotals?.forEach((orderTotal: OrderTotal) => {
            if (orderTotal.id) {
                map[orderTotal.id] = orderTotal;
            }
        });
        return map;
    }, [orderTotals]);

    const areThereMorePages = currentPage < totalPages - 1;

    return (
        <div className="w-full">
            <div>
                <label>Show Orders:</label>
                <Switch
                    checked={showOrders}
                    onClick={() => {
                        setShowOrders(!showOrders);
                    }}
                /></div>

            {isLoadingOrders ? (
                <p>Loading orders...</p>
            ) : (
                <div>
                    {/* Display suborder status counts */}
                    <div className="flex flex-col justify-start items-start mb-4">
                        {isColorfullUser ? (
                            Object.entries(subOrderStatusCounts).map(([status, count]) => (
                                <div key={status}>{`${status}: ${count}`}</div>
                            ))
                        ) : (
                            (() => {
                                const preparedCount = subOrderStatusCounts[OrderStatus.PREPARED] || 0;
                                const pickedUpCount = subOrderStatusCounts[OrderStatus.PICKED_UP] || 0;
                                const notReadyCount = Object.entries(subOrderStatusCounts).reduce((acc, [status, count]) => {
                                    if (status !== OrderStatus.PREPARED && status !== OrderStatus.PICKED_UP) {
                                        return acc + count;
                                    }
                                    return acc;
                                }, 0);

                                return (
                                    <div className="flex justify-center items-center gap-4 w-full">
                                        <div key="notReady" className="flex flex-col justify-center items-center gap-2 shadow text-red-400 rounded-lg w-1/3 p-2">
                                            <span className="text-4xl">{notReadyCount}</span>
                                            <span className="text-black">Not Ready</span>
                                        </div>
                                        <div key="prepared" className="flex flex-col justify-center items-center gap-2 shadow text-gray-400 rounded-lg w-1/3 p-2">
                                            <span className="text-4xl">{preparedCount}</span>
                                            <span className="text-black">Ready!</span>
                                        </div>
                                        <div key="pickedUp" className="flex flex-col justify-center items-center gap-2 shadow text-green-400 rounded-lg w-1/3 p-2">
                                            <span className="text-4xl">{pickedUpCount}</span>
                                            <span className="text-black">Picked Up</span>
                                        </div>
                                    </div>
                                );
                            })()
                        )}
                    </div>
                    {isColorfullUser && showOrders && (
                        <div className='flex flex-col justify-start items-start gap-2'>
                            <p>Page <CodeBlock className={`${areThereMorePages ? 'text-lg' : ''}`}>{currentPage + 1}</CodeBlock> of <CodeBlock className={`${areThereMorePages ? 'text-red-500 text-lg font-semibold' : ''}`}>{totalPages}</CodeBlock></p>
                            <div>
                                <Button size='sm' onClick={handlePrev} className='mx-1'>Previous</Button>
                                <Button size='sm' onClick={handleNext} className={`mx-1 ${areThereMorePages ? 'bg-red-500 hover:bg-red-700' : ''}`}>Next</Button>
                            </div>
                            <SearchBar
                                value={searchTerm}
                                onChange={setSearchTerm}
                                placeholder="Search Orders"
                            />
                        </div>
                    )}
                    {isColorfullUser && showOrders &&
                        filteredOrders?.map(order => {
                            const orderTotal = orderTotalsMap[order.order_total_id ?? '']
                            return (
                                <TitleComponent
                                    leftTitle="Order"
                                    leftTitleIcon={<ShoppingBasket className='text-xxs' />}
                                >
                                    <OrderContextActions
                                        order={order}
                                        orderTotal={orderTotal}
                                        disabledItems={[]}
                                        excludedItems={["Send Order ASAP"]} />

                                    <div className="flex items-center gap-1 mt-4">
                                        <label>Show Sub Orders:</label>
                                        <Switch
                                            checked={shownOrderIds[order?.id ?? ''] ?? false}
                                            onClick={() => {
                                                if (order.id) {
                                                    setShownOrderIds({ ...shownOrderIds, [order.id]: !shownOrderIds[order.id] });
                                                }
                                            }}
                                        />
                                    </div>
                                    {(shownOrderIds[order?.id ?? ''] ?? false) && (
                                        <div key={order.id} className="p-4">
                                            <div className='flex justify-start items-start gap-1'>
                                                <span className="font-righteous">Customer Name:</span> <CodeBlock>{order.customer?.first_name} {order.customer?.last_name}</CodeBlock>
                                            </div>

                                            {order.id && shownOrderIds[order.id] && (
                                                <div className='flex flex-col justify-start items-start'>
                                                    <div className='w-full'>
                                                        {order.id && shownOrderIds[order.id] && (
                                                            <div>
                                                                <div className="font-righteous">Store Orders:</div>
                                                                {subOrdersMap[order.id]?.map((subOrder) => {
                                                                    const store = storeMap[subOrder.store_id ?? ''];
                                                                    const brand = store ? brandMap[store.brand_id] : null;
                                                                    return (
                                                                        <SubOrderDetail
                                                                            key={subOrder.id}
                                                                            subOrder={subOrder}
                                                                            order={order}
                                                                            store={store}
                                                                            brand={brand}
                                                                            isCourierView={true}
                                                                        />
                                                                    )
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    )}

                                </TitleComponent>
                            )
                        }
                        )}
                </div>
            )}
        </div>
    )
};

