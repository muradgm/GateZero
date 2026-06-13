import { describe, expect, it } from "vitest";
import {
  BacktestResultSchema,
  DataSnapshotSchema,
  RiskReviewSchema
} from "../../contracts/src/index.js";
import {
  benchmarkFixtures,
  biasedBacktestFixture,
  feeSlippageFixture,
  lowTradeCountFixture,
  missingDataFixture,
  riskVetoFixture
} from "../src/index.js";

describe("benchmark fixtures", () => {
  it("exports the required Gate 0 fixture categories", () => {
    expect(benchmarkFixtures.map((fixture) => fixture.kind)).toEqual([
      "fee_slippage",
      "biased_backtest",
      "low_trade_count",
      "missing_data",
      "risk_veto"
    ]);
  });

  it("parses all valid fixture payloads through their contracts", () => {
    expect(BacktestResultSchema.parse(feeSlippageFixture.payload).fee_model).toBeTruthy();
    expect(BacktestResultSchema.parse(biasedBacktestFixture.payload).verdict).toBe(
      "requires_revision"
    );
    expect(BacktestResultSchema.parse(lowTradeCountFixture.payload).verdict).toBe(
      "insufficient_evidence"
    );
    expect(DataSnapshotSchema.parse(missingDataFixture.payload).quality_warnings).toHaveLength(1);
    expect(RiskReviewSchema.parse(riskVetoFixture.payload).approved).toBe(false);
  });

  it("keeps fee and slippage assumptions explicit", () => {
    expect(feeSlippageFixture.payload.fee_model).toBe("fixed synthetic fee model");
    expect(feeSlippageFixture.payload.slippage_model).toBe("fixed synthetic slippage model");
    expect(feeSlippageFixture.payload.trade_list[0]?.fees).toBeGreaterThanOrEqual(0);
    expect(feeSlippageFixture.payload.trade_list[0]?.slippage).toBeGreaterThanOrEqual(0);
  });

  it("rejects missing fee and slippage assumptions", () => {
    const invalidPayload = {
      ...feeSlippageFixture.payload,
      fee_model: undefined,
      slippage_model: undefined
    };

    expect(() => BacktestResultSchema.parse(invalidPayload)).toThrow();
  });

  it("tags biased and missing-data fixtures for review", () => {
    expect(biasedBacktestFixture.expected_failure_tags).toContain("requires_bias_review");
    expect(biasedBacktestFixture.payload.generated_warnings).toContain("requires bias review");
    expect(missingDataFixture.expected_failure_tags).toContain("missing_data");
    expect(missingDataFixture.payload.quality_warnings).toContain(
      "missing records in synthetic fixture"
    );
  });

  it("keeps risk-veto fixture blocked", () => {
    expect(riskVetoFixture.payload.verdict).toBe("blocked_by_risk");
    expect(riskVetoFixture.payload.approved).toBe(false);
    expect(riskVetoFixture.payload.blocking_findings).toHaveLength(1);

    expect(() =>
      RiskReviewSchema.parse({
        ...riskVetoFixture.payload,
        approved: true
      })
    ).toThrow();
  });

  it("marks low-trade-count evidence as insufficient", () => {
    expect(lowTradeCountFixture.expected_failure_tags).toContain("low_trade_count");
    expect(lowTradeCountFixture.payload.metric_summary.trade_count).toBe(1);
    expect(lowTradeCountFixture.payload.metric_summary.warnings).toContain("low trade count");
  });
});
