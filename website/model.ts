import { calculateCostPerUse } from '../src/shared/lib/calculateCostPerUse';
import type { Currency } from '../src/shared/types/calculation';

export interface Purchase {
  price:number; years:number; uses:number; currency:Currency;
  resale:number; maintenance:number; payments:number; totalPaid:number;
}

export type PurchaseField = Exclude<keyof Purchase, 'currency'>;
export type PurchaseError = 'positive' | 'nonnegative' | 'whole' | 'paired' | 'resaleLimit' | 'usageRange';

export function validatePurchase(p:Purchase): Partial<Record<PurchaseField, PurchaseError>> {
  const errors: Partial<Record<PurchaseField, PurchaseError>> = {};
  for (const key of ['price','years','uses'] as const)
    if (!Number.isFinite(p[key]) || p[key] <= 0) errors[key] = 'positive';
  for (const key of ['resale','maintenance','payments','totalPaid'] as const)
    if (!Number.isFinite(p[key]) || p[key] < 0) errors[key] = 'nonnegative';
  if (!errors.payments && !Number.isSafeInteger(p.payments)) errors.payments = 'whole';
  if (p.payments > 0 && p.totalPaid === 0) errors.totalPaid = 'paired';
  if (p.totalPaid > 0 && p.payments === 0) errors.payments = 'paired';
  const paid = p.payments > 0 && p.totalPaid > 0 ? p.totalPaid : p.price;
  if (!errors.resale && p.resale > paid + p.maintenance) errors.resale = 'resaleLimit';
  const uses = Math.round(p.years * 12 * 4.345 * p.uses);
  if (!errors.years && !errors.uses && (uses < 1 || !Number.isSafeInteger(uses))) errors.uses = 'usageRange';
  return errors;
}

export function estimatePurchase(p:Purchase) {
  const paid=p.payments>0&&p.totalPaid>0?p.totalPaid:p.price;
  if (Object.keys(validatePurchase(p)).length || !Number.isFinite(paid+p.maintenance)) return null;
  const result=calculateCostPerUse({price:p.price,currency:p.currency,ownershipDurationValue:p.years,
    ownershipDurationUnit:'years',usesPerWeek:p.uses,resaleValue:p.resale,maintenanceCost:p.maintenance,
    installmentCount:p.payments,totalInstallmentCost:p.totalPaid});
  return result.totalEstimatedUses>0 && Number.isSafeInteger(result.totalEstimatedUses) &&
    Number.isFinite(result.netCost) && Number.isFinite(result.costPerUse) ? result : null;
}
