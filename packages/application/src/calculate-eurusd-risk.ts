import {
  ContractValidationError,
  EurUsdRiskCalculationSchema,
  EurUsdRiskPolicySchema,
  HistoricalCandidateEvaluationSchema,
  HistoricalIngestionRunSchema,
  HistoricalRiskSourceLineageSchema,
  type EurUsdRiskCalculation,
  type EurUsdRiskPolicy,
  type HistoricalCandidateEvaluation,
  type HistoricalIngestionRun,
  type HistoricalRiskSourceLineage
} from "@traderframe/contracts";
import { hashCanonicalValue } from "./canonical-risk-review.js";

export const EURUSD_RISK_ENGINE_VERSION = "eurusd-risk-engine-1.0.0";

export type CalculateEurUsdRiskInput = {
  evaluation: HistoricalCandidateEvaluation;
  sourceLineage: HistoricalRiskSourceLineage;
  policy: EurUsdRiskPolicy;
};

export type CalculateEurUsdRiskFromHistoricalRunInput = {
  run: HistoricalIngestionRun;
  candidateId: string;
  policy: EurUsdRiskPolicy;
};

export function calculateEurUsdRisk(input: CalculateEurUsdRiskInput): EurUsdRiskCalculation {
  const evaluation = HistoricalCandidateEvaluationSchema.parse(input.evaluation);
  const sourceLineage = HistoricalRiskSourceLineageSchema.parse(input.sourceLineage);
  const policy = EurUsdRiskPolicySchema.parse(input.policy);
  const { assessment, observation } = evaluation;

  if (assessment.recommendation !== "PAPER_SIMULATE" || !assessment.eligible) {
    throw new ContractValidationError(
      "instrument-aware risk requires an eligible canonical PAPER_SIMULATE assessment"
    );
  }

  const entryPrice = observation.currentPrice;
  const invalidationPrice = observation.invalidationPrice;
  if (invalidationPrice === undefined || invalidationPrice === entryPrice) {
    throw new ContractValidationError(
      "instrument-aware risk requires a distinct deterministic invalidation price"
    );
  }

  const blockers: string[] = [];
  const directionIsValid =
    observation.direction === "LONG"
      ? invalidationPrice < entryPrice
      : invalidationPrice > entryPrice;
  if (!directionIsValid) {
    blockers.push("Invalidation price is on the wrong side of the entry for the candidate direction.");
  }

  const percentageRiskBudget = (policy.accountEquity * policy.maximumRiskPct) / 100;
  const riskBudgetAmount = roundMoney(
    Math.min(percentageRiskBudget, policy.maximumRiskAmount ?? percentageRiskBudget)
  );
  const quoteToAccountRate = resolveQuoteToAccountRate(policy, entryPrice);
  const pipValuePerUnit = roundMetric(policy.pipSize * quoteToAccountRate, 12);
  const stopDistancePips = roundMetric(
    Math.abs(entryPrice - invalidationPrice) / policy.pipSize,
    6
  );

  if (stopDistancePips <= 0 || !Number.isFinite(stopDistancePips)) {
    throw new ContractValidationError("stop distance must be a positive finite pip amount");
  }

  const entryCostPips = policy.spreadPips + policy.entrySlippagePips;
  const worstCaseExecutionPrice = roundPrice(
    observation.direction === "LONG"
      ? entryPrice + entryCostPips * policy.pipSize
      : entryPrice - entryCostPips * policy.pipSize
  );
  const worstCaseStopPrice = roundPrice(
    observation.direction === "LONG"
      ? invalidationPrice - policy.stopSlippagePips * policy.pipSize
      : invalidationPrice + policy.stopSlippagePips * policy.pipSize
  );

  const fixedCommission =
    policy.commissionModel.mode === "FIXED_ACCOUNT_CURRENCY"
      ? policy.commissionModel.amount
      : 0;
  const commissionPerUnit =
    policy.commissionModel.mode === "PER_MILLION_UNITS_ROUND_TURN"
      ? policy.commissionModel.amountPerMillion / 1_000_000
      : 0;
  const variableLossPerUnit =
    (stopDistancePips +
      policy.spreadPips +
      policy.entrySlippagePips +
      policy.stopSlippagePips) *
      pipValuePerUnit +
    commissionPerUnit;

  if (riskBudgetAmount <= fixedCommission) {
    blockers.push("The fixed commission consumes the complete risk budget.");
  }
  if (!Number.isFinite(variableLossPerUnit) || variableLossPerUnit <= 0) {
    blockers.push("Variable risk per unit could not be calculated as a positive finite amount.");
  }

  let positionSizeUnits = 0;
  if (blockers.length === 0) {
    const availableVariableBudget = riskBudgetAmount - fixedCommission;
    const unconstrainedUnits = Math.floor(availableVariableBudget / variableLossPerUnit);
    const cappedUnits = Math.min(unconstrainedUnits, policy.maximumPositionUnits);
    positionSizeUnits = roundDownToIncrement(cappedUnits, policy.unitIncrement);

    if (positionSizeUnits < policy.minimumPositionUnits) {
      blockers.push(
        `Calculated position ${positionSizeUnits} units is below the minimum ${policy.minimumPositionUnits} units.`
      );
      positionSizeUnits = 0;
    }
  }

  let amounts = calculateAmounts(positionSizeUnits, stopDistancePips, pipValuePerUnit, policy);
  while (
    positionSizeUnits >= policy.minimumPositionUnits + policy.unitIncrement &&
    amounts.totalWorstCasePlannedLoss > riskBudgetAmount + 0.000001
  ) {
    positionSizeUnits -= policy.unitIncrement;
    amounts = calculateAmounts(positionSizeUnits, stopDistancePips, pipValuePerUnit, policy);
  }

  if (
    positionSizeUnits > 0 &&
    amounts.totalWorstCasePlannedLoss > riskBudgetAmount + 0.000001
  ) {
    blockers.push("No position aligned to the configured unit increment fits inside the risk budget.");
    positionSizeUnits = 0;
    amounts = calculateAmounts(0, stopDistancePips, pipValuePerUnit, policy);
  }

  const riskGate = blockers.length === 0 && positionSizeUnits > 0 ? "WITHIN_LIMIT" : "BLOCKED";
  const policyHash = hashCanonicalValue(policy);
  const canonicalAssessmentHash = hashCanonicalValue(assessment);
  const riskUtilizationPct =
    riskBudgetAmount === 0
      ? 0
      : roundMetric((amounts.totalWorstCasePlannedLoss / riskBudgetAmount) * 100, 6);
  const canonicalPayload = {
    schemaVersion: 1 as const,
    riskEngineVersion: EURUSD_RISK_ENGINE_VERSION,
    policyId: policy.policyId,
    policyVersion: policy.policyVersion,
    policyHash,
    sourceLineage,
    candidateId: evaluation.detection.candidateId,
    assessmentId: assessment.assessmentId,
    canonicalAssessmentHash,
    decisionTimestamp: assessment.decisionTimestamp,
    direction: observation.direction,
    accountCurrency: policy.accountCurrency,
    accountEquity: policy.accountEquity,
    maximumRiskPct: policy.maximumRiskPct,
    riskBudgetAmount,
    entryPrice,
    invalidationPrice,
    pipSize: policy.pipSize,
    pipValuePerUnit,
    stopDistancePips,
    spreadPips: policy.spreadPips,
    entrySlippagePips: policy.entrySlippagePips,
    stopSlippagePips: policy.stopSlippagePips,
    worstCaseExecutionPrice,
    worstCaseStopPrice,
    positionSizeUnits,
    ...amounts,
    riskUtilizationPct,
    riskGate,
    blockers,
    assumptions: [
      ...policy.assumptions,
      "Position size is rounded down to the configured unit increment.",
      "Spread and entry slippage worsen entry; stop slippage worsens stop execution."
    ],
    localSimulationOnly: true as const,
    executionPath: false as const,
    automatedAction: false as const
  };
  const identityHash = hashCanonicalValue(canonicalPayload);
  const riskCalculationId = `eurusd-risk-${identityHash.slice("sha256:".length, "sha256:".length + 24)}`;
  const calculationPayload = { ...canonicalPayload, riskCalculationId };

  return EurUsdRiskCalculationSchema.parse({
    ...calculationPayload,
    calculationHash: hashCanonicalValue(calculationPayload)
  });
}

export function calculateEurUsdRiskFromHistoricalRun(
  input: CalculateEurUsdRiskFromHistoricalRunInput
): EurUsdRiskCalculation {
  const run = HistoricalIngestionRunSchema.parse(input.run);
  const policy = EurUsdRiskPolicySchema.parse(input.policy);

  if (run.status !== "COMPLETED") {
    throw new ContractValidationError("risk calculation requires a completed historical ingestion run");
  }
  if (
    run.hashes.normalized15mHash === null ||
    run.hashes.aggregated1HHash === null ||
    run.hashes.aggregated4HHash === null
  ) {
    throw new ContractValidationError("completed historical ingestion is missing canonical series hashes");
  }

  const evaluation = run.candidateEvaluations.find(
    (candidate) => candidate.detection.candidateId === input.candidateId
  );
  if (!evaluation) {
    throw new ContractValidationError(
      `candidate ${input.candidateId} is not part of historical run ${run.runId}`
    );
  }

  return calculateEurUsdRisk({
    evaluation,
    policy,
    sourceLineage: {
      historicalRunId: run.runId,
      datasetId: run.manifest.datasetId,
      rawDataHash: run.hashes.rawDataHash,
      normalized15mHash: run.hashes.normalized15mHash,
      aggregated1HHash: run.hashes.aggregated1HHash,
      aggregated4HHash: run.hashes.aggregated4HHash,
      ingestionConfigurationHash: run.configurationHash
    }
  });
}

