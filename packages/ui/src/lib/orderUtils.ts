import { OrderTotal } from '../models/totalModels';
import { Modifier, Order, OrderItem } from '../models/orderModels';
import { Area, Brand, Org, Share, Store, User, convertTo12HourFormat } from '..';


/**
 * This takes in to account the modifiers and quantity of the item to calculate the total price of the item.
 * It taks in to account the quantity of the item and the quantity of the modifiers.
 * 
 * @param item 
 * @returns 
 */
const calculateItemTotal = (item: OrderItem): number => {
  const basePrice = item.price * item.quantity;
  const modifiersPrice = item?.modifiers?.reduce(
    (sum, mod: Modifier) =>
      sum + (mod.price ?? 0) * mod.quantity * item.quantity,
    0,
  );
  return basePrice + modifiersPrice;
};

const sumItemTotals = (items: OrderItem[]): number => {
  return items.reduce((sum, item) => sum + calculateItemTotal(item), 0);
}

const getTaxTotal = (sumItemTotals: number, taxRate: number): number => {
  let taxTotal = sumItemTotals * taxRate;
  taxTotal = parseFloat(taxTotal.toFixed(2));
  return taxTotal;
}

export const calculateOrderTotals = (
  orderItems: OrderItem[] = [],
  taxRate: number = 0.0825,
  subsidy: number = 0,
  tip = 0,
  isStipendApplied = true,
  isAdminGuestAccount?: boolean,
) => {


  const itemsTotal = sumItemTotals(orderItems);
  const taxTotal = getTaxTotal(itemsTotal, taxRate);
  const subTotal = itemsTotal; // Subtotal is items total without tax
  const totalWithTax = subTotal + taxTotal;
  let totalBeforeSubsidy = totalWithTax + tip; // Including tip before subsidy as per Python logic
  let total = totalBeforeSubsidy;

  if (isStipendApplied) {
    total = Math.max(totalBeforeSubsidy - subsidy, 0);
  }

  if (isAdminGuestAccount) {
    total = 0;
  }

  // User is always responsible for tips, add tip after subsidy
  let userOwedAmount = total + tip;

  // we always apply the tip after the subsidy has been applied as the org does not pay for tips
  return {
    subtotal: subTotal ?? 0,
    tax_total: taxTotal,
    total: total,
    total_before_subsidy: totalBeforeSubsidy,
    discount: subsidy,
    tax: taxRate,
    tip: tip,
    user_owed_amount: userOwedAmount
  } as OrderTotal;
};


export enum OrderErrorType {
  UserOrOrgUnavailable = "UserOrOrgUnavailable",
  OrgNotAvailable = "OrgUnavailable",
  NameNotSet = "NameNotSet",
  NoDeliveryLocation = "NoDeliveryLocation",
  TaxRateUnknown = "TaxRateUnknown",
  SubsidyExceeded = "SubsidyExceeded",
  PastCutoffTime = "PastCutoffTime",
  OrderAlreadyPlaced = "OrderAlreadyPlaced",
  None = "None", // Indicates no error
  NoPaymentMethods = "NoPaymentMethods", // Indicates no error
  OutstandingBalance = "OutstandingBalance",
  OrgInactive = "OrgInactive",
}

export interface ValidationResult {
  canPlaceOrder: boolean;
  errorMessage: string | null;
  errorType: OrderErrorType;
}

