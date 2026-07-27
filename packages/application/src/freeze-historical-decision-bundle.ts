import {
  CanonicalRiskReviewSchema,
  ContractValidationError,
  EurUsdRiskCalculationSchema,
  FrozenHistoricalDecisionBundleSchema,
  HistoricalDecisionFreezeConfigurationSchema,
  HistoricalIngestionRunSchema,
  type FrozenHistoricalDecisionBundle,
  type HistoricalDecisionFreezeConfiguration,
  type HistoricalIngestionRun,
  type NormalizedMarketCandle,
  type TemporalEvidenceReference,
  type TimeBoundMarketCandle
} from "@traderframe/contracts";
import {
  assertLocalSimulationRiskEligibility,
  hashCanonicalValue
} from "./canonical-risk-review.js";
import { EURUSD_OVERLAP_PULLBACK_V1 } from "./evaluate-eurusd-overlap-pullback.js";
import { freezeDecisionBundle } from "./freeze-decision-bundle.js";

export type FreezeHistoricalDecisionBundleInput = {
  run: HistoricalIngestionRun;
  riskCalculation: unknown;
  riskReview: unknown;
  configuration: HistoricalDecisionFreezeConfiguration;
};

type EvidenceCandle = NormalizedMarketCandle | TimeBoundMarketCandle;

