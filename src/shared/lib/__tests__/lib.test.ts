import { describe, it, expect } from 'vitest';
import { calculateCostPerUse } from '../calculateCostPerUse';
import { formatCurrency, getCurrencySymbol } from '../formatCurrency';
import { validateCalculationInput } from '../validation';
import { getValueRating, getRatingDetails } from '../valueRating';

describe('Cost Per Use Formula Tests', () => {
  it('should correctly calculate for ₺4000 headphones, 2 years, 5 uses/week', () => {
    const result = calculateCostPerUse({
      productName: 'Premium Headphones',
      price: 4000,
      currency: 'TRY',
      ownershipDurationValue: 2,
      ownershipDurationUnit: 'years',
      usesPerWeek: 5,
    });

    // 2 years = 24 months
    // Weeks = 24 * 4.345 = 104.28
    // Uses = 104.28 * 5 = 521.4 => Rounded to 521
    expect(result.totalEstimatedUses).toBe(521);
    expect(result.netCost).toBe(4000);
    // Cost per use = 4000 / 521 = 7.6775...
    expect(result.costPerUse).toBeCloseTo(7.68, 1);
    expect(result.costPerMonth).toBeCloseTo(166.67, 1);
    expect(result.costPerYear).toBe(2000);
    expect(result.valueRating).toBe('excellent');
  });

  it('should correctly calculate for $1200 laptop, 4 years, 5 uses/week', () => {
    const result = calculateCostPerUse({
      productName: 'Developer Laptop',
      price: 1200,
      currency: 'USD',
      ownershipDurationValue: 4,
      ownershipDurationUnit: 'years',
      usesPerWeek: 5,
    });

    // 4 years = 48 months
    // Weeks = 48 * 4.345 = 208.56
    // Uses = 208.56 * 5 = 1042.8 => Rounded to 1043
    expect(result.totalEstimatedUses).toBe(1043);
    // Cost per use = 1200 / 1043 = 1.1505...
    expect(result.costPerUse).toBeCloseTo(1.15, 1);
    expect(result.costPerMonth).toBe(25);
    expect(result.costPerYear).toBe(300);
    expect(result.valueRating).toBe('excellent');
  });

  it('should incorporate resale value and maintenance cost correctly', () => {
    const result = calculateCostPerUse({
      price: 100,
      currency: 'USD',
      ownershipDurationValue: 12,
      ownershipDurationUnit: 'months',
      usesPerWeek: 2,
      resaleValue: 30,
      maintenanceCost: 10,
    });

    // netCost = 100 + 10 - 30 = 80
    expect(result.netCost).toBe(80);
    
    // 12 months -> Weeks = 12 * 4.345 = 52.14
    // Uses = 52.14 * 2 = 104.28 => Rounded to 104
    expect(result.totalEstimatedUses).toBe(104);
    
    // Cost per use = 80 / 104 = 0.7692...
    expect(result.costPerUse).toBeCloseTo(0.77, 1);
  });

  it('should calculate work hours cost correctly when hourlyWage is provided', () => {
    const result = calculateCostPerUse({
      price: 500,
      currency: 'USD',
      ownershipDurationValue: 1,
      ownershipDurationUnit: 'years',
      usesPerWeek: 5,
      hourlyWage: 25,
    });

    expect(result.netCost).toBe(500);
    expect(result.workHoursCost).toBe(20); // 500 / 25 = 20 hours
    expect(result.hourlyWageAtCalculation).toBe(25);
    // workHoursPerUse = 20 hours / 260 uses
    expect(result.workHoursPerUse).toBeCloseTo(0.077, 2);
  });

  it('should calculate costPerDay correctly', () => {
    const result = calculateCostPerUse({
      price: 365,
      currency: 'USD',
      ownershipDurationValue: 1,
      ownershipDurationUnit: 'years',
      usesPerWeek: 7,
    });

    // 12 months * 30.44 days = 365.28 days
    // costPerDay = 365 / 365.28 ≈ 0.999
    expect(result.costPerDay).toBeCloseTo(1.0, 0);
  });

  it('should calculate installment costs correctly', () => {
    const result = calculateCostPerUse({
      price: 1000,
      currency: 'TRY',
      ownershipDurationValue: 1,
      ownershipDurationUnit: 'years',
      usesPerWeek: 5,
      installmentCount: 12,
      totalInstallmentCost: 1200, // 1000 + 200 interest
    });

    // totalInstallmentCost replaces price for net cost
    expect(result.netCost).toBe(1200);
    expect(result.installmentCount).toBe(12);
    expect(result.monthlyPayment).toBe(100); // 1200 / 12
    expect(result.installmentInterest).toBe(200); // 1200 - 1000
    expect(result.totalInstallmentCost).toBe(1200);
    // costPerUse = 1200 / (12*4.345*5) = 1200/260.7 ≈ 4.60
    expect(result.costPerUse).toBeCloseTo(4.60, 0);
  });

  it('should not set installment fields when not provided', () => {
    const result = calculateCostPerUse({
      price: 500,
      currency: 'USD',
      ownershipDurationValue: 1,
      ownershipDurationUnit: 'years',
      usesPerWeek: 5,
    });

    expect(result.installmentCount).toBeUndefined();
    expect(result.monthlyPayment).toBeUndefined();
    expect(result.totalInstallmentCost).toBeUndefined();
    expect(result.installmentInterest).toBeUndefined();
  });
});

describe('Currency Formatter Tests', () => {
  it('should return correct currency symbols', () => {
    expect(getCurrencySymbol('TRY')).toBe('₺');
    expect(getCurrencySymbol('USD')).toBe('$');
    expect(getCurrencySymbol('EUR')).toBe('€');
    expect(getCurrencySymbol('GBP')).toBe('£');
    expect(getCurrencySymbol('CUSTOM', '¥')).toBe('¥');
  });

  it('should format values correctly', () => {
    // We replace non-breaking spaces (\u00a0) that toLocaleString sometimes uses
    const clean = (val: string) => val.replace(/\s/g, ' ');

    expect(clean(formatCurrency(120.5, 'USD'))).toContain('$120.50');
    expect(clean(formatCurrency(4000, 'TRY'))).toContain('₺4,000');
    expect(clean(formatCurrency(0.58, 'EUR'))).toContain('€0.58');
    expect(clean(formatCurrency(1500, 'CUSTOM', '¥'))).toContain('¥1,500');
  });
});

describe('Value Rating Tests', () => {
  it('should assign correct value ratings based on total uses', () => {
    expect(getValueRating(250)).toBe('excellent');
    expect(getValueRating(100)).toBe('good');
    expect(getValueRating(30)).toBe('think_twice');
    expect(getValueRating(5)).toBe('expensive');
  });

  it('should return correct metadata copy and color classes', () => {
    const details = getRatingDetails('excellent');
    expect(details.label).toBe('Excellent value');
    expect(details.className).toContain('text-success');
    expect(details.explanation).toContain('affordable per use');
  });
});

describe('Input Validation Tests', () => {
  it('should pass on valid input', () => {
    const { isValid, errors } = validateCalculationInput({
      price: 150,
      ownershipDurationValue: 12,
      usesPerWeek: 3,
      resaleValue: 0,
      maintenanceCost: 0,
    });
    expect(isValid).toBe(true);
    expect(Object.keys(errors).length).toBe(0);
  });

  it('should fail on invalid price', () => {
    const { isValid, errors } = validateCalculationInput({
      price: 0,
      ownershipDurationValue: 6,
      usesPerWeek: 1,
      resaleValue: 0,
      maintenanceCost: 0,
    });
    expect(isValid).toBe(false);
    expect(errors.price).toBe('Enter a valid price.');
  });

  it('should alert on high weekly usages', () => {
    const { isValid, warnings } = validateCalculationInput({
      price: 100,
      ownershipDurationValue: 6,
      usesPerWeek: 25,
      resaleValue: 0,
      maintenanceCost: 0,
    });
    expect(isValid).toBe(true);
    expect(warnings.usesPerWeek).toBe('This usage estimate seems unusually high. You can still continue.');
  });

  it('should fail if resale exceeds total costs', () => {
    const { isValid, errors } = validateCalculationInput({
      price: 100,
      ownershipDurationValue: 6,
      usesPerWeek: 5,
      resaleValue: 120,
      maintenanceCost: 10,
    });
    expect(isValid).toBe(false);
    expect(errors.resaleValue).toBe('Resale value is higher than product cost. Please check your input.');
  });
});
