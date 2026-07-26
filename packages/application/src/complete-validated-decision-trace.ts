import {
  DeterministicLearningEventSchema,
  DeterministicSimulationResultSchema,
  Epoch1ReproducibilityCheckpointSchema,
  FrozenDecisionRecordSchema,
  ValidatedDecisionTraceSchema,
  ValidatedSimulationOutcomeSchema,
  type DeterministicLearningEvent,
  type DeterministicSimulationResult,
  type Epoch1ReproducibilityCheckpoint,
  type FrozenDecisionRecord,
  type ValidatedDecisionTrace,
  type ValidatedSimulationOutcome
} from "@traderframe/contracts";
import { hashCanonicalValue } from "./canonical-risk-review.js";
import { evaluateTraceQuality } from "./evaluate-trace-quality.js";

export function completeValidatedDecisionTrace(input: {
  readonly frozenRecord: FrozenDecisionRecord;
  readonly firstSimulation: DeterministicSimulationResult;
  readonly secondSimulation: DeterministicSimulationResult;
  readonly outcome: ValidatedSimulationOutcome;
  readonly learningEvent: DeterministicLearningEvent;
  readonly checkedAt: string;
}): {
  readonly checkpoint: Epoch1ReproducibilityCheckpoint;
  readonly trace: ValidatedDecisionTrace;
} {
  const record = FrozenDecisionRecordSchema.parse(input.frozenRecord);
  const first = DeterministicSimulationResultSchema.parse(input.firstSimulation);
  const second = DeterministicSimulationResultSchema.parse(input.secondSimulation);
  const outcome = ValidatedSimulationOutcomeSchema.parse(input.outcome);
  const learning = DeterministicLearningEventSchema.parse(input.learningEvent);
  const mismatches: string[] = [];

  if (record.bundleHash !== hashCanonicalValue(record.bundle)) {
    mismatches.push("frozen bundle hash mismatch");
  }
  if (!hasCanonicalHash(first, "outputHash") || !hasCanonicalHash(second, "outputHash")) {
    mismatches.push("simulation output hash mismatch");
  }
  if (first.outputHash !== second.outputHash || JSON.stringify(first) !== JSON.stringify(second)) {
    mismatches.push("simulation replay outputs differ");
  }
  if (
    first.frozenBundleHash !== record.bundleHash ||
    second.frozenBundleHash !== record.bundleHash ||
    outcome.frozenBundleHash !== record.bundleHash
  ) {
    mismatches.push("simulation or outcome references a different frozen bundle");
  }
  if (
    first.simulationId !== second.simulationId ||
    outcome.traceId !== record.bundle.traceId ||
    outcome.simulationId !== first.simulationId ||
    learning.sourceOutcomeId !== outcome.outcomeId
  ) {
    mismatches.push("trace, simulation, outcome, or learning IDs do not align");
  }
  if (!hasCanonicalHash(outcome, "outcomeHash") || !hasCanonicalHash(learning, "learningHash")) {
    mismatches.push("outcome or learning content hash mismatch");
  }
  if (
    outcome.simulationOutputHash !== first.outputHash ||
    learning.sourceOutcomeHash !== outcome.outcomeHash
  ) {
    mismatches.push("outcome or learning hash chain is broken");
  }

  const checkpointPayload = {
    schemaVersion: 1 as const,
    checkpointId: `${record.bundle.traceId}:epoch1-reproducibility`,
    traceId: record.bundle.traceId,
    frozenBundleHash: record.bundleHash,
    firstSimulationHash: first.outputHash,
    secondSimulationHash: second.outputHash,
    outcomeHash: outcome.outcomeHash,
    learningHash: learning.learningHash,
    status: mismatches.length === 0 ? ("PASS" as const) : ("FAIL" as const),
    mismatchReasons: mismatches,
    checkedAt: input.checkedAt
  };
  const checkpoint = Epoch1ReproducibilityCheckpointSchema.parse({
    ...checkpointPayload,
    checkpointHash: hashCanonicalValue(checkpointPayload)
  });
  const quality = evaluateTraceQuality({
    requirements: [
      requirement("market_data_provenance", [record.bundle.rawDataHash]),
      requirement("invalidation", [record.bundle.canonicalAssessmentHash]),
      requirement("risk_calculation", [record.bundle.riskReviewHash ?? "missing"]),
      requirement("contradiction_review", [record.bundle.evidenceBundleHash]),
      requirement("operator_rationale", [record.bundle.setupReviewId]),
      requirement("outcome", [outcome.outcomeHash]),
      requirement("learning_event", [learning.learningHash])
    ],
    validityChecks: [
      validity(
        "frozen-input",
        "version_integrity",
        checkpoint.status,
        checkpoint.checkpointHash,
        input.checkedAt
      ),
      validity(
        "risk-link",
        "risk_integrity",
        record.bundle.riskReviewHash ? "PASS" : "FAIL",
        record.bundle.riskReviewHash ?? "missing",
        input.checkedAt
      ),
      validity(
        "simulation-link",
        "simulation_integrity",
        checkpoint.status,
        first.outputHash,
        input.checkedAt
      ),
      validity(
        "provenance-link",
        "provenance_integrity",
        checkpoint.status,
        record.bundle.rawDataHash,
        input.checkedAt
      )
    ],
    reproducibilityStatus: checkpoint.status,
    reproducibilityReasons:
      checkpoint.status === "PASS" ? ["Two canonical replay outputs matched."] : mismatches,
    workflowStatus: checkpoint.status,
    workflowReasons:
      checkpoint.status === "PASS"
        ? ["Frozen decision, simulation, outcome, and learning links resolved."]
        : ["Validated workflow hash chain did not resolve."],
    checkedAt: input.checkedAt
  });

  const trace = ValidatedDecisionTraceSchema.parse({
    schemaVersion: 1,
    traceId: record.bundle.traceId,
    lifecycleStatus: quality.lifecycleStatus,
    completenessScore: quality.completenessScore,
    requirements: [
      requirement("market_data_provenance", [record.bundle.rawDataHash]),
      requirement("invalidation", [record.bundle.canonicalAssessmentHash]),
      requirement("risk_calculation", [record.bundle.riskReviewHash ?? "missing"]),
      requirement("contradiction_review", [record.bundle.evidenceBundleHash]),
      requirement("operator_rationale", [record.bundle.setupReviewId]),
      requirement("outcome", [outcome.outcomeHash]),
      requirement("learning_event", [learning.learningHash])
    ],
    validityChecks: [
      validity(
        "frozen-input",
        "version_integrity",
        checkpoint.status,
        checkpoint.checkpointHash,
        input.checkedAt
      ),
      validity(
        "risk-link",
        "risk_integrity",
        record.bundle.riskReviewHash ? "PASS" : "FAIL",
        record.bundle.riskReviewHash ?? "missing",
        input.checkedAt
      ),
      validity(
        "simulation-link",
        "simulation_integrity",
        checkpoint.status,
        first.outputHash,
        input.checkedAt
      ),
      validity(
        "provenance-link",
        "provenance_integrity",
        checkpoint.status,
        record.bundle.rawDataHash,
        input.checkedAt
      )
    ],
    gates: quality.gates,
    frozenDecisionBundle: record.bundle,
    outcomeId: outcome.outcomeId,
    learningEventId: learning.learningEventId
  });

  return { checkpoint, trace };
}

function hasCanonicalHash<T extends Record<string, unknown>, K extends keyof T>(
  value: T,
  hashKey: K
): boolean {
  const payload = Object.fromEntries(
    Object.entries(value).filter(([key]) => key !== String(hashKey))
  );
  return value[hashKey] === hashCanonicalValue(payload);
}

function requirement(requirementId: string, evidenceIds: string[]) {
  return {
    requirementId,
    label: requirementId.replaceAll("_", " "),
    status: "COMPLETE" as const,
    weight: 10,
    evidenceIds
  };
}

function validity(
  checkId: string,
  area: "version_integrity" | "risk_integrity" | "simulation_integrity" | "provenance_integrity",
  status: "PASS" | "FAIL",
  evidenceId: string,
  checkedAt: string
) {
  return {
    checkId,
    area,
    status,
    ruleVersion: "1.0.0",
    message: status === "PASS" ? `${area} passed.` : `${area} failed.`,
    evidenceIds: [evidenceId],
    checkedAt
  };
}
