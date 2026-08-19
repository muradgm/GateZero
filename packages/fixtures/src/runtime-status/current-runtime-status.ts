import {
  RuntimeStatusBoundarySchema,
  type RuntimeStatusBoundary
} from "../../../contracts/src/runtime-status.js";

export const currentRuntimeStatus: RuntimeStatusBoundary = RuntimeStatusBoundarySchema.parse({
  product: "TraderFrame",
  controlPlane: "GateZero",
  operatingGate: "G2_PAPER_TRADING",
  operatingScope: "paper_simulation_planning_only",
  productMode: "local_research_and_read_only_decision_support",
  executionAuthority: "none",
  currentInitiative: "Trading Intelligence Command Center",
  currentMilestone: "Evidence-Gated Setup Review MVP",
  allowedOperatorOutcomes: ["REJECT", "WATCH", "PAPER_SIMULATE"],
  boundaries: {
    blocked: [
      "broker or exchange integration",
      "external account access",
      "credential handling",
      "live order routing",
      "external paper order routing",
      "autonomous execution",
      "unreviewed AI directional decisions",
      "performance, approval, or readiness claims",
      "report, share, print, or publishing channels"
    ],
    allowed: [
      "local deterministic research evidence",
      "local paper-simulation evidence",
      "read-only decision support",
      "manual operator review",
      "evidence-linked REJECT, WATCH, or PAPER_SIMULATE outcomes"
    ]
  }
});