export function freezeHistoricalDecisionBundle(
  input: FreezeHistoricalDecisionBundleInput
): Readonly<FrozenHistoricalDecisionBundle> {
  const run = HistoricalIngestionRunSchema.parse(input.run);
  const calculation = EurUsdRiskCalculationSchema.parse(input.riskCalculation);
  const review = CanonicalRiskReviewSchema.parse(input.riskReview);
  const configuration = HistoricalDecisionFreezeConfigurationSchema.parse(input.configuration);

  if (run.status !== "COMPLETED") {
    throw new ContractValidationError(
      "historical decision freezing requires a completed ingestion run"
    );
  }
  if (
    run.hashes.normalized15mHash === null ||
    run.hashes.aggregated1HHash === null ||
    run.hashes.aggregated4HHash === null
  ) {
    throw new ContractValidationError(
      "historical decision freezing requires complete source hashes"
    );
  }

  const evaluation = run.candidateEvaluations.find(
    (candidate) => candidate.detection.candidateId === calculation.candidateId
  );
  if (!evaluation) {
    throw new ContractValidationError(
      `risk candidate ${calculation.candidateId} is not part of historical run ${run.runId}`
    );
  }

  assertRiskCalculationIntegrity(calculation);
  assertRiskLineage(run, calculation);

  const canonicalAssessmentHash = hashCanonicalValue(evaluation.assessment);
  if (
    calculation.assessmentId !== evaluation.assessment.assessmentId ||
    calculation.canonicalAssessmentHash !== canonicalAssessmentHash
  ) {
    throw new ContractValidationError(
      "calculated risk does not match the canonical assessment selected for freezing"
    );
  }
  if (Date.parse(calculation.decisionTimestamp) < Date.parse(evaluation.assessment.availableAt)) {
    throw new ContractValidationError(
      "calculated risk predates the canonical assessment availability boundary"
    );
  }
  if (calculation.riskGate !== "WITHIN_LIMIT" || calculation.positionSizeUnits <= 0) {
    throw new ContractValidationError("only a within-limit calculated risk plan can be frozen");
  }
  if (
    review.riskCalculationId !== calculation.riskCalculationId ||
    review.riskCalculationHash !== calculation.calculationHash
  ) {
    throw new ContractValidationError(
      "operator risk review is not linked to the calculated risk plan"
    );
  }
  if (
    review.riskEngineVersion !== calculation.riskEngineVersion ||
    review.maximumRiskPct !== calculation.maximumRiskPct ||
    review.maximumRiskAmount !== calculation.riskBudgetAmount ||
    review.positionSizeUnits !== calculation.positionSizeUnits ||
    review.spreadPips !== calculation.spreadPips ||
    review.commissionAmount !== calculation.estimatedCommissionCost ||
    review.slippagePips !== calculation.entrySlippagePips + calculation.stopSlippagePips
  ) {
    throw new ContractValidationError(
      "operator risk review does not preserve the complete calculated risk values"
    );
  }
  if (Date.parse(review.reviewedAt) < Date.parse(evaluation.assessment.availableAt)) {
    throw new ContractValidationError(
      "operator risk review predates the canonical assessment availability boundary"
    );
  }

  assertLocalSimulationRiskEligibility({
    assessment: evaluation.assessment,
    riskReview: review,
    simulationTimestamp: configuration.frozenAt
  });

  const temporalEvidence = resolveTemporalEvidence(run, evaluation.observation.evidenceIds);
  const evidenceBundleHash = hashCanonicalValue(temporalEvidence);
  const decisionConfigurationHash = hashCanonicalValue({
    ingestionConfigurationHash: run.configurationHash,
    riskPolicyHash: calculation.policyHash,
    riskCalculationHash: calculation.calculationHash,
    riskReviewHash: review.reviewHash,
    simulationPolicyVersion: configuration.simulationPolicyVersion,
    targetRewardRiskMultiple: configuration.targetRewardRiskMultiple,
    applicationCommit: configuration.applicationCommit,
    operatorId: configuration.operatorId
  });
  const identityHash = hashCanonicalValue({
    historicalRunId: run.runId,
    candidateId: evaluation.detection.candidateId,
    canonicalAssessmentHash,
    riskCalculationHash: calculation.calculationHash,
    riskReviewHash: review.reviewHash,
    decisionConfigurationHash
  });
  const identity = identityHash.slice("sha256:".length, "sha256:".length + 24);
  const traceId = `trace-${identity}`;
  const targetPrice = deriveTargetPrice(
    calculation.entryPrice,
    calculation.invalidationPrice,
    calculation.direction,
    configuration.targetRewardRiskMultiple
  );

  const decisionRecord = freezeDecisionBundle({
    assessment: evaluation.assessment,
    riskReview: review,
    frozenAt: configuration.frozenAt,
    bundle: {
      schemaVersion: 1,
      traceId,
      setupReviewId: `historical-setup-${identity}`,
      instrument: "EURUSD",
      decisionTimestamp: evaluation.assessment.decisionTimestamp,
      operatorId: configuration.operatorId,
      sourceId: run.manifest.datasetId,
      rawDataHash: run.hashes.rawDataHash,
      normalizedDataHash: run.hashes.normalized15mHash,
      strategyVersion: evaluation.assessment.strategyVersion,
      strategyParametersHash: hashCanonicalValue(EURUSD_OVERLAP_PULLBACK_V1),
      featureEngineVersion: evaluation.assessment.observationEngineVersion,
      riskEngineVersion: calculation.riskEngineVersion,
      simulationPolicyVersion: configuration.simulationPolicyVersion,
      applicationCommit: configuration.applicationCommit,
      configurationHash: decisionConfigurationHash,
      evidenceBundleHash,
      simulationPlan: {
        direction: calculation.direction,
        entryPrice: calculation.entryPrice,
        stopPrice: calculation.invalidationPrice,
        targetPrice,
        positionSizeUnits: calculation.positionSizeUnits,
        plannedRiskAmount: calculation.totalWorstCasePlannedLoss
      },
      recommendation: evaluation.assessment.recommendation,
      blockers: evaluation.assessment.blockers.map((blocker) => blocker.reason),
      temporalEvidence,
      createdAt: configuration.frozenAt
    }
  });

  const payload = {
    schemaVersion: 1 as const,
    artifactId: `frozen-historical-decision-${identity}`,
    traceId,
    historicalRunId: run.runId,
    sourceManifest: run.manifest,
    sourceSnapshot: run.sourceSnapshot,
    sourceHashes: {
      rawDataHash: run.hashes.rawDataHash,
      normalized15mHash: run.hashes.normalized15mHash,
      aggregated1HHash: run.hashes.aggregated1HHash,
      aggregated4HHash: run.hashes.aggregated4HHash,
      ingestionConfigurationHash: run.configurationHash,
      decisionConfigurationHash
    },
    candidateEvaluation: evaluation,
    riskCalculation: calculation,
    riskReview: review,
    decisionRecord,
    targetRewardRiskMultiple: configuration.targetRewardRiskMultiple,
    frozenAt: configuration.frozenAt,
    localSimulationOnly: true as const,
    executionPath: false as const,
    automatedAction: false as const
  };
  const artifact = FrozenHistoricalDecisionBundleSchema.parse({
    ...payload,
    artifactHash: hashCanonicalValue(payload)
  });

  return deepFreeze(artifact);
}

