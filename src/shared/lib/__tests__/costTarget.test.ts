import { describe, expect, it } from 'vitest';
import { getUsesForCostTarget } from '../costTarget';
import { calculateCostPerUse } from '../calculateCostPerUse';

describe('personal cost-per-use target', () => {
  it.each([
    [200, 0.5, 400], [100, 3, 34], [0.07, 0.01, 7],
    [100.01, 1, 101], [0, 0.5, 1], [20, 100, 1], [1000000000000000.1, 1, 1000000000000001],
  ])('requires %s net cost / %s target rounded up to %s uses', (cost, target, expected) => {
    expect(getUsesForCostTarget(cost, target)).toBe(expected);
  });

  it('finds the minimum whole-use count without rounding the displayed cost first', () => {
    const uses = getUsesForCostTarget(100, 0.3)!;
    expect(100 / uses).toBeLessThanOrEqual(0.3);
    expect(100 / (uses - 1)).toBeGreaterThan(0.3);
  });

  it('uses total installment, maintenance and resale adjustments', () => {
    const result = calculateCostPerUse({
      price: 1000, currency: 'TRY', ownershipDurationValue: 1,
      ownershipDurationUnit: 'years', usesPerWeek: 5,
      installmentCount: 12, totalInstallmentCost: 1200,
      maintenanceCost: 50, resaleValue: 200,
    });
    expect(getUsesForCostTarget(result.netCost, 5)).toBe(210);
  });

  it.each([[100, 0], [100, -1], [-1, 1], [NaN, 1], [100, NaN],
    [Infinity, 1], [100, Infinity], [100, Number.MIN_VALUE], [Number.MAX_VALUE, 1], [Number.MAX_SAFE_INTEGER + 1, 1]])(
    'rejects invalid or unrepresentable cost %s / target %s', (cost, target) => {
      expect(getUsesForCostTarget(cost, target)).toBeNull();
    },
  );
});
