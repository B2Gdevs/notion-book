import { DeliveryWindow } from "..";


/**
 * Retrieves a delivery window from the provided array based on the given block number.
 * 
 * @param deliveryWindows An array of DeliveryWindow objects to search through.
 * @param blockNumber The index of the delivery window to retrieve.
 * @returns The DeliveryWindow object at the specified block number, or null if not found.
 */
export function getDeliveryWindowByBlock(deliveryWindows: DeliveryWindow[], blockNumber: number): DeliveryWindow | null {
    try {
        if (blockNumber < 0 || blockNumber >= deliveryWindows.length) {
            throw new Error("Block number out of range");
        }
        return deliveryWindows[blockNumber];
    } catch (error) {
        console.error(`Error fetching delivery window by block: ${error}`);
        return null;
    }
}