export type Currency = 'TRY' | 'USD' | 'EUR' | 'GBP' | 'CUSTOM';

export type ValueRating = 'excellent' | 'good' | 'think_twice' | 'expensive';

export interface CostCalculation {
  id: string;
  productName?: string;
  price: number;
  currency: Currency;
  customCurrencySymbol?: string;
  ownershipDurationValue: number;
  ownershipDurationUnit: 'months' | 'years';
  usesPerWeek: number;
  resaleValue?: number;
  maintenanceCost?: number;
  totalEstimatedUses: number;
  netCost: number;
  costPerUse: number;
  costPerMonth: number;
  costPerYear: number;
  costPerDay: number;
  valueRating: ValueRating;
  createdAt: string;

  // Work cost conversions (optional)
  workHoursCost?: number;
  workHoursPerUse?: number;
  hourlyWageAtCalculation?: number;

  // Installment/payment tracking (optional)
  installmentCount?: number;
  monthlyPayment?: number;
  totalInstallmentCost?: number;
  installmentInterest?: number;
}

export interface AppSettings {
  defaultCurrency: Currency;
  customCurrencySymbol: string;
  defaultDurationValue: number;
  defaultDurationUnit: 'months' | 'years';
  defaultUsesPerWeek: number;
  theme: 'light' | 'dark';
  onboardingCompleted: boolean;

  // Work cost configuration (New!)
  showWorkCost: boolean;
  monthlySalary: number;
  workHoursPerWeek: number;
  hourlyWage: number;

  // Localization (New!)
  language: Language;

  // Auto-fill toggle
  autoFillEnabled: boolean;
}
import type { Language } from '../locales/catalog';
