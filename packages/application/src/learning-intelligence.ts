import {
  DeterministicLearningEventSchema,
  FrozenDecisionRecordSchema,
  LearningIntelligenceCaseSchema,
  LearningIntelligenceCheckpointSchema,
  LearningIntelligenceReportSchema,
  ValidatedSimulationOutcomeSchema,
  type DeterministicLearningEvent,
  type FrozenDecisionRecord,
  type LearningFailureMode,
  type LearningIntelligenceCase,
  type LearningIntelligenceCheckpoint,
  type LearningIntelligenceReport,
  type LearningInvalidationCode,
  type LearningRegime,
  type OperatorProcessError,
  type ValidatedSimulationOutcome
} from "@traderframe/contracts";
import { hashCanonicalValue } from "./canonical-risk-review.js";

export function createLearningIntelligenceCase(input: {
  readonly caseRecordId: string;
  readonly frozenRecord: FrozenDecisionRecord;
  readonly outcome: ValidatedSimulationOutcome;
  readonly learningEvent: DeterministicLearningEvent;
  readonly regime: LearningRegime;
  readonly invalidationCode: LearningInvalidationCode;
  readonly evidenceCombination: readonly string[];
  readonly failureModes: readonly LearningFailureMode[];
  readonly operatorProcessErrors: readonly OperatorProcessError[];
  readonly observedAt: string;
  readonly limitations: readonly string[];
}): LearningIntelligenceCase {
  const record = FrozenDecisionRecordSchema.parse(input.frozenRecord);
  const outcome = ValidatedSimulationOutcomeSchema.parse(input.outcome);
  const learning = DeterministicLearningEventSchema.parse(input.learningEvent);
  assertSourceChain(record, outcome, learning);

  const payload = {
    schemaVersion: 1 as const,
    caseRecordId: input.caseRecordId,
    frozenBundleHash: record.bundleHash,
    outcomeId: outcome.outcomeId,
    outcomeHash: outcome.outcomeHash,
    disposition: outcome.disposition,
    learningEventId: learning.learningEventId,
    learningHash: learning.learningHash,
    learningCategory: learning.category,
    strategyVersion: record.bundle.strategyVersion,
    regime: input.regime,
    invalidationCode: input.invalidationCode,
    evidenceCombination: sortedUnique(input.evidenceCombination),
    failureModes: sortedUnique(input.failureModes),
    operatorProcessErrors: sortedUnique(input.operatorProcessErrors),
    attributionMode: "MANUAL_LOCAL" as const,
    operatorConfirmed: true as const,
    observedAt: input.observedAt,
    limitations: sortedUnique(input.limitations),
    predictiveClaim: false as const,
    performanceClaim: false as const,
    executionPath: false as const,
    automatedAction: false as const
  };
  return LearningIntelligenceCaseSchema.parse({
    ...payload,
    caseHash: hashCanonicalValue(payload)
  });
}