export const validateCanCreateOrder = (
  hasUserOrderedToday: boolean,
  totals: OrderTotal,
  tax: number | null,
  isPastCutoffTime: boolean,
  area?: Area,
  user?: User,
  org?: Org,
  isPastRebatchCutoffTime = false,
  defaultPaymentMethod?: string,
  canceledSubOrders?: Order[],
  stores?: Store[],
  brands?: Brand[],
  share?: Share,
): ValidationResult => {
  if (!org) {
    return { canPlaceOrder: false, errorMessage: 'Organization information is not available.', errorType: OrderErrorType.OrgNotAvailable };
  }

  if (!org.is_active) {
    return { canPlaceOrder: false, errorMessage: 'This organization is not active.', errorType: OrderErrorType.OrgInactive };
  }

  if (!user || !org) {
    return { canPlaceOrder: false, errorMessage: 'User or organization information is not available.', errorType: OrderErrorType.UserOrOrgUnavailable };
  }

  if ((user?.amount_owed ?? 0) > 0) {
    return { canPlaceOrder: false, errorMessage: 'You have an outstanding balance. Please pay your balance before placing an order.', errorType: OrderErrorType.OutstandingBalance };
  }

  if (!(user?.first_name && user?.last_name)) {
    return { canPlaceOrder: false, errorMessage: 'Please update your settings with first and last name.', errorType: OrderErrorType.NameNotSet };
  }

  const userWorkLocation = org?.locations?.find((location) => location.address === user?.work_address);
  if (!userWorkLocation) {
    return { canPlaceOrder: false, errorMessage: `The user's company doesn't have a location to deliver to. Please contact the admin for ${org?.name ?? 'this company'}`, errorType: OrderErrorType.NoDeliveryLocation };
  }

  if (!tax) {
    return { canPlaceOrder: false, errorMessage: "We don't know this org's tax rate. Contact support to set it for your org.", errorType: OrderErrorType.TaxRateUnknown };
  }

  // currently we are only allowing the user to order if the total is less than or equal to the subsidy
  // the subsidy is applied to the total with tax, so if there is any total then that means the subsidy did not cover
  // it fully
  if (!share && totals?.total != 0 && !(defaultPaymentMethod)) {
    return { canPlaceOrder: false, errorMessage: 'Subsidy is not available or total amount exceeds the subsidy. Please set a budget in the company settings. If you do not have access, contact your admin.', errorType: OrderErrorType.SubsidyExceeded };
  }

  if ((share && totals?.total) && totals?.total > 0) {
    return { canPlaceOrder: false, errorMessage: 'Total amount exceeds the subsidy. Please reduce the order amount below the subsidy.', errorType: OrderErrorType.SubsidyExceeded };
  }

  if ((canceledSubOrders?.length ?? 0) > 0 && (stores?.length ?? 0) > 0) {
    // make sure there are no stores that have been canceled, comparing ids
    const canceledStoreIds = canceledSubOrders?.map((order) => order.store_id);
    const canceledStores = stores?.filter((store) => canceledStoreIds?.includes(store.id));

    if ((canceledStores?.length ?? 0) > 0) {
      const brand = brands?.find((brand) => brand.id === canceledStores?.[0].brand_id);
      return { canPlaceOrder: false, errorMessage: `You have items in your cart from a store that has been canceled. Please remove any items from the store ${brand?.name}.`, errorType: OrderErrorType.NoPaymentMethods };
    }
  }

  if (isPastCutoffTime) {
    const cutoffTime12HourFormat = convertTo12HourFormat(area?.order_cutoff_time ?? '10:30');

    return {
      canPlaceOrder: false,
      errorMessage: `Ordering is only available until ${cutoffTime12HourFormat} local time.`,
      errorType: OrderErrorType.PastCutoffTime
    };
  }

  if (isPastCutoffTime && isPastRebatchCutoffTime) {
    if (isPastRebatchCutoffTime) {
      const cutoffTime12HourFormat = convertTo12HourFormat(area?.order_cutoff_time ?? '11:20');
      return {
        canPlaceOrder: false,
        errorMessage: `Ordering is closed, last minute orders already sent by ${cutoffTime12HourFormat}.`,
        errorType: OrderErrorType.PastCutoffTime
      };
    }

  }


  if (hasUserOrderedToday) {
    return { canPlaceOrder: false, errorMessage: 'You have already placed an order today.', errorType: OrderErrorType.OrderAlreadyPlaced };
  }
  
  return { canPlaceOrder: true, errorMessage: '', errorType: OrderErrorType.None };

};