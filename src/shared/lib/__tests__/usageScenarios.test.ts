import { describe, expect, it } from 'vitest';
import { getUsageScenarios } from '../usageScenarios';
import { calculateCostPerUse } from '../calculateCostPerUse';

describe('usage scenarios', () => {
  it('doubles cost per use when usage is halved with the same net cost', () => {
    expect(getUsageScenarios(200, 400)).toEqual({ expected: 0.5, halfUsage: 1 });
  });

  it('keeps installment, resale, and maintenance adjustments in both scenarios', () => {
    const result = calculateCostPerUse({
      price: 1000, currency: 'USD', ownershipDurationValue: 1,
      ownershipDurationUnit: 'years', usesPerWeek: 5,
      installmentCount: 12, totalInstallmentCost: 1200,
      resaleValue: 200, maintenanceCost: 44,
    });
    const scenarios = getUsageScenarios(result.netCost, result.totalEstimatedUses)!;
    expect(result.netCost).toBe(1044);
    expect(scenarios.expected).toBe(result.costPerUse);
    expect(scenarios.halfUsage).toBe(8);
  });

  it('does not round odd or very low use counts before calculating', () => {
    expect(getUsageScenarios(15, 3)).toEqual({ expected: 5, halfUsage: 10 });
    expect(getUsageScenarios(15, 1)).toEqual({ expected: 15, halfUsage: 30 });
  });

  it('supports zero net cost', () => {
    expect(getUsageScenarios(0, 20)).toEqual({ expected: 0, halfUsage: 0 });
  });

  it.each([[100, 0], [100, -1], [-1, 20], [NaN, 20], [100, Infinity], [Infinity, 20]])(
    'omits invalid scenarios for net cost %s and uses %s', (netCost, uses) => {
      expect(getUsageScenarios(netCost, uses)).toBeNull();
    },
  );
});
