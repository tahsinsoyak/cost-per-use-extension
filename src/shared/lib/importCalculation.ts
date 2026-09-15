import { calculateCostPerUse } from './calculateCostPerUse';
import { validateCalculationInput } from './validation';
import type { CostCalculation, Currency } from '../types/calculation';

/** Validate imported inputs and derive results rather than trusting supplied totals. */
export function importCalculation(value: unknown): CostCalculation | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Record<string, unknown>;
  if (typeof item.id !== 'string' || !item.id.trim() ||
      !['USD', 'TRY', 'EUR', 'GBP', 'CUSTOM'].includes(String(item.currency)) ||
      !['price', 'ownershipDurationValue', 'usesPerWeek'].every(key => typeof item[key] === 'number') ||
      (item.ownershipDurationUnit !== undefined && !['months', 'years'].includes(String(item.ownershipDurationUnit)))) return null;
  for (const key of ['resaleValue', 'maintenanceCost', 'installmentCount', 'totalInstallmentCost', 'hourlyWageAtCalculation']) {
    if (item[key] !== undefined && (typeof item[key] !== 'number' || !Number.isFinite(item[key]))) return null;
  }
  const input = {
    productName: typeof item.productName === 'string' ? item.productName : '',
    price: item.price as number,
    currency: item.currency as Currency,
    customCurrencySymbol: typeof item.customCurrencySymbol === 'string' ? item.customCurrencySymbol : '',
    ownershipDurationValue: item.ownershipDurationValue as number,
    ownershipDurationUnit: item.ownershipDurationUnit === 'months' ? 'months' as const : 'years' as const,
    usesPerWeek: item.usesPerWeek as number,
    resaleValue: (item.resaleValue as number | undefined) ?? 0,
    maintenanceCost: (item.maintenanceCost as number | undefined) ?? 0,
    installmentCount: item.installmentCount as number | undefined,
    totalInstallmentCost: item.totalInstallmentCost as number | undefined,
    hourlyWage: item.hourlyWageAtCalculation as number | undefined,
  };
  if (!validateCalculationInput(input).isValid) return null;
  if (typeof item.createdAt !== 'string' || !Number.isFinite(Date.parse(item.createdAt))) return null;
  const result = calculateCostPerUse(input);
  if (Object.values(result).some(field => typeof field === 'number' && !Number.isFinite(field))) return null;
  return {...result, id: item.id, createdAt: new Date(item.createdAt).toISOString()};
}
