export const productState = {
  id: "G2_PAPER_TRADING",
  publicLabel: "Paper simulation planning",
  researchOnly: true,
  brokerExecution: false,
  autonomousExecution: false,
  performanceClaims: false,
  operatorApprovalRequired: true,
  wedge: "No trade without evidence. No execution without risk approval."
} as const;

export type ProductState = typeof productState;

export function assertPublicClaim(claim: string): void {
  const forbidden = [
    /guaranteed/i,
    /profitable/i,
    /autonomous trading/i,
    /live execution/i,
    /approved strategy/i
  ];

  const violation = forbidden.find((pattern) => pattern.test(claim));
  if (violation) {
    throw new Error(`Public claim violates ${productState.id}: ${claim}`);
  }
}
