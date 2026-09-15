export type ValidationError = Partial<Record<'price' | 'ownershipDurationValue' | 'usesPerWeek' | 'resaleValue' | 'maintenanceCost' | 'installmentCount' | 'totalInstallmentCost' | 'hourlyWage', string>>;
export interface ValidationWarning { usesPerWeek?: string; resaleValue?: string }
export interface ValidationInput {
  price: number; ownershipDurationValue: number; ownershipDurationUnit?: 'months' | 'years';
  usesPerWeek: number; resaleValue: number; maintenanceCost: number;
  installmentCount?: number; totalInstallmentCost?: number; hourlyWage?: number;
}
export function validateCalculationInput(inputs: ValidationInput): {errors: ValidationError; warnings: ValidationWarning; isValid: boolean} {
  const errors: ValidationError = {};
  const warnings: ValidationWarning = {};
  for (const key of ['price', 'ownershipDurationValue', 'usesPerWeek'] as const) {
    if (!Number.isFinite(inputs[key]) || inputs[key] <= 0) errors[key] = 'validation.positive';
  }
  for (const key of ['resaleValue', 'maintenanceCost', 'installmentCount', 'totalInstallmentCost', 'hourlyWage'] as const) {
    const value = inputs[key] ?? 0;
    if (!Number.isFinite(value) || value < 0) errors[key] = 'validation.nonnegative';
  }
  const count = inputs.installmentCount ?? 0;
  const total = inputs.totalInstallmentCost ?? 0;
  if (count > 0 && !Number.isSafeInteger(count)) errors.installmentCount = 'validation.whole';
  if (count > 0 && total === 0) errors.totalInstallmentCost = 'validation.paired';
  if (total > 0 && count === 0) errors.installmentCount = 'validation.paired';
  const paid = count > 0 && total > 0 ? total : inputs.price;
  if (!Number.isFinite(paid + inputs.maintenanceCost)) errors.maintenanceCost = 'validation.nonnegative';
  if (inputs.resaleValue > paid + inputs.maintenanceCost) errors.resaleValue = 'validation.resaleLimit';
  const months = inputs.ownershipDurationValue * (inputs.ownershipDurationUnit === 'months' ? 1 : 12);
  const uses = Math.round(months * 4.345 * inputs.usesPerWeek);
  if (!errors.usesPerWeek && !errors.ownershipDurationValue && (!Number.isSafeInteger(uses) || uses < 1)) errors.usesPerWeek = 'validation.usageRange';
  if (inputs.usesPerWeek > 21) warnings.usesPerWeek = 'calculator.warnings.highUsage';
  return { errors, warnings, isValid: Object.keys(errors).length === 0 };
}
export default validateCalculationInput;
