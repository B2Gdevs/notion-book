import { DeliveryJobTotal } from "..";

export function calculateOrgTotal(jobTotal: DeliveryJobTotal) {
  if (jobTotal.subsidy_total === null || jobTotal.delivery_fee === null || jobTotal.tax === null) {
    return 0; // replace this with your alternative value
  }

  return (jobTotal?.subsidy_total ?? 0) + (jobTotal?.delivery_fee ?? 0) + calculateDeliveryFeeTaxTotal(jobTotal)
}

// create function to calculate delivery fee tax total
export function calculateDeliveryFeeTaxTotal(jobTotal: DeliveryJobTotal) {
  return (jobTotal?.delivery_fee ?? 0) * (jobTotal?.tax ?? 0);
}

export function calculateUserTotal(jobTotal: DeliveryJobTotal) {
  return jobTotal?.user_spend_total ?? 0;
}

export function sumJobTotals(jobTotals: DeliveryJobTotal[]) {
  return jobTotals?.reduce((acc, jobTotal) => acc + calculateOrgTotal(jobTotal), 0);
}

export function sumUserTotals(jobTotals: DeliveryJobTotal[]) {
  return jobTotals?.reduce((acc, jobTotal) => acc + calculateUserTotal(jobTotal), 0);
}

export function calculateSubsidyTotalTax(jobTotal: DeliveryJobTotal) {
  return (jobTotal?.subsidy_total ?? 0) * (jobTotal?.tax ?? 0);
}

export function calculateDeliveryFeeTax(jobTotal: DeliveryJobTotal) {
  return (jobTotal?.delivery_fee ?? 0) * (jobTotal?.tax ?? 0);
}

// sum of subsidy totals taxes
export function sumSubsidyTotalTaxes(jobTotals: DeliveryJobTotal[]) {
  return jobTotals?.reduce((acc, jobTotal) => acc + calculateSubsidyTotalTax(jobTotal), 0);
}

// sum of delivery fees taxes
export function sumDeliveryFeeTaxes(jobTotals: DeliveryJobTotal[]) {
  return jobTotals?.reduce((acc, jobTotal) => acc + calculateDeliveryFeeTax(jobTotal), 0);
}

export function sumDeliveryFees(jobTotals: DeliveryJobTotal[]) {
  return jobTotals?.reduce((acc, jobTotal) => acc + (jobTotal?.delivery_fee ?? 0), 0);
}

export function sumUnder50Overages(jobTotals: DeliveryJobTotal[]) {
  return jobTotals.reduce((acc, jobTotal) => acc + (jobTotal?.sum_under_50_overages ?? 0), 0);
}

export function sumOfSubtotals(jobTotals: DeliveryJobTotal[]) {
  return jobTotals.reduce((acc, jobTotal) => acc + (jobTotal?.subtotal ?? 0), 0);
}

export function sumOfOrdertaxes(jobTotals: DeliveryJobTotal[]) {
  return jobTotals.reduce((acc, jobTotal) => acc + (jobTotal?.tax_total ?? 0), 0);
}


export function calculateInvoiceSummary(jobTotals: DeliveryJobTotal[]) {
  const sumTaxTotal = sumSubsidyTotalTaxes(jobTotals);
  const sumDeliveryFeesTotal = sumDeliveryFees(jobTotals);
  const sumOfDeliveryFeeTaxes = sumDeliveryFeeTaxes(jobTotals);
  const taxTotal = sumTaxTotal + sumOfDeliveryFeeTaxes;
  const taxRate = (jobTotals?.[0]?.tax ?? 0) * 100;
  const subsidyTotal = jobTotals.reduce((acc, jobTotal) => acc + (jobTotal?.subsidy_total ?? 0), 0);
  const sumOfJobTotals = sumJobTotals(jobTotals);
  const sumOfUserTotals = sumUserTotals(jobTotals);
  const sumOfUnder50Overages = sumUnder50Overages(jobTotals)
  const sumOfSubTotals = sumOfSubtotals(jobTotals)
  const sumOfOrderTaxes = sumOfOrdertaxes(jobTotals)

  let obj = {
    taxTotal,
    taxRate,
    sumDeliveryFeesTotal,
    subsidyTotal,
    sumOfJobTotals,
    sumOfUserTotals,
    sumOfDeliveryFeeTaxes,
    sumOfUnder50Overages,
    sumOfSubTotals,
    sumOfOrderTaxes
  };
  return obj
}