import { CostCalculation, Currency } from '../types/calculation';
import { getValueRating } from './valueRating';

export interface CalculationInput {
  productName?: string;
  price: number;
  currency: Currency;
  customCurrencySymbol?: string;
  ownershipDurationValue: number;
  ownershipDurationUnit: 'months' | 'years';
  usesPerWeek: number;
  resaleValue?: number;
  maintenanceCost?: number;
  
  // Work cost configuration
  hourlyWage?: number;

  // Installment/payment tracking
  installmentCount?: number;        // number of monthly installments
  totalInstallmentCost?: number;    // total amount paid with installments (price + interest)
}

export function calculateCostPerUse(input: CalculationInput): Omit<CostCalculation, 'id' | 'createdAt'> {
  const {
    price,
    ownershipDurationValue,
    ownershipDurationUnit,
    usesPerWeek,
    resaleValue = 0,
    maintenanceCost = 0,
    hourlyWage = 0,
    installmentCount,
    totalInstallmentCost,
  } = input;

  // If paying in installments, use total installment cost as the actual price paid
  const actualPricePaid = (installmentCount && totalInstallmentCost && totalInstallmentCost > 0) 
    ? totalInstallmentCost 
    : price;

  // netCost = actualPricePaid + maintenanceCost - resaleValue
  const netCost = Math.max(0, actualPricePaid + maintenanceCost - resaleValue);
  
  // Convert duration to months
  const durationInMonths = ownershipDurationUnit === 'years'
    ? ownershipDurationValue * 12
    : ownershipDurationValue;

  const durationInYears = durationInMonths / 12;
  const durationInDays = durationInMonths * 30.44; // average days per month

  // totalWeeks = durationInMonths * 4.345
  const totalWeeks = durationInMonths * 4.345;
  const totalEstimatedUses = Math.round(totalWeeks * usesPerWeek);

  // Divide-by-zero safety
  const costPerUse = totalEstimatedUses > 0 ? netCost / totalEstimatedUses : 0;
  const costPerMonth = durationInMonths > 0 ? netCost / durationInMonths : 0;
  const costPerYear = durationInYears > 0 ? netCost / durationInYears : 0;
  const costPerDay = durationInDays > 0 ? netCost / durationInDays : 0;

  const valueRating = getValueRating(totalEstimatedUses);

  // Calculate equivalent work hours required to purchase the product
  const workHoursCost = hourlyWage > 0 ? netCost / hourlyWage : undefined;
  // Calculate work hours per single use
  const workHoursPerUse = hourlyWage > 0 && totalEstimatedUses > 0 ? (netCost / hourlyWage) / totalEstimatedUses : undefined;

  // Installment calculations
  const monthlyPayment = (installmentCount && installmentCount > 0 && totalInstallmentCost && totalInstallmentCost > 0)
    ? totalInstallmentCost / installmentCount
    : undefined;
  const installmentInterest = (totalInstallmentCost && totalInstallmentCost > price)
    ? totalInstallmentCost - price
    : undefined;

  return {
    productName: input.productName || '',
    price,
    currency: input.currency,
    customCurrencySymbol: input.customCurrencySymbol,
    ownershipDurationValue,
    ownershipDurationUnit,
    usesPerWeek,
    resaleValue,
    maintenanceCost,
    totalEstimatedUses,
    netCost,
    costPerUse,
    costPerMonth,
    costPerYear,
    costPerDay,
    valueRating,
    
    // Work cost properties
    workHoursCost,
    workHoursPerUse,
    hourlyWageAtCalculation: hourlyWage > 0 ? hourlyWage : undefined,

    // Installment properties
    installmentCount: installmentCount && installmentCount > 0 ? installmentCount : undefined,
    monthlyPayment,
    totalInstallmentCost: totalInstallmentCost && totalInstallmentCost > 0 ? totalInstallmentCost : undefined,
    installmentInterest: installmentInterest && installmentInterest > 0 ? installmentInterest : undefined,
  };
}
