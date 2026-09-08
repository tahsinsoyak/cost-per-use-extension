/** Minimum whole uses needed to reach a positive cost-per-use target. */
export function getUsesForCostTarget(netCost: number, targetPerUse: number): number | null {
  if (!Number.isFinite(netCost) || netCost < 0 ||
      !Number.isFinite(targetPerUse) || targetPerUse <= 0) return null;

  const ratio = netCost / targetPerUse;
  if (!Number.isFinite(ratio) || ratio > Number.MAX_SAFE_INTEGER) return null;
  // Decimal inputs such as 0.07 / 0.01 can land just above an integer in
  // floating-point arithmetic. Check the adjacent count against the original
  // amounts instead of subtracting a tolerance that grows with large counts.
  let required = Math.max(1, Math.ceil(ratio));
  if (required > 1 && (required - 1) * targetPerUse >= netCost) required -= 1;
  if (required * targetPerUse < netCost) required += 1;
  return Number.isSafeInteger(required) ? required : null;
}