function resolveQuoteToAccountRate(policy: EurUsdRiskPolicy, entryPrice: number): number {
  switch (policy.pipValuePolicy.mode) {
    case "QUOTE_CURRENCY":
      return 1;
    case "BASE_CURRENCY_AT_ENTRY":
      return 1 / entryPrice;
    case "EXPLICIT_QUOTE_TO_ACCOUNT_RATE":
      return policy.pipValuePolicy.quoteToAccountRate;
  }
}

function calculateAmounts(
  units: number,
  stopDistancePips: number,
  pipValuePerUnit: number,
  policy: EurUsdRiskPolicy
): Pick<
  EurUsdRiskCalculation,
  | "plannedGrossLoss"
  | "estimatedSpreadCost"
  | "estimatedSlippageCost"
  | "estimatedCommissionCost"
  | "estimatedCosts"
  | "totalWorstCasePlannedLoss"
> {
  const plannedGrossLoss = roundMoney(stopDistancePips * pipValuePerUnit * units);
  const estimatedSpreadCost = roundMoney(policy.spreadPips * pipValuePerUnit * units);
  const estimatedSlippageCost = roundMoney(
    (policy.entrySlippagePips + policy.stopSlippagePips) * pipValuePerUnit * units
  );
  const estimatedCommissionCost = roundMoney(
    policy.commissionModel.mode === "FIXED_ACCOUNT_CURRENCY"
      ? units > 0
        ? policy.commissionModel.amount
        : 0
      : (policy.commissionModel.amountPerMillion * units) / 1_000_000
  );
  const estimatedCosts = roundMoney(
    estimatedSpreadCost + estimatedSlippageCost + estimatedCommissionCost
  );
  const totalWorstCasePlannedLoss = roundMoney(plannedGrossLoss + estimatedCosts);

  return {
    plannedGrossLoss,
    estimatedSpreadCost,
    estimatedSlippageCost,
    estimatedCommissionCost,
    estimatedCosts,
    totalWorstCasePlannedLoss
  };
}

function roundDownToIncrement(value: number, increment: number): number {
  return Math.floor(value / increment) * increment;
}

function roundMoney(value: number): number {
  return roundMetric(value, 8);
}

function roundPrice(value: number): number {
  return roundMetric(value, 5);
}

function roundMetric(value: number, decimals: number): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
