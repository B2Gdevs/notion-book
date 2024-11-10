import { SearchIndex } from "./algolia-search";

/**
 * Creates a route based on the provided search index and ID.
 * 
 * @param index - The search index to determine the base route.
 * @param id - The ID to append to the base route.
 * @returns A string representing the complete route.
 */
export const createRoute = (index: SearchIndex, id: string) => {
    let baseRoute = '';
    switch (index) {
        case SearchIndex.ORGS:
            baseRoute = '/orgs';
            break;
        case SearchIndex.ORDERS:
            baseRoute = '/orders';
            break;
        case SearchIndex.USERS:
            baseRoute = '/users';
            break;
        case SearchIndex.DELIVERY_JOBS:
            baseRoute = '/delivery-jobs';
            break;
        case SearchIndex.BRANDS:
            baseRoute = '/brands';
            break;
    }
    return `${baseRoute}/${id}`;
}