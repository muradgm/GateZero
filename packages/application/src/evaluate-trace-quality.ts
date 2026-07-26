import type { TraceRequirementStatus, TraceValidityArea } from "@traderframe/contracts";

export type TraceRequirementInput = {
  requirementId: string;
  label: string;
  status: TraceRequirementStatus;
  weight: number;
  evidenceIds: string[];
  failureReason?: string;
};

export type TraceValidityCheckInput = {
  checkId: string;
  area: TraceValidityArea;
  status: "PASS" | "FAIL" | "BLOCKED" | "NOT_RUN";
  ruleVersion: string;
  message: string;
  evidenceIds: string[];
  checkedAt: string;
};

export type TraceQualityEvaluationInput = {
  requirements: TraceRequirementInput[];
  validityChecks: TraceValidityCheckInput[];
  reproducibilityStatus: "PASS" | "FAIL" | "BLOCKED" | "NOT_RUN";
  reproducibilityReasons?: string[];
  workflowStatus: "PASS" | "FAIL" | "BLOCKED" | "NOT_RUN";
  workflowReasons?: string[];
  checkedAt: string;
};

export type TraceQualityEvaluation = {
  completenessScore: number;
  lifecycleStatus: "OPEN" | "INCOMPLETE" | "COMPLETE";
  gates: Array<{
    gate: "COMPLETENESS" | "VALIDITY" | "REPRODUCIBILITY" | "WORKFLOW";
    status: "PASS" | "FAIL" | "BLOCKED" | "NOT_RUN";
    reasons: string[];
    checkedAt: string;
  }>;
  failedValidityAreas: TraceValidityArea[];
  appliedCaps: Array<{ requirementId: string; maximumScore: number; reason: string }>;
};

const completionFactor: Record<TraceRequirementStatus, number> = {
  COMPLETE: 1,
  PARTIAL: 0.5,
  MISSING: 0,
  STALE: 0,
  NOT_APPLICABLE: 0
};

const hardCaps: Record<string, { maximumScore: number; reason: string }> = {
  market_data_provenance: {
    maximumScore: 40,
    reason: "Missing market-data provenance caps completeness at 40."
  },
  invalidation: {
    maximumScore: 50,
    reason: "Missing invalidation caps completeness at 50."
  },
  risk_calculation: {
    maximumScore: 55,
    reason: "Missing risk calculation caps completeness at 55."
  },
  contradiction_review: {
    maximumScore: 65,
    reason: "Missing contradiction review caps completeness at 65."
  },
  operator_rationale: {
    maximumScore: 75,
    reason: "Missing operator rationale caps completeness at 75."
  }
};

export function evaluateTraceQuality(input: TraceQualityEvaluationInput): TraceQualityEvaluation {
  if (input.requirements.length === 0) {
    throw new Error("trace quality evaluation requires at least one requirement");
  }

  const applicable = input.requirements.filter((item) => item.status !== "NOT_APPLICABLE");
  const totalWeight = applicable.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0) {
    throw new Error("applicable trace requirements must have positive total weight");
  }

  const completedWeight = applicable.reduce(
    (sum, item) => sum + item.weight * completionFactor[item.status],
    0
  );
  let completenessScore = Math.round((completedWeight / totalWeight) * 100);

  const appliedCaps = applicable
    .flatMap((item) => {
      if (item.status === "COMPLETE") return [];
      const cap = hardCaps[item.requirementId];
      return cap ? [{ requirementId: item.requirementId, ...cap }] : [];
    })
    .sort((left, right) => left.maximumScore - right.maximumScore);

  for (const cap of appliedCaps) {
    completenessScore = Math.min(completenessScore, cap.maximumScore);
  }

  const incompleteRequirements = applicable.filter((item) => item.status !== "COMPLETE");
  const completenessStatus = incompleteRequirements.length === 0 ? "PASS" : "FAIL";
  const completenessReasons = incompleteRequirements.length
    ? incompleteRequirements.map(
        (item) => `${item.label}: ${item.failureReason ?? item.status.toLowerCase()}`
      )
    : ["All applicable trace requirements are complete."];

  const failedChecks = input.validityChecks.filter((check) => check.status === "FAIL");
  const blockedChecks = input.validityChecks.filter((check) => check.status === "BLOCKED");
  const notRunChecks = input.validityChecks.filter((check) => check.status === "NOT_RUN");
  const validityStatus = failedChecks.length
    ? "FAIL"
    : blockedChecks.length
      ? "BLOCKED"
      : notRunChecks.length
        ? "NOT_RUN"
        : "PASS";
  const validityReasons =
    validityStatus === "PASS"
      ? ["All configured trace-validity checks passed."]
      : input.validityChecks
          .filter((check) => check.status !== "PASS")
          .map((check) => `${check.area}: ${check.message}`);

  const gates: TraceQualityEvaluation["gates"] = [
    {
      gate: "COMPLETENESS",
      status: completenessStatus,
      reasons: completenessReasons,
      checkedAt: input.checkedAt
    },
    {
      gate: "VALIDITY",
      status: validityStatus,
      reasons: validityReasons,
      checkedAt: input.checkedAt
    },
    {
      gate: "REPRODUCIBILITY",
      status: input.reproducibilityStatus,
      reasons: normalizeReasons(
        input.reproducibilityStatus,
        input.reproducibilityReasons,
        "Canonical outputs reproduced from frozen inputs."
      ),
      checkedAt: input.checkedAt
    },
    {
      gate: "WORKFLOW",
      status: input.workflowStatus,
      reasons: normalizeReasons(
        input.workflowStatus,
        input.workflowReasons,
        "Browser workflow completed successfully."
      ),
      checkedAt: input.checkedAt
    }
  ];

  const allPassed = gates.every((gate) => gate.status === "PASS");
  const lifecycleStatus = allPassed
    ? "COMPLETE"
    : gates.some((gate) => gate.status === "NOT_RUN" || gate.status === "BLOCKED")
      ? "OPEN"
      : "INCOMPLETE";

  return {
    completenessScore,
    lifecycleStatus,
    gates,
    failedValidityAreas: [...new Set(failedChecks.map((check) => check.area))],
    appliedCaps
  };
}

function normalizeReasons(
  status: "PASS" | "FAIL" | "BLOCKED" | "NOT_RUN",
  reasons: string[] | undefined,
  passMessage: string
): string[] {
  if (reasons?.length) return reasons;
  if (status === "PASS") return [passMessage];
  return [`${status.toLowerCase().replaceAll("_", " ")} without a recorded reason.`];
}
