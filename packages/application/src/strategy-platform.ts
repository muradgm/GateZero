import {
  EurUsdLondonRangeBreakoutObservationSchema,
  EurUsdLondonRangeBreakoutStrategySchema,
  EurUsdOverlapPullbackObservationSchema,
  EurUsdOverlapPullbackStrategySchema,
  MultiStrategyCheckpointSchema,
  MultiStrategyLifecycleSchema,
  RegisteredStrategyAssessmentSchema,
  StrategyRegistrationSchema,
  type CanonicalDecisionAssessment,
  type EurUsdLondonRangeBreakoutObservation,
  type EurUsdLondonRangeBreakoutStrategy,
  type EurUsdOverlapPullbackObservation,
  type EurUsdOverlapPullbackStrategy,
  type MultiStrategyCheckpoint,
  type MultiStrategyLifecycle,
  type RegisteredStrategyAssessment,
  type StrategyRegistration,
  type SupportedStrategyId
} from "@traderframe/contracts";
import { buildCanonicalDecisionAssessment } from "./build-canonical-decision-assessment.js";
import { buildCanonicalRangeBreakoutAssessment } from "./build-canonical-range-breakout-assessment.js";
import { hashCanonicalValue } from "./canonical-risk-review.js";
import { EURUSD_LONDON_RANGE_BREAKOUT_V1 } from "./evaluate-eurusd-london-range-breakout.js";
import { EURUSD_OVERLAP_PULLBACK_V1 } from "./evaluate-eurusd-overlap-pullback.js";

const PULLBACK_GATES = [
  "DATA_READY",
  "SESSION_ELIGIBLE",
  "HIGHER_TIMEFRAME_ALIGNED",
  "PULLBACK_QUALIFIED",
  "LIQUIDITY_EVENT_QUALIFIED",
  "TRIGGER_CONFIRMED",
  "EVENT_RISK_CLEAR",
  "INVALIDATION_DEFINED",
  "NOT_EXPIRED"
] as const;

const RANGE_BREAKOUT_GATES = [
  "DATA_READY",
  "SESSION_ELIGIBLE",
  "RANGE_ESTABLISHED",
  "BREAKOUT_CONFIRMED",
  "EVENT_RISK_CLEAR",
  "INVALIDATION_DEFINED",
  "NOT_EXPIRED"
] as const;

type StrategyDefinition = EurUsdOverlapPullbackStrategy | EurUsdLondonRangeBreakoutStrategy;

export type StrategyObservationInput =
  | {
      readonly strategyId: "EURUSD_LN_NY_PULLBACK";
      readonly observation: EurUsdOverlapPullbackObservation;
    }
  | {
      readonly strategyId: "EURUSD_LONDON_RANGE_BREAKOUT";
      readonly observation: EurUsdLondonRangeBreakoutObservation;
    };

export type RegisteredStrategyDefinition = {
  readonly definition: StrategyDefinition;
  readonly registration: StrategyRegistration;
};

export type StrategyRegistry = {
  readonly definitions: readonly RegisteredStrategyDefinition[];
  readonly registryHash: string;
};

export const EPOCH5_STRATEGY_DEFINITIONS: readonly StrategyDefinition[] = [
  EURUSD_OVERLAP_PULLBACK_V1,
  EURUSD_LONDON_RANGE_BREAKOUT_V1
];

export function createStrategyRegistry(
  definitions: readonly StrategyDefinition[] = EPOCH5_STRATEGY_DEFINITIONS
): StrategyRegistry {
  if (definitions.length < 2) {
    throw new Error("Epoch 5 strategy registry requires at least two definitions");
  }

  const parsed = definitions.map(parseDefinition);
  const identities = parsed.map(strategyIdentity);
  if (new Set(identities).size !== identities.length) {
    throw new Error("strategy registry contains duplicate strategy identities");
  }

  const registered = parsed
    .map((definition) => ({
      definition,
      registration: createRegistration(definition)
    }))
    .sort((left, right) =>
      strategyIdentity(left.definition).localeCompare(strategyIdentity(right.definition))
    );

  return deepFreeze({
    definitions: registered,
    registryHash: hashCanonicalValue(registered.map(({ registration }) => registration))
  });
}

