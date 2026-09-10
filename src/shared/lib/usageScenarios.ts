/** Keep net cost and ownership period fixed; vary only estimated usage. */
export function getUsageScenarios(netCost: number, totalEstimatedUses: number) {
  if (!Number.isFinite(netCost) || netCost < 0 ||
      !Number.isFinite(totalEstimatedUses) || totalEstimatedUses <= 0) {
    return null;
  }

  // Expected uses can be fractional in a scenario. Rounding half a use to zero
  // would incorrectly suggest a free purchase or divide by zero.
  const expected = netCost / totalEstimatedUses;
  const halfUsage = netCost / (totalEstimatedUses * 0.5);
  if (!Number.isFinite(expected) || !Number.isFinite(halfUsage)) return null;
  return { expected, halfUsage };
}
