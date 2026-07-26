import {
  DeterministicSimulationResultSchema,
  FrozenDecisionRecordSchema,
  NormalizedMarketCandleSchema,
  SimulationPolicySchema,
  type DeterministicSimulationResult,
  type FrozenDecisionRecord,
  type NormalizedMarketCandle,
  type SimulationPolicy
} from "@traderframe/contracts";
import { hashCanonicalValue } from "./canonical-risk-review.js";

export function runDeterministicSimulation(input: {
  readonly frozenRecord: FrozenDecisionRecord;
  readonly policy: SimulationPolicy;
  readonly candles: readonly NormalizedMarketCandle[];
}): DeterministicSimulationResult {
  const record = FrozenDecisionRecordSchema.parse(input.frozenRecord);
  const policy = SimulationPolicySchema.parse(input.policy);
  const candles = input.candles
    .map((candle) => NormalizedMarketCandleSchema.parse(candle))
    .sort((left, right) => Date.parse(left.openedAt) - Date.parse(right.openedAt));
  const plan = record.bundle.simulationPlan;

  if (record.bundleHash !== hashCanonicalValue(record.bundle)) {
    throw new Error("frozen decision bundle hash mismatch");
  }
  if (record.bundle.recommendation !== "PAPER_SIMULATE" || !plan) {
    throw new Error("deterministic simulation requires a frozen PAPER_SIMULATE plan");
  }
  if (policy.version !== record.bundle.simulationPolicyVersion) {
    throw new Error("simulation policy version does not match the frozen bundle");
  }
  if (candles.some((candle) => candle.instrument !== record.bundle.instrument)) {
    throw new Error("simulation candles do not match the frozen instrument");
  }

  const eligible = candles.filter(
    (candle) => Date.parse(candle.openedAt) >= Date.parse(record.bundle.decisionTimestamp)
  );
  const spreadPips =
    policy.spreadModel.type === "FIXED_PIPS" ? (policy.spreadModel.valuePips ?? 0) : 0;
  const slippagePips = policy.slippageModel.type === "FIXED_PIPS" ? policy.slippageModel.value : 0;
  const priceAdjustment = (spreadPips + slippagePips) * policy.pipSize;
  const fillIndex = eligible.findIndex((candle) =>
    isFill(candle, plan.entryPrice, policy.orderType)
  );

  if (fillIndex < 0) {
    return finalize({
      simulationId: `${record.bundle.traceId}:simulation`,
      frozenBundleHash: record.bundleHash,
      policyId: policy.policyId,
      policyVersion: policy.version,
      status: "NOT_FILLED",
      barsHeld: 0,
      commissionAmount: policy.commissionModel.value,
      spreadPips,
      slippagePips
    });
  }

  const fillCandle = eligible[fillIndex]!;
  const fillPrice = roundPrice(
    plan.entryPrice + (plan.direction === "LONG" ? priceAdjustment : -priceAdjustment),
    policy.pricePrecision
  );
  const riskPerUnit = Math.abs(fillPrice - plan.stopPrice);
  let maeR = 0;
  let mfeR = 0;
  const held = eligible.slice(fillIndex, fillIndex + policy.maximumHoldingBars);

  for (let index = 0; index < held.length; index += 1) {
    const candle = held[index]!;
    const stopHit =
      plan.direction === "LONG" ? candle.low <= plan.stopPrice : candle.high >= plan.stopPrice;
    const targetHit =
      plan.direction === "LONG" ? candle.high >= plan.targetPrice : candle.low <= plan.targetPrice;
    const favorable = plan.direction === "LONG" ? candle.high - fillPrice : fillPrice - candle.low;
    const adverse = plan.direction === "LONG" ? candle.low - fillPrice : fillPrice - candle.high;
    mfeR = Math.max(mfeR, favorable / riskPerUnit);
    maeR = Math.min(maeR, adverse / riskPerUnit);

    if (stopHit && targetHit && policy.sameCandleConflictPolicy === "LOWER_TIMEFRAME_REQUIRED") {
      return finalize({
        simulationId: `${record.bundle.traceId}:simulation`,
        frozenBundleHash: record.bundleHash,
        policyId: policy.policyId,
        policyVersion: policy.version,
        status: "INVALID",
        filledAt: fillCandle.openedAt,
        fillPrice,
        barsHeld: index + 1,
        commissionAmount: policy.commissionModel.value,
        spreadPips,
        slippagePips,
        invalidationReason: "same-candle stop and target conflict requires lower-timeframe evidence"
      });
    }

    const exit = chooseExit(stopHit, targetHit, policy.sameCandleConflictPolicy);
    if (exit) {
      const exitPrice = exit === "STOP" ? plan.stopPrice : plan.targetPrice;
      return completedResult({
        record,
        policy,
        status: exit,
        filledAt: fillCandle.openedAt,
        exitedAt: candle.closedAt,
        fillPrice,
        exitPrice,
        maeR,
        mfeR,
        barsHeld: index + 1,
        spreadPips,
        slippagePips,
        positionSizeUnits: plan.positionSizeUnits,
        plannedRiskAmount: plan.plannedRiskAmount
      });
    }
  }

  const last = held.at(-1);
  if (!last) {
    throw new Error("filled simulation has no holding-period candle");
  }
  return completedResult({
    record,
    policy,
    status: "EXPIRED",
    filledAt: fillCandle.openedAt,
    exitedAt: last.closedAt,
    fillPrice,
    exitPrice: last.close,
    maeR,
    mfeR,
    barsHeld: held.length,
    spreadPips,
    slippagePips,
    positionSizeUnits: plan.positionSizeUnits,
    plannedRiskAmount: plan.plannedRiskAmount
  });
}