export function assertFrozenHistoricalDecisionBundleIntegrity(
  value: FrozenHistoricalDecisionBundle
): void {
  const artifact = FrozenHistoricalDecisionBundleSchema.parse(value);
  const { artifactHash, ...payload } = artifact;

  if (artifactHash !== hashCanonicalValue(payload)) {
    throw new ContractValidationError("frozen historical decision artifact hash mismatch");
  }
  if (artifact.decisionRecord.bundleHash !== hashCanonicalValue(artifact.decisionRecord.bundle)) {
    throw new ContractValidationError("nested frozen decision bundle hash mismatch");
  }
  assertRiskCalculationIntegrity(artifact.riskCalculation);
  assertLocalSimulationRiskEligibility({
    assessment: artifact.candidateEvaluation.assessment,
    riskReview: artifact.riskReview,
    simulationTimestamp: artifact.frozenAt
  });
}

function assertRiskCalculationIntegrity(
  calculation: ReturnType<typeof EurUsdRiskCalculationSchema.parse>
): void {
  const { calculationHash, ...payload } = calculation;
  if (calculationHash !== hashCanonicalValue(payload)) {
    throw new ContractValidationError("calculated risk content hash mismatch");
  }
}

function assertRiskLineage(
  run: HistoricalIngestionRun,
  calculation: ReturnType<typeof EurUsdRiskCalculationSchema.parse>
): void {
  const expected = {
    historicalRunId: run.runId,
    datasetId: run.manifest.datasetId,
    rawDataHash: run.hashes.rawDataHash,
    normalized15mHash: run.hashes.normalized15mHash,
    aggregated1HHash: run.hashes.aggregated1HHash,
    aggregated4HHash: run.hashes.aggregated4HHash,
    ingestionConfigurationHash: run.configurationHash
  };

  if (hashCanonicalValue(calculation.sourceLineage) !== hashCanonicalValue(expected)) {
    throw new ContractValidationError(
      "calculated risk does not match the historical source lineage"
    );
  }
}

function resolveTemporalEvidence(
  run: HistoricalIngestionRun,
  evidenceIds: string[]
): TemporalEvidenceReference[] {
  const candles: EvidenceCandle[] = [
    ...run.series.normalized15m,
    ...run.series.aggregated1H,
    ...run.series.aggregated4H
  ];
  const byId = new Map(candles.map((candle) => [candle.candleId, candle]));
  const byHash = new Map(candles.map((candle) => [candle.sourceHash, candle]));

  return [...new Set(evidenceIds)]
    .sort()
    .map((evidenceId) => {
      const candle = byId.get(evidenceId) ?? byHash.get(evidenceId);
      if (!candle) {
        throw new ContractValidationError(
          `evidence ${evidenceId} is absent from the historical run`
        );
      }
      const availableAt = "availableAt" in candle ? candle.availableAt : candle.closedAt;
      const transformationVersion =
        candle.timeframe === "15m" ? candle.normalizationVersion : candle.aggregationVersion;

      return {
        evidenceId,
        sourceId: candle.sourceId,
        observedAt: candle.openedAt,
        availableAt,
        transformationVersion,
        contentHash: candle.sourceHash
      };
    });
}

function deriveTargetPrice(
  entryPrice: number,
  stopPrice: number,
  direction: "LONG" | "SHORT",
  rewardRiskMultiple: number
): number {
  const distance = Math.abs(entryPrice - stopPrice);
  const target =
    direction === "LONG"
      ? entryPrice + distance * rewardRiskMultiple
      : entryPrice - distance * rewardRiskMultiple;
  const rounded = Number(target.toFixed(5));

  if (!Number.isFinite(rounded) || rounded <= 0) {
    throw new ContractValidationError("target policy produced an invalid positive price");
  }
  return rounded;
}

function deepFreeze<T>(value: T): Readonly<T> {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}
