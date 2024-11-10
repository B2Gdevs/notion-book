'use client'

import { useState, useEffect } from "react";
import { Org } from "..";

interface RestaurantOrderLimitProps {
    org: Org;
    onOrderLimitChange: (newLimit: number) => void;
    isShowingDescription?: boolean;
}

export const RestaurantOrderLimit: React.FC<RestaurantOrderLimitProps> = ({ org, onOrderLimitChange, isShowingDescription }) => {
    const [orderLimit, setOrderLimit] = useState<number>(org?.order_limit || 0);

    useEffect(() => {
        setOrderLimit(org?.order_limit || 0);
    }, [org?.order_limit]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newLimit = parseInt(event.target.value, 10);
        setOrderLimit(newLimit);
        onOrderLimitChange(newLimit);
    };

    return (
        <div>
            {isShowingDescription ?
                <div className="flex flex-col justify-start items-start gap-1">
                    <h2 className="font-righteous text-xl">Org Order Limit:</h2>
                    <span className="text-lg">This number sets the maximum orders your restaurant can handle in a day. Colorfull will use this limit to ensure your kitchen does not exceed its capacity.</span>
                    <span className="italic">*If the number below is "0", this means that you have not yet set an order limit for your organization.</span>
                    <span className="italic">*For organizations with multiple brands, the order limit number should reflect the total number of orders across <span className="underline">all</span> your brands.</span>
                </div>
                :
                <span className="font-righteous">Org Order Limit:</span>
            }
            <input
                type="number"
                className="border-2 border-gray-300 rounded-lg p-2 my-2"
                value={orderLimit}
                onChange={handleInputChange}
                min="1"
                step="1"
            />
        </div>
    );
}