'use client'

import _ from 'lodash';
import { ShoppingBasketIcon, UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import { Brand, Order, OrderItem, OrderStatus, Org, Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, ReceiptDialogContent, Share, TitleComponent, User, parseGuestDetails } from '..';

interface OrderSliderProps {
    potentialUserOrderItems?: Record<string, OrderItem[]>;
    userMap?: Record<string, User>;
    brandMap?: Record<string, Brand>;
    orgs?: Org[];
    potentialMetrics?: {
        totalUsers?: number;
    };
    shares?: Share[];
}

const ITEMS_PER_PAGE = 5;

export const OrderSlider: React.FC<OrderSliderProps> = ({ 
    potentialUserOrderItems = {}, 
    userMap = {}, 
    orgs = [], 
    potentialMetrics = { totalUsers: 0 },
    shares
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [visitedPages, setVisitedPages] = useState([1]);

    const totalPages = Math.ceil(Object.keys(potentialUserOrderItems).length / ITEMS_PER_PAGE);

    const handlePreviousPage = () => {
        handlePageChange(currentPage - 1);
    };

    const handleNextPage = () => {
        handlePageChange(currentPage + 1);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        if (!visitedPages.includes(newPage)) {
            setVisitedPages(prevPages => [...prevPages, newPage].sort((a, b) => a - b));
        }
    };

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentPotentialOrders = Object.keys(potentialUserOrderItems).filter(Boolean).slice(startIndex, endIndex);

    const visiblePages = visitedPages.filter(page => {
        if (currentPage <= 3) {
            return page <= 5;
        } else if (currentPage >= totalPages - 2) {
            return page >= totalPages - 4;
        } else {
            return Math.abs(currentPage - page) <= 2;
        }
    });

    let potentialSubOrders = _.sum(Object.values(potentialUserOrderItems ?? {}).map(orderItems => {
        let storeIds = new Set(orderItems.map(orderItem => orderItem.store_id));
        return storeIds.size;
    }));

    return (
        <TitleComponent
            className='my-4'
            leftTitle={`Orders In Carts (x${potentialMetrics?.totalUsers ?? 0})`}
            rightTitle={`Potential Sub Orders (x${potentialSubOrders})`}
            leftTitleIcon={<ShoppingBasketIcon className='text-xxs' />}
        >
            <Pagination className='my-4'>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious onClick={handlePreviousPage} isActive={currentPage === 1} className="border-2 border-black rounded-lg text-black cursor-pointer" />
                    </PaginationItem>
                    {currentPage > 3 && totalPages > 5 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}
                    {visiblePages.map(page => (
                        <PaginationItem key={page}>
                            <PaginationLink onClick={() => handlePageChange(page)} isActive={currentPage === page} className={`border-2 border-black rounded-lg cursor-pointer ${currentPage === page ? 'bg-black text-white' : 'text-black'}`}>
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    {currentPage < totalPages - 2 && totalPages > 5 && (
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    )}
                    <PaginationItem>
                        <PaginationNext onClick={handleNextPage} isActive={currentPage === totalPages} className="border-2 border-black rounded-lg text-black cursor-pointer" />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            {currentPotentialOrders.map((userId, idx) => {
                let user = userMap?.[userId];
                let org = orgs?.find(org => org?.id === user?.org_id);
                let shareId = null

                if (!user) {
                    const { first_name, last_name, shareId: shareID, phoneNumber } = parseGuestDetails(userId);
                    shareId = shareID
                    user = {
                        first_name,
                        last_name,
                        phone: phoneNumber,
                    } as User
                    const share = shares?.find(share => share?.id === shareID)
                    org = orgs?.find(org => org?.id === share?.org_id)
                }

                const potentialOrder: Order = {
                    id: `potential-${userId}`,
                    user_id: userId,
                    external_identifiers: {
                        friendly_id: `potential-${userId}`,
                    },
                    currency_code: 'USD',
                    status: OrderStatus.NEW_ORDER,
                    items: potentialUserOrderItems?.[userId],
                    ordered_at: new Date().toISOString(),
                    customer: user,
                    is_sub_order: false,
                    share_id: shareId ?? '',
                    share_guest_id: shareId ? userId : undefined,
                    org_id: org?.id ?? '',
                };


                return (
                    <TitleComponent
                        leftTitle={`${user?.first_name ?? ''} ${user?.last_name ?? ''} ${startIndex + idx + 1}/${potentialMetrics.totalUsers ?? 0}`}
                        className="my-8"
                        rightTitle={org?.name ? (`${org?.name ?? ''}`) : (`org id: ${user?.org_id ?? ''}`)}
                        leftTitleIcon={<UserIcon className='text-xxs' />}
                    >
                        <div className="space-y-4">
                            <ReceiptDialogContent
                                order={potentialOrder}
                                customerNote={potentialUserOrderItems[userId]?.[0]?.note ?? ''}
                            />
                        </div>
                    </TitleComponent>
                );
            })}

        </TitleComponent>
    );
};