export function buildLearningIntelligenceReport(input: {
  readonly reportId: string;
  readonly cases: readonly LearningIntelligenceCase[];
  readonly generatedAt: string;
  readonly limitations: readonly string[];
}): LearningIntelligenceReport {
  const cases = input.cases
    .map((record) => LearningIntelligenceCaseSchema.parse(record))
    .sort(
      (left, right) =>
        left.observedAt.localeCompare(right.observedAt) ||
        left.caseRecordId.localeCompare(right.caseRecordId)
    );
  if (cases.length < 3) throw new Error("learning intelligence requires at least three cases");
  if (new Set(cases.map((record) => record.caseRecordId)).size !== cases.length) {
    throw new Error("learning intelligence contains duplicate case record IDs");
  }
  cases.forEach(assertLearningCaseHash);

  const recurringInvalidations = recurringGroups(
    cases.filter((record) => record.invalidationCode !== "NONE"),
    (record) => record.invalidationCode
  ).map(([invalidationCode, group]) => ({
    invalidationCode: invalidationCode as Exclude<LearningInvalidationCode, "NONE">,
    caseRecordIds: caseIds(group),
    occurrenceCount: group.length
  }));

  const evidenceFailurePatterns = recurringGroups(
    cases.flatMap((record) =>
      record.failureModes.map((failureMode) => ({
        record,
        key: `${record.evidenceCombination.join("|")}::${failureMode}`,
        failureMode
      }))
    ),
    (entry) => entry.key
  ).map(([, group]) => ({
    evidenceCombination: [...group[0]!.record.evidenceCombination],
    failureMode: group[0]!.failureMode,
    caseRecordIds: caseIds(group.map((entry) => entry.record)),
    occurrenceCount: group.length
  }));

  const operatorProcessPatterns = recurringGroups(
    cases.flatMap((record) =>
      record.operatorProcessErrors.map((processError) => ({
        record,
        processError
      }))
    ),
    (entry) => entry.processError
  ).map(([processError, group]) => ({
    processError: processError as OperatorProcessError,
    caseRecordIds: caseIds(group.map((entry) => entry.record)),
    occurrenceCount: group.length,
    attributionMode: "MANUAL_LOCAL" as const
  }));

  const comparableCaseClusters = recurringGroups(
    cases,
    (record) =>
      `${record.strategyVersion}::${record.regime}::${record.evidenceCombination.join("|")}`
  ).map(([clusterKey, group]) => ({
    clusterId: `cluster:${hashCanonicalValue(clusterKey).slice("sha256:".length, 21)}`,
    clusterKey,
    strategyVersion: group[0]!.strategyVersion,
    regime: group[0]!.regime,
    evidenceCombination: [...group[0]!.evidenceCombination],
    caseRecordIds: caseIds(group),
    dispositions: sortedUnique(group.map((record) => record.disposition)),
    invalidationCodes: sortedUnique(group.map((record) => record.invalidationCode)),
    limitations: [
      "Exact shared attributes establish comparability; they do not predict a future outcome."
    ]
  }));

  const strategyVersions = sortedUnique(cases.map((record) => record.strategyVersion));
  const regimeSequence = cases.map((record) => record.regime);
  const regimeChangeCount = regimeSequence.reduce(
    (count, regime, index) => count + (index > 0 && regime !== regimeSequence[index - 1] ? 1 : 0),
    0
  );
  const strategyVersionChanged = strategyVersions.length > 1;
  const driftReasons: string[] = [];
  if (strategyVersionChanged) {
    driftReasons.push("Multiple strategy versions are present and require version-aware review.");
  }
  if (regimeChangeCount > 1) {
    driftReasons.push("The chronological fixture crosses multiple declared market regimes.");
  }
  const driftInspection = {
    strategyVersions,
    strategyVersionChanged,
    regimeSequence,
    regimeChangeCount,
    status: driftReasons.length > 0 ? ("REVIEW_REQUIRED" as const) : ("STABLE" as const),
    reasons:
      driftReasons.length > 0
        ? driftReasons
        : ["No strategy-version change or repeated regime transition was observed."]
  };

  const reasons = [
    ...(recurringInvalidations.length > 0
      ? ["Recurring invalidations require operator review."]
      : []),
    ...(evidenceFailurePatterns.length > 0
      ? ["Repeated evidence and failure-mode combinations require operator review."]
      : []),
    ...(operatorProcessPatterns.length > 0
      ? ["Repeated manually attributed process errors require operator review."]
      : []),
    ...(driftInspection.status === "REVIEW_REQUIRED"
      ? ["Declared strategy or regime drift requires operator review."]
      : [])
  ];
  const status = reasons.length > 0 ? ("REVIEW_REQUIRED" as const) : ("CLEAR" as const);
  const payload = {
    schemaVersion: 1 as const,
    reportId: input.reportId,
    sourceCaseHashes: cases.map((record) => record.caseHash).sort(),
    recurringInvalidations,
    evidenceFailurePatterns,
    operatorProcessPatterns,
    comparableCaseClusters,
    driftInspection,
    status,
    reasons:
      reasons.length > 0
        ? reasons
        : ["No recurring pattern or declared drift concern was found in this bounded fixture."],
    limitations: sortedUnique(input.limitations),
    generatedAt: input.generatedAt,
    operatorReviewRequired: true as const,
    recommendationFinal: false as const,
    updatesRules: false as const,
    updatesRiskLimits: false as const,
    predictiveClaim: false as const,
    performanceClaim: false as const,
    executionPath: false as const,
    automatedAction: false as const
  };
  return LearningIntelligenceReportSchema.parse({
    ...payload,
    reportHash: hashCanonicalValue(payload)
  });
}

