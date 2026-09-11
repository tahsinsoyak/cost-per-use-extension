import { calculateCostPerUse } from '../src/shared/lib/calculateCostPerUse';
import type { Currency } from '../src/shared/types/calculation';

export interface Purchase {
  price:number; years:number; uses:number; currency:Currency;
  resale:number; maintenance:number; payments:number; totalPaid:number;
}

export function estimatePurchase(p:Purchase) {
  const paid=p.payments>0&&p.totalPaid>0?p.totalPaid:p.price;
  if (![p.price,p.years,p.uses].every(n=>Number.isFinite(n)&&n>0) ||
      ![p.resale,p.maintenance,p.payments,p.totalPaid].every(n=>Number.isFinite(n)&&n>=0) ||
      p.resale>paid+p.maintenance || !Number.isInteger(p.payments) ||
      !((p.payments===0&&p.totalPaid===0)||(p.payments>0&&p.totalPaid>0))) return null;
  const result=calculateCostPerUse({price:p.price,currency:p.currency,ownershipDurationValue:p.years,
    ownershipDurationUnit:'years',usesPerWeek:p.uses,resaleValue:p.resale,maintenanceCost:p.maintenance,
    installmentCount:p.payments,totalInstallmentCost:p.totalPaid});
  return result.totalEstimatedUses>0 && Number.isSafeInteger(result.totalEstimatedUses) &&
    Number.isFinite(result.netCost) && Number.isFinite(result.costPerUse) ? result : null;
}