export function evaluateStrategyRegistry(
  registry: StrategyRegistry,
  observations: readonly StrategyObservationInput[]
): RegisteredStrategyAssessment[] {
  assertRegistryIntegrity(registry);
  const observationIds = observations.map(({ strategyId }) => strategyId);
  if (
    observationIds.length !== registry.definitions.length ||
    new Set(observationIds).size !== observationIds.length
  ) {
    throw new Error("strategy evaluation requires one observation per registered strategy");
  }

  return registry.definitions.map(({ definition, registration }) => {
    const input = observations.find(({ strategyId }) => strategyId === definition.strategyId);
    if (!input) throw new Error(`missing observation for ${definition.strategyId}`);
    const assessment = evaluateRegisteredDefinition(definition, input);
    return RegisteredStrategyAssessmentSchema.parse({
      registration,
      assessment,
      assessmentHash: hashCanonicalValue(assessment)
    });
  });
}

export function createMultiStrategyLifecycle(input: {
  readonly registration: StrategyRegistration;
  readonly assessment: CanonicalDecisionAssessment;
  readonly trace: MultiStrategyLifecycle["trace"];
}): MultiStrategyLifecycle {
  const registration = StrategyRegistrationSchema.parse(input.registration);
  const assessment = RegisteredStrategyAssessmentSchema.shape.assessment.parse(input.assessment);
  const trace = MultiStrategyLifecycleSchema.shape.trace.parse(input.trace);

  if (
    assessment.strategyId !== registration.strategyId ||
    assessment.strategyVersion !== registration.strategyVersion ||
    trace.frozenDecisionBundle.strategyId !== registration.strategyId ||
    trace.frozenDecisionBundle.strategyVersion !== registration.strategyVersion ||
    trace.frozenDecisionBundle.canonicalAssessmentHash !== hashCanonicalValue(assessment)
  ) {
    throw new Error("multi-strategy lifecycle identity or assessment chain mismatch");
  }

  return MultiStrategyLifecycleSchema.parse({
    strategyId: registration.strategyId,
    strategyVersion: registration.strategyVersion,
    registrationHash: hashCanonicalValue(registration),
    trace,
    traceHash: hashCanonicalValue(trace)
  });
}

