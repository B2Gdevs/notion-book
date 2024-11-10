import { useMemo } from "react";
import { useGetBrandsByIds } from "../brandHooks";
import { Order } from '../../models/orderModels';
import { useGetStoresByIds } from "../storeHooks";

export function useStoresAndBrands(paginatedOrders: Order[]) {
    const storeIds = useMemo(() => {
        const ids = new Set();
        paginatedOrders.forEach(order => {
            if (order?.substituted_store_id){
                ids.add(order.substituted_store_id);
            }
            order?.items?.forEach(item => {
                if (item.store_id) {
                    ids.add(item.store_id);
                }
            });
        });
        return Array.from(ids);
    }, [paginatedOrders]);

    const { data: stores } = useGetStoresByIds(storeIds as string[]);

    const storeMap = useMemo(() => {
        const map: { [key: string]: any } = {};
        stores?.forEach(store => {
            if (store?.id) {
                map[store?.id] = store;
            }
        });
        return map;
    }, [stores]);

    const brandIds = useMemo(() => {
        const ids = new Set();
        stores?.forEach(store => {
            if (store?.brand_id) {
                ids.add(store.brand_id);
            }
        });
        return Array.from(ids);
    }, [stores]);

    const { data: brands } = useGetBrandsByIds(brandIds as string[]);

    const brandMap = useMemo(() => {
        const map: { [key: string]: any } = {};
        brands?.forEach(brand => {
            if (brand.id) {
                map[brand.id] = brand;
            }
        });
        return map;
    }, [brands]);

    return { stores, storeMap, brands, brandMap };
}