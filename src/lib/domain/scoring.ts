/**
 * Estimates how much equity value could be challenged if free, open, and decentralized
 * substitutes erode the rent-heavy portion of a company’s business.
 *
 * The formula is intentionally editorial rather than academic:
 * - high decentralizability increases the share of value at risk
 * - stronger moats reduce the rate of capital release
 * - profitability increases the amount of value that exists to be challenged
 */
export function calculateFreedCapitalPotential(
  marketCap: number,
  moatScore: number,
  decentralizabilityScore: number,
  profitabilityScore: number
) {
  const decentralizationFactor = decentralizabilityScore / 10;
  const moatResistance = 1 - moatScore / 12;
  const profitElasticity = 0.55 + profitabilityScore / 20;

  return Math.max(0, marketCap * decentralizationFactor * moatResistance * profitElasticity);
}
