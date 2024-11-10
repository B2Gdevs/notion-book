import { Store, StoreStates } from "../models/storeModels";

export function isStoreOpen(store: Store | null | undefined): boolean {
    return store?.store_state === StoreStates.OPEN ||
        store?.store_state === StoreStates.OPEN_FOR_DELIVERY_ONLY ||
        store?.store_state === StoreStates.OPEN_FOR_PICKUP_ONLY;
}