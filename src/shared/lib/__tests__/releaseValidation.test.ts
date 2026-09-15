import { expect, it } from 'vitest';
import { validateCalculationInput } from '../validation';
import { importCalculation } from '../importCalculation';

const input = {price: 200, ownershipDurationValue: 1, ownershipDurationUnit: 'years' as const, usesPerWeek: 5, resaleValue: 0, maintenanceCost: 0};
it.each([{price: Infinity}, {maintenanceCost: -1}, {resaleValue: -1}, {installmentCount: 12}, {totalInstallmentCost: 240}, {installmentCount: 1.5, totalInstallmentCost: 240}, {usesPerWeek: 0.0001}, {ownershipDurationValue: 1e30}, {hourlyWage: -2}])('rejects invalid release inputs %j', change => {
  expect(validateCalculationInput({...input, ...change}).isValid).toBe(false);
});
it('checks resale against the financed total and accepts zero net cost', () => {
  expect(validateCalculationInput({...input, installmentCount: 12, totalInstallmentCost: 240, resaleValue: 240}).isValid).toBe(true);
  expect(validateCalculationInput({...input, installmentCount: 12, totalInstallmentCost: 150, resaleValue: 180}).isValid).toBe(false);
});
const saved = {...input, id: 'saved-in-1.0.2', currency: 'USD', createdAt: '2026-07-18T12:00:00.000Z', costPerUse: 0.01, netCost: -99, totalEstimatedUses: 999999, valueRating: 'expensive'};
it('preserves an old record identity while recomputing its totals and usage band', () => {
  const result = importCalculation(saved)!;
  expect(result.id).toBe(saved.id);
  expect(result.createdAt).toBe(saved.createdAt);
  expect(result.netCost).toBe(200);
  expect(result.totalEstimatedUses).toBe(261);
  expect(result.costPerUse).toBeCloseTo(200/261);
  expect(result.valueRating).toBe('excellent');
});
it.each([{currency: 'invalid'}, {price: -1}, {price: '200'}, {usesPerWeek: 1e308}, {maintenanceCost: 'bad'}, {createdAt: 'bad'}, {installmentCount: 12}, {ownershipDurationUnit: 'days'}])('rejects malformed imported records %j', change => {
  expect(importCalculation({...saved, ...change})).toBeNull();
});
