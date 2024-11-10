'use client'

import { useEffect, useMemo, useState } from "react";
import { CodeBlock, Order, OrderStatus, OrderTotal, SearchBar, Switch, useGetOrderTotals, useGetOrdersByIds, useStoresAndBrands, useUpdateOrder } from "..";
import { OrderStatusSelect } from "./order-status-select";
import { SubOrderDetail } from "./suborder-detail";
import { TitleComponent } from "./title-component";
import { Button } from "./ui/button";
import { OrderContextActions } from "./order-actions";
import { ShoppingBasket } from "lucide-react";

const STRIPE_FEE_UNDER_50_LIMIT = .50;

interface JobOrdersComponentProps {
    showOrders: boolean;
    currentPage: number;
    totalPages: number;
    handlePrev: () => void;
    handleNext: () => void;
    isLoadingOrders: boolean;
    paginatedOrders: Order[];
    shownOrderIds: { [key: string]: boolean };
    setShownOrderIds: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
    refundAmounts: { [key: string]: number };
    setRefundAmounts: React.Dispatch<React.SetStateAction<{ [key: string]: number }>>;
    allOrders: Order[];
}

export const JobOrdersComponent: React.FC<JobOrdersComponentProps> = ({
    showOrders,
    currentPage,
    totalPages,
    handlePrev,
    handleNext,
    isLoadingOrders,
    paginatedOrders,
    shownOrderIds,
    setShownOrderIds,
    allOrders,
}) => {
    const [subOrdersMap, setSubOrdersMap] = useState<{ [key: string]: Order[] }>({});
    const [searchTerm, setSearchTerm] = useState<string>('');

    // Get all unique sub-order IDs
    const allSubOrderIds = useMemo(() => {
        const ids = new Set();
        paginatedOrders.forEach(order => {
            order?.sub_order_ids?.forEach(id => {
                if (id) {
                    ids.add(id);
                }
            });
        });
        return Array.from(ids);
    }, [paginatedOrders]);

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
            const email = order.customer?.email?.toLowerCase() ?? '';
            const userId = order.customer?.id?.toLowerCase() ?? '';
            const orderId = order?.id?.toLowerCase() ?? '';

            return searchWords.every(word =>
                firstName.includes(word) ||
                lastName.includes(word) ||
                email.includes(word) ||
                userId.includes(word) ||
                orderId.includes(word)
            ) || parentOrderIds.has(order.id);
        });

        return parentOrderMatches;
    }, [paginatedOrders, allOrders, searchTerm, allSubOrders]);

    // Compute counts of each OrderStatus for suborders
    const subOrderStatusCounts = useMemo(() => {
        const counts: { [key in OrderStatus]?: number } = {};
        allSubOrders?.forEach(subOrder => {
            const status = subOrder.status;
            if (status) {
                counts[status] = (counts[status] || 0) + 1;
            }
        });
        return counts;
    }, [allSubOrders]);

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

    const updateOrderMutation = useUpdateOrder();

    const handleStatusChange = (order: Order, newStatus: OrderStatus) => {
        const orderId = order?.id ?? '';
        updateOrderMutation.mutate({
            orderId,
            orderData: {
                ...order,
                status: newStatus
            }
        });
    }

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

    const getUserPaymentStatusText = (orderStatus: OrderStatus, userOwedAmount: number, userPaymentStatus: string) => {
        if (orderStatus === OrderStatus.CANCELED) {
            return 'No Payment Needed - Order Canceled';
        } else if (userOwedAmount <= STRIPE_FEE_UNDER_50_LIMIT) {
            return 'Overage under $.50, Org will Cover';
        } else {
            return userPaymentStatus;
        }
    }

    const areThereMorePages = currentPage < totalPages - 1;

    return showOrders ? (
        <div className="mt-4 px-2 sm:px-0">
            <div className="flex flex-col justify-start items-start gap-1 mb-2">
                <div className='flex flex-col sm:flex-row justify-between items-center gap-2 my-2'>
                    <p>Page {currentPage + 1} of <span className={`${areThereMorePages ? 'text-red-500 text-xl' : ''}`}>{totalPages}</span></p>
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
                <div className="text-lg font-semibold text-gray-700 flex justify-center items-center">
                    <p>Order Num: <span className="text-blue-500">{filteredOrders.length}</span></p>
                </div>
            </div>

            {isLoadingOrders ? (
                <p>Loading orders...</p>
            ) : (
                <div>
                    {/* Display suborder status counts */}
                    <div className="flex flex-col justify-start items-start mb-4">
                        {Object.entries(subOrderStatusCounts).map(([status, count]) => (
                            <div key={status}>{`${status}: ${count}`}</div>
                        ))}
                    </div>
                    {
                        filteredOrders?.map(order => {
                            const orderTotal = orderTotalsMap[order.order_total_id ?? '']
                            return (
                                <TitleComponent
                                    leftTitle="Order"
                                    leftTitleIcon={<ShoppingBasket className='text-xxs' />}
                                    centerTitle={`${order?.customer?.first_name + " " + order?.customer?.last_name}/ ${order?.customer?.id}`}
                                    rightTitle={`${order?.id}`}>
                                    <OrderContextActions
                                        order={order}
                                        orderTotal={orderTotal}
                                        disabledItems={[]}
                                        excludedItems={["Send Order ASAP"]} />

                                    <div className="flex items-center mt-4">
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

                                    <div key={order.id} className="p-4">
                                        <div className='flex flex-col justify-start items-start space-y-4'>
                                            <div className="flex-col w-1/2 ">
                                                <div className="justify-between"><span className="font-righteous">Customer Name:</span> <CodeBlock>{order.customer?.first_name} {order.customer?.last_name}</CodeBlock></div>
                                                <div className="justify-between"><span className="font-righteous">Customer Email:</span> <CodeBlock>{order.customer?.email}</CodeBlock></div>
                                                <div className="justify-between"><span className="font-righteous">Order Total with tax:</span> <CodeBlock className="bg-slate-800 text-white">${(orderTotal?.total_before_subsidy ?? 0).toFixed(2)}</CodeBlock></div>
                                                <div className="justify-between"><span className="font-righteous">Order Tax Total:</span> <CodeBlock className="bg-slate-800 text-white">${orderTotal?.tax_total?.toFixed(2)}</CodeBlock></div>
                                                <div className="justify-between"><span className="font-righteous">User Owed Amount:</span> <CodeBlock className="bg-slate-800 text-white">${orderTotal?.user_owed_amount?.toFixed(2)}</CodeBlock></div>
                                                <div className="justify-between"><span className="font-righteous">Company Owed Amount:</span> <CodeBlock className="bg-slate-800 text-white">${orderTotal?.discount?.toFixed(2)}</CodeBlock></div>
                                                <div className="justify-between"><span className="font-righteous">Under 50 Org Overages:</span> <CodeBlock className="bg-slate-800 text-white">${((orderTotal?.user_owed_amount ?? 0) <= STRIPE_FEE_UNDER_50_LIMIT) ? orderTotal?.user_owed_amount?.toFixed(2) : 0}</CodeBlock></div>
                                                <div className='flex justify-between items-center bg-gray-100 p-2 rounded-md'>
                                                    <span className="font-righteous text-lg text-primary-spinach-green">Delivery Time:</span>
                                                    <div className="flex space-x-2 m-2 p-2">
                                                        <span className="text-lg text-gray-700">{new Date(order.fulfillment_info?.delivery_time || '').toLocaleDateString()}</span>
                                                        <span className="text-lg text-gray-700">{new Date(order.fulfillment_info?.delivery_time || '').toLocaleTimeString()}</span>
                                                    </div>
                                                </div>

                                            </div>
                                            <TitleComponent
                                                leftTitleClassName="text-xs"
                                                rightTitleClassName="text-xs"
                                                leftTitle="Order Total"
                                                centerTitle={`Payment Status`}
                                                rightTitle={`${orderTotal?.id}`}>
                                                <div className="text-xs min-w-[500px]">
                                                    <div className="flex justify-between items-center">
                                                        <span>🔹 User Payment Status:</span>
                                                        <CodeBlock>
                                                            {getUserPaymentStatusText(order.status, orderTotal?.user_owed_amount ?? 0, orderTotal?.user_payment_status ?? '')}
                                                        </CodeBlock>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span>🔹 Organization Payment Status:</span>
                                                        <CodeBlock>
                                                            {order.status === OrderStatus.CANCELED ? 'No Payment Needed - Order Canceled' : orderTotal?.org_payment_status}
                                                        </CodeBlock>
                                                    </div>
                                                </div>
                                            </TitleComponent>
                                            <div className="flex">
                                                <span className="font-righteous">Order Status:</span>
                                                <OrderStatusSelect initialStatus={order.status} onChange={(newStatus) =>
                                                    handleStatusChange(order, newStatus)
                                                } />
                                            </div>
                                        </div>

                                        {order.id && shownOrderIds[order.id] && (
                                            <div className='flex flex-col justify-start items-start'>
                                                <div className='w-full'>
                                                    {order.id && shownOrderIds[order.id] && (
                                                        <div>
                                                            <div className="font-righteous">Store Orders x({subOrdersMap[order?.id ?? '']?.length ?? 0}):</div>
                                                            {subOrdersMap[order.id]?.map((subOrder) => {
                                                                const store = storeMap[subOrder?.substituted_store_id ?? subOrder.store_id ?? ''];
                                                                const brand = store ? brandMap[store.brand_id] : null;
                                                                return (
                                                                    <SubOrderDetail
                                                                        key={subOrder.id}
                                                                        subOrder={subOrder}
                                                                        order={order}
                                                                        store={store}
                                                                        brand={brand}
                                                                    />
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </TitleComponent>
                            )
                        }
                        )}
                </div>
            )}
            <div className='flex flex-col sm:flex-row justify-between items-center gap-2 my-2'>
                <p>Page {currentPage + 1} of <span className={`${areThereMorePages ? 'text-red-500 text-xl' : ''}`}>{totalPages}</span></p>
                <div>
                    <Button size='sm' onClick={handlePrev} className='mx-1'>Previous</Button>
                    <Button size='sm' onClick={handleNext} className={`mx-1 ${areThereMorePages ? 'bg-red-500 hover:bg-red-700' : ''}`}>Next</Button>
                </div>
            </div>
        </div>
    ) : null;
};