export function createMultiStrategyCheckpoint(input: {
  readonly checkpointId: string;
  readonly registry: StrategyRegistry;
  readonly firstAssessments: readonly RegisteredStrategyAssessment[];
  readonly secondAssessments: readonly RegisteredStrategyAssessment[];
  readonly lifecycles: readonly MultiStrategyLifecycle[];
  readonly checkedAt: string;
}): MultiStrategyCheckpoint {
  const reasons: string[] = [];
  let registrations: StrategyRegistration[] = [];
  let first: RegisteredStrategyAssessment[] = [];
  let second: RegisteredStrategyAssessment[] = [];
  let lifecycles: MultiStrategyLifecycle[] = [];

  try {
    assertRegistryIntegrity(input.registry);
    registrations = input.registry.definitions.map(({ registration }) =>
      StrategyRegistrationSchema.parse(registration)
    );
    first = input.firstAssessments.map((assessment) =>
      RegisteredStrategyAssessmentSchema.parse(assessment)
    );
    second = input.secondAssessments.map((assessment) =>
      RegisteredStrategyAssessmentSchema.parse(assessment)
    );
    lifecycles = input.lifecycles.map((lifecycle) => MultiStrategyLifecycleSchema.parse(lifecycle));
  } catch (error) {
    reasons.push(error instanceof Error ? error.message : "strategy platform input is invalid");
  }

  const expectedIds = registrations.map(({ strategyId }) => strategyId).sort();
  const firstIds = first.map(({ assessment }) => assessment.strategyId).sort();
  const secondIds = second.map(({ assessment }) => assessment.strategyId).sort();
  const lifecycleIds = lifecycles.map(({ strategyId }) => strategyId).sort();
  const deterministic =
    first.length >= 2 &&
    JSON.stringify(first) === JSON.stringify(second) &&
    first.every(
      ({ assessment, assessmentHash }) => assessmentHash === hashCanonicalValue(assessment)
    );
  if (!deterministic) {
    reasons.push("repeated multi-strategy assessments differ or have invalid hashes");
  }

  const identityIsolated =
    expectedIds.length >= 2 &&
    new Set(expectedIds).size === expectedIds.length &&
    new Set(first.map(({ assessment }) => assessment.candidateId)).size === first.length &&
    sameStrings(expectedIds, firstIds) &&
    sameStrings(expectedIds, secondIds) &&
    sameStrings(expectedIds, lifecycleIds) &&
    first.every(({ registration, assessment }) => {
      return (
        registration.strategyId === assessment.strategyId &&
        registration.strategyVersion === assessment.strategyVersion &&
        registration.definitionHash === definitionHashFor(input.registry, registration.strategyId)
      );
    });
  if (!identityIsolated) {
    reasons.push("strategy identity, candidate scope, or definition links leaked");
  }

  const protectedLoopShared =
    lifecycles.length === registrations.length &&
    lifecycles.every((lifecycle) => {
      const assessment = first.find(
        ({ assessment: candidate }) => candidate.strategyId === lifecycle.strategyId
      );
      const registration = registrations.find(
        (candidate) => candidate.strategyId === lifecycle.strategyId
      );
      return (
        lifecycle.trace.lifecycleStatus === "COMPLETE" &&
        lifecycle.trace.gates.every((gate) => gate.status === "PASS") &&
        lifecycle.traceHash === hashCanonicalValue(lifecycle.trace) &&
        lifecycle.registrationHash === hashCanonicalValue(registration) &&
        lifecycle.trace.frozenDecisionBundle.canonicalAssessmentHash === assessment?.assessmentHash
      );
    });
  if (!protectedLoopShared) {
    reasons.push("one or more strategies bypassed the complete protected loop");
  }

  const expectedRegistryHash = hashCanonicalValue(registrations);
  if (expectedRegistryHash !== input.registry.registryHash) {
    reasons.push("strategy registry hash mismatch");
  }

  const status = reasons.length === 0 ? ("PASS" as const) : ("FAIL" as const);
  const payload = {
    schemaVersion: 1 as const,
    checkpointId: input.checkpointId,
    registryHash: input.registry.registryHash,
    registrationHashes: registrations.map(hashCanonicalValue).sort(),
    assessmentHashes: first.map(({ assessmentHash }) => assessmentHash).sort(),
    lifecycleHashes: lifecycles.map(({ traceHash }) => traceHash).sort(),
    strategyIds: expectedIds,
    status,
    deterministic,
    identityIsolated,
    protectedLoopShared,
    completeLifecycleCount: lifecycles.filter(({ trace }) => trace.lifecycleStatus === "COMPLETE")
      .length,
    reasons:
      status === "PASS"
        ? [
            "Two distinct strategy identities reproduce independently through the same evidence, risk, simulation, outcome, and learning controls."
          ]
        : reasons,
    checkedAt: input.checkedAt,
    localResearchOnly: true as const,
    optimizationAuthority: false as const,
    recommendationFinal: false as const,
    executionPath: false as const,
    automatedAction: false as const
  };

  return MultiStrategyCheckpointSchema.parse({
    ...payload,
    checkpointHash: hashCanonicalValue(payload)
  });
}

