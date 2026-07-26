import {
  DeterministicLearningEventSchema,
  DeterministicSimulationResultSchema,
  FrozenDecisionRecordSchema,
  ValidatedSimulationOutcomeSchema,
  type DeterministicLearningEvent,
  type DeterministicSimulationResult,
  type FrozenDecisionRecord,
  type ValidatedSimulationOutcome
} from "@traderframe/contracts";
import { hashCanonicalValue } from "./canonical-risk-review.js";

export function recordSimulationOutcome(input: {
  readonly frozenRecord: FrozenDecisionRecord;
  readonly simulation: DeterministicSimulationResult;
  readonly operatorNote: string;
  readonly attributedAt: string;
}): ValidatedSimulationOutcome {
  const record = FrozenDecisionRecordSchema.parse(input.frozenRecord);
  const simulation = DeterministicSimulationResultSchema.parse(input.simulation);

  if (record.bundleHash !== hashCanonicalValue(record.bundle)) {
    throw new Error("cannot attribute outcome to a tampered frozen bundle");
  }
  if (
    simulation.frozenBundleHash !== record.bundleHash ||
    simulation.outputHash !==
      hashCanonicalValue(
        Object.fromEntries(Object.entries(simulation).filter(([key]) => key !== "outputHash"))
      )
  ) {
    throw new Error("simulation output does not match its frozen decision evidence");
  }

  const payload = {
    schemaVersion: 1 as const,
    outcomeId: `${record.bundle.traceId}:outcome`,
    traceId: record.bundle.traceId,
    frozenBundleHash: record.bundleHash,
    simulationId: simulation.simulationId,
    simulationOutputHash: simulation.outputHash,
    disposition: simulation.status,
    ...(simulation.realizedR === undefined ? {} : { realizedR: simulation.realizedR }),
    ...(simulation.maeR === undefined ? {} : { maeR: simulation.maeR }),
    ...(simulation.mfeR === undefined ? {} : { mfeR: simulation.mfeR }),
    operatorNote: input.operatorNote,
    operatorNoteAuthorship: "MANUAL_LOCAL" as const,
    attributedAt: input.attributedAt,
    performanceClaim: false as const,
    executionPath: false as const
  };
  return ValidatedSimulationOutcomeSchema.parse({
    ...payload,
    outcomeHash: hashCanonicalValue(payload)
  });
}

export function createDeterministicLearningEvent(
  outcomeInput: ValidatedSimulationOutcome
): DeterministicLearningEvent {
  const outcome = ValidatedSimulationOutcomeSchema.parse(outcomeInput);
  const categoryByDisposition = {
    TARGET: "PLAN_COMPLETED",
    STOP: "RISK_REALIZED",
    EXPIRED: "TIME_EXIT",
    NOT_FILLED: "ENTRY_NOT_REACHED",
    INVALID: "SIMULATION_INVALID"
  } as const;
  const category = categoryByDisposition[outcome.disposition];
  const payload = {
    schemaVersion: 1 as const,
    learningEventId: `${outcome.outcomeId}:learning`,
    sourceOutcomeId: outcome.outcomeId,
    sourceOutcomeHash: outcome.outcomeHash,
    category,
    summary: learningSummary(category),
    evidenceIds: [outcome.frozenBundleHash, outcome.simulationOutputHash],
    createdAt: outcome.attributedAt,
    updatesRules: false as const,
    updatesRiskLimits: false as const,
    autonomyChange: "NONE" as const
  };
  return DeterministicLearningEventSchema.parse({
    ...payload,
    learningHash: hashCanonicalValue(payload)
  });
}

function learningSummary(category: DeterministicLearningEvent["category"]): string {
  switch (category) {
    case "PLAN_COMPLETED":
      return "The frozen local simulation plan reached its defined target.";
    case "RISK_REALIZED":
      return "The frozen local simulation plan reached its defined risk boundary.";
    case "TIME_EXIT":
      return "The local simulation ended at its configured holding limit.";
    case "ENTRY_NOT_REACHED":
      return "The frozen entry condition was not reached by the available candles.";
    case "SIMULATION_INVALID":
      return "The simulation could not resolve an outcome under its frozen policy.";
  }
}