function completedResult(input: {
  record: FrozenDecisionRecord;
  policy: SimulationPolicy;
  status: "TARGET" | "STOP" | "EXPIRED";
  filledAt: string;
  exitedAt: string;
  fillPrice: number;
  exitPrice: number;
  maeR: number;
  mfeR: number;
  barsHeld: number;
  spreadPips: number;
  slippagePips: number;
  positionSizeUnits: number;
  plannedRiskAmount: number;
}): DeterministicSimulationResult {
  const direction = input.record.bundle.simulationPlan!.direction;
  const gross =
    (direction === "LONG" ? input.exitPrice - input.fillPrice : input.fillPrice - input.exitPrice) *
    input.positionSizeUnits;
  const commissionAmount = input.policy.commissionModel.value;
  return finalize({
    simulationId: `${input.record.bundle.traceId}:simulation`,
    frozenBundleHash: input.record.bundleHash,
    policyId: input.policy.policyId,
    policyVersion: input.policy.version,
    status: input.status,
    filledAt: input.filledAt,
    exitedAt: input.exitedAt,
    fillPrice: input.fillPrice,
    exitPrice: roundPrice(input.exitPrice, input.policy.pricePrecision),
    maeR: roundMetric(input.maeR),
    mfeR: roundMetric(input.mfeR),
    realizedR: roundMetric((gross - commissionAmount) / input.plannedRiskAmount),
    barsHeld: input.barsHeld,
    commissionAmount,
    spreadPips: input.spreadPips,
    slippagePips: input.slippagePips
  });
}

function finalize(
  value: Omit<
    DeterministicSimulationResult,
    | "schemaVersion"
    | "outputHash"
    | "localSimulationOnly"
    | "executionPath"
    | "automatedAction"
    | "performanceClaim"
  >
): DeterministicSimulationResult {
  const payload = {
    schemaVersion: 1 as const,
    ...value,
    localSimulationOnly: true as const,
    executionPath: false as const,
    automatedAction: false as const,
    performanceClaim: false as const
  };
  return DeterministicSimulationResultSchema.parse({
    ...payload,
    outputHash: hashCanonicalValue(payload)
  });
}

function isFill(
  candle: NormalizedMarketCandle,
  entryPrice: number,
  orderType: SimulationPolicy["orderType"]
): boolean {
  if (orderType === "MARKET") return true;
  return candle.low <= entryPrice && candle.high >= entryPrice;
}

function chooseExit(
  stopHit: boolean,
  targetHit: boolean,
  conflict: SimulationPolicy["sameCandleConflictPolicy"]
): "STOP" | "TARGET" | null {
  if (stopHit && targetHit) return conflict === "TARGET_FIRST" ? "TARGET" : "STOP";
  if (stopHit) return "STOP";
  if (targetHit) return "TARGET";
  return null;
}

function roundPrice(value: number, precision: number): number {
  return Number(value.toFixed(precision));
}

function roundMetric(value: number): number {
  return Number(value.toFixed(6));
}