function evaluateRegisteredDefinition(
  definition: StrategyDefinition,
  input: StrategyObservationInput
): CanonicalDecisionAssessment {
  if (
    definition.strategyId === "EURUSD_LN_NY_PULLBACK" &&
    input.strategyId === "EURUSD_LN_NY_PULLBACK"
  ) {
    const observation = EurUsdOverlapPullbackObservationSchema.parse(input.observation);
    return buildCanonicalDecisionAssessment(
      { ...observation, candidateId: scopedCandidateId(observation.candidateId, definition) },
      definition
    );
  }
  if (
    definition.strategyId === "EURUSD_LONDON_RANGE_BREAKOUT" &&
    input.strategyId === "EURUSD_LONDON_RANGE_BREAKOUT"
  ) {
    const observation = EurUsdLondonRangeBreakoutObservationSchema.parse(input.observation);
    return buildCanonicalRangeBreakoutAssessment(
      { ...observation, candidateId: scopedCandidateId(observation.candidateId, definition) },
      definition
    );
  }
  throw new Error(`observation does not match registered strategy ${definition.strategyId}`);
}

function createRegistration(definition: StrategyDefinition): StrategyRegistration {
  const pullback = definition.strategyId === "EURUSD_LN_NY_PULLBACK";
  return StrategyRegistrationSchema.parse({
    schemaVersion: 1,
    strategyId: definition.strategyId,
    strategyVersion: definition.version,
    strategyFamily: pullback ? "EURUSD_OVERLAP_PULLBACK" : "EURUSD_LONDON_RANGE_BREAKOUT",
    instrument: definition.instrument,
    sourceTimeframe: definition.sourceTimeframe,
    contextTimeframes: pullback ? ["1H", "4H"] : [],
    observationEngineVersion: definition.observationEngineVersion,
    definitionHash: hashCanonicalValue(definition),
    requiredGates: pullback ? PULLBACK_GATES : RANGE_BREAKOUT_GATES,
    riskReviewRequired: true,
    deterministicSimulationRequired: true,
    outcomeRequired: true,
    learningRequired: true,
    localResearchOnly: true,
    optimizationAuthority: false,
    recommendationFinal: false,
    executionPath: false,
    automatedAction: false
  });
}

function parseDefinition(definition: StrategyDefinition): StrategyDefinition {
  return definition.strategyId === "EURUSD_LN_NY_PULLBACK"
    ? EurUsdOverlapPullbackStrategySchema.parse(definition)
    : EurUsdLondonRangeBreakoutStrategySchema.parse(definition);
}

function assertRegistryIntegrity(registry: StrategyRegistry): void {
  const definitions = registry.definitions.map(({ definition, registration }) => ({
    definition: parseDefinition(definition),
    registration: StrategyRegistrationSchema.parse(registration)
  }));
  const identities = definitions.map(({ definition }) => strategyIdentity(definition));
  if (definitions.length < 2 || new Set(identities).size !== identities.length) {
    throw new Error("strategy registry requires at least two unique strategy identities");
  }
  for (const { definition, registration } of definitions) {
    if (
      registration.strategyId !== definition.strategyId ||
      registration.strategyVersion !== definition.version ||
      registration.definitionHash !== hashCanonicalValue(definition)
    ) {
      throw new Error(`strategy registration mismatch: ${registration.strategyId}`);
    }
  }
  const expectedHash = hashCanonicalValue(definitions.map(({ registration }) => registration));
  if (registry.registryHash !== expectedHash) {
    throw new Error("strategy registry hash mismatch");
  }
}

function definitionHashFor(
  registry: StrategyRegistry,
  strategyId: SupportedStrategyId
): string | undefined {
  return registry.definitions.find(({ definition }) => definition.strategyId === strategyId)
    ?.registration.definitionHash;
}

function strategyIdentity(definition: StrategyDefinition): string {
  return `${definition.strategyId}@${definition.version}`;
}

function scopedCandidateId(sourceCandidateId: string, definition: StrategyDefinition): string {
  return `${sourceCandidateId}:${definition.strategyId.toLowerCase()}:${hashCanonicalValue({
    sourceCandidateId,
    strategyId: definition.strategyId,
    strategyVersion: definition.version,
    definitionHash: hashCanonicalValue(definition)
  }).slice("sha256:".length, 18)}`;
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());
}

function deepFreeze<T>(value: T): Readonly<T> {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    Object.values(value).forEach(deepFreeze);
  }
  return value;
}