export function createLearningIntelligenceCheckpoint(input: {
  readonly checkpointId: string;
  readonly cases: readonly LearningIntelligenceCase[];
  readonly firstReport: LearningIntelligenceReport;
  readonly secondReport: LearningIntelligenceReport;
  readonly checkedAt: string;
}): LearningIntelligenceCheckpoint {
  const cases = input.cases.map((record) => LearningIntelligenceCaseSchema.parse(record));
  const first = LearningIntelligenceReportSchema.parse(input.firstReport);
  const second = LearningIntelligenceReportSchema.parse(input.secondReport);
  let sourceChainsValid = true;
  try {
    cases.forEach(assertLearningCaseHash);
    assertLearningReportHash(first);
    assertLearningReportHash(second);
    const expectedSourceHashes = cases.map((record) => record.caseHash).sort();
    if (
      JSON.stringify(first.sourceCaseHashes) !== JSON.stringify(expectedSourceHashes) ||
      JSON.stringify(second.sourceCaseHashes) !== JSON.stringify(expectedSourceHashes)
    ) {
      throw new Error("learning report source cases do not match checkpoint cases");
    }
  } catch {
    sourceChainsValid = false;
  }
  const deterministic =
    sourceChainsValid &&
    first.reportHash === second.reportHash &&
    JSON.stringify(first) === JSON.stringify(second);
  const requiredPatternsExercised =
    first.recurringInvalidations.length > 0 &&
    first.evidenceFailurePatterns.length > 0 &&
    first.operatorProcessPatterns.length > 0 &&
    first.comparableCaseClusters.length > 0 &&
    first.driftInspection.status === "REVIEW_REQUIRED";
  const reasons: string[] = [];
  if (!sourceChainsValid) reasons.push("One or more learning source or report hashes are invalid.");
  if (!deterministic) reasons.push("Repeated learning intelligence reports differ.");
  if (!requiredPatternsExercised) {
    reasons.push("The fixture does not exercise every required Epoch 4 pattern family.");
  }
  const status = reasons.length === 0 ? ("PASS" as const) : ("FAIL" as const);
  const payload = {
    schemaVersion: 1 as const,
    checkpointId: input.checkpointId,
    firstReportHash: first.reportHash,
    secondReportHash: second.reportHash,
    status,
    deterministic,
    sourceChainsValid,
    requiredPatternsExercised,
    reasons:
      status === "PASS"
        ? [
            "Learning intelligence is deterministic, source-linked, and exercises every required pattern family."
          ]
        : reasons,
    checkedAt: input.checkedAt,
    recommendationFinal: false as const,
    predictiveClaim: false as const,
    performanceClaim: false as const,
    executionPath: false as const,
    automatedAction: false as const
  };
  return LearningIntelligenceCheckpointSchema.parse({
    ...payload,
    checkpointHash: hashCanonicalValue(payload)
  });
}

function assertSourceChain(
  record: FrozenDecisionRecord,
  outcome: ValidatedSimulationOutcome,
  learning: DeterministicLearningEvent
): void {
  if (record.bundleHash !== hashCanonicalValue(record.bundle)) {
    throw new Error("learning case frozen bundle hash mismatch");
  }
  const { outcomeHash, ...outcomePayload } = outcome;
  if (
    outcomeHash !== hashCanonicalValue(outcomePayload) ||
    outcome.frozenBundleHash !== record.bundleHash
  ) {
    throw new Error("learning case outcome chain mismatch");
  }
  const { learningHash, ...learningPayload } = learning;
  if (
    learningHash !== hashCanonicalValue(learningPayload) ||
    learning.sourceOutcomeId !== outcome.outcomeId ||
    learning.sourceOutcomeHash !== outcome.outcomeHash
  ) {
    throw new Error("learning case learning-event chain mismatch");
  }
}

function assertLearningCaseHash(record: LearningIntelligenceCase): void {
  const { caseHash, ...payload } = record;
  if (caseHash !== hashCanonicalValue(payload)) {
    throw new Error(`learning case hash mismatch: ${record.caseRecordId}`);
  }
}

function assertLearningReportHash(report: LearningIntelligenceReport): void {
  const { reportHash, ...payload } = report;
  if (reportHash !== hashCanonicalValue(payload)) {
    throw new Error(`learning report hash mismatch: ${report.reportId}`);
  }
}

function recurringGroups<T>(values: readonly T[], key: (value: T) => string): Array<[string, T[]]> {
  const groups = new Map<string, T[]>();
  for (const value of values) {
    const groupKey = key(value);
    groups.set(groupKey, [...(groups.get(groupKey) ?? []), value]);
  }
  return [...groups.entries()]
    .filter(([, group]) => group.length >= 2)
    .sort(([left], [right]) => left.localeCompare(right));
}

function caseIds(cases: readonly LearningIntelligenceCase[]): string[] {
  return cases.map((record) => record.caseRecordId).sort();
}

function sortedUnique<T extends string>(values: readonly T[]): T[] {
  return [...new Set(values)].sort();
}
