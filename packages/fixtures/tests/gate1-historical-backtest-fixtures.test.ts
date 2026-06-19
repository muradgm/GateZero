import { describe, expect, it } from "vitest";
import {
  Gate1BacktestResultContractSchema,
  Gate1BacktestAssumptionRiskRegisterContractSchema,
  Gate1CandleTimingIntegrityContractSchema,
  Gate1DirectionalPnlContractSchema,
  Gate1FeesAndSlippageAssumptionContractSchema,
  Gate1HistoricalDataSnapshotContractSchema,
  Gate1ImmutableBacktestRecordContractSchema,
  Gate1LookaheadBiasBlockerContractSchema,
  Gate1PnlEvidenceBundleContractSchema,
  Gate1PnlEvidenceReferenceContractSchema,
  Gate1ReproducibilityCheckContractSchema,
  Gate1SameCandleAmbiguityContractSchema,
  Gate1SpreadBidAskAlignmentContractSchema,
  Gate1StrategyVersionContractSchema
} from "../../contracts/src/index.js";
import {
  gate1BacktestAssumptionRiskRegisterFixture,
  gate1BacktestResultFixture,
  gate1BidAskHistoricalDataSnapshotFixture,
  gate1CandleTimingIntegrityFixture,
  gate1CrossCurrencyDirectionalPnlFixture,
  gate1FeesAndSlippageAssumptionFixture,
  gate1HistoricalDataSnapshotFixture,
  gate1ImmutableBacktestRecordFixture,
  gate1JpyPrecisionDirectionalPnlFixture,
  gate1LookaheadBiasBlockerFixture,
  gate1LongDirectionalPnlFixture,
  gate1PnlEvidenceBundleFixture,
  gate1PnlEvidenceReferenceFixture,
  gate1ReproducibilityCheckFixture,
  gate1ReproducibilityMismatchFixture,
  gate1SameCandleAmbiguityFixture,
  gate1ShortDirectionalPnlFixture,
  gate1SpreadBidAskAlignmentFixture,
  gate1StrategyVersionFixture
} from "../src/index.js";

describe("Gate 1 historical backtest fixtures", () => {
  it("keeps every fixture in Gate 1 historical-backtesting-only schema authority", () => {
    const fixtures = [
      gate1HistoricalDataSnapshotFixture,
      gate1BidAskHistoricalDataSnapshotFixture,
      gate1StrategyVersionFixture,
      gate1FeesAndSlippageAssumptionFixture,
      gate1ImmutableBacktestRecordFixture,
      gate1BacktestResultFixture,
      gate1LongDirectionalPnlFixture,
      gate1ShortDirectionalPnlFixture,
      gate1CrossCurrencyDirectionalPnlFixture,
      gate1JpyPrecisionDirectionalPnlFixture,
      gate1PnlEvidenceReferenceFixture,
      gate1PnlEvidenceBundleFixture,
      gate1SpreadBidAskAlignmentFixture,
      gate1CandleTimingIntegrityFixture,
      gate1LookaheadBiasBlockerFixture,
      gate1SameCandleAmbiguityFixture,
      gate1BacktestAssumptionRiskRegisterFixture,
      gate1ReproducibilityCheckFixture,
      gate1ReproducibilityMismatchFixture
    ];

    for (const fixture of fixtures) {
      expect(fixture.financial_gate).toBe("G1_BACKTESTING");
      expect(fixture.scope).toBe("historical_backtesting_only");
      expect(fixture.contract_authority).toBe("schema_only");
      expect(fixture.external_access).toBe(false);
      expect(fixture.execution_path).toBe(false);
    }
  });

  it("validates all synthetic fixtures against their contracts", () => {
    expect(
      Gate1HistoricalDataSnapshotContractSchema.parse(gate1HistoricalDataSnapshotFixture)
    ).toStrictEqual(gate1HistoricalDataSnapshotFixture);
    expect(
      Gate1HistoricalDataSnapshotContractSchema.parse(gate1BidAskHistoricalDataSnapshotFixture)
    ).toStrictEqual(gate1BidAskHistoricalDataSnapshotFixture);
    expect(Gate1StrategyVersionContractSchema.parse(gate1StrategyVersionFixture)).toStrictEqual(
      gate1StrategyVersionFixture
    );
    expect(
      Gate1FeesAndSlippageAssumptionContractSchema.parse(gate1FeesAndSlippageAssumptionFixture)
    ).toStrictEqual(gate1FeesAndSlippageAssumptionFixture);
    expect(
      Gate1ImmutableBacktestRecordContractSchema.parse(gate1ImmutableBacktestRecordFixture)
    ).toStrictEqual(gate1ImmutableBacktestRecordFixture);
    expect(Gate1BacktestResultContractSchema.parse(gate1BacktestResultFixture)).toStrictEqual(
      gate1BacktestResultFixture
    );
    expect(Gate1DirectionalPnlContractSchema.parse(gate1LongDirectionalPnlFixture)).toStrictEqual(
      gate1LongDirectionalPnlFixture
    );
    expect(Gate1DirectionalPnlContractSchema.parse(gate1ShortDirectionalPnlFixture)).toStrictEqual(
      gate1ShortDirectionalPnlFixture
    );
    expect(
      Gate1DirectionalPnlContractSchema.parse(gate1CrossCurrencyDirectionalPnlFixture)
    ).toStrictEqual(gate1CrossCurrencyDirectionalPnlFixture);
    expect(
      Gate1DirectionalPnlContractSchema.parse(gate1JpyPrecisionDirectionalPnlFixture)
    ).toStrictEqual(gate1JpyPrecisionDirectionalPnlFixture);
    expect(
      Gate1PnlEvidenceReferenceContractSchema.parse(gate1PnlEvidenceReferenceFixture)
    ).toStrictEqual(gate1PnlEvidenceReferenceFixture);
    expect(Gate1PnlEvidenceBundleContractSchema.parse(gate1PnlEvidenceBundleFixture)).toStrictEqual(
      gate1PnlEvidenceBundleFixture
    );
    expect(
      Gate1SpreadBidAskAlignmentContractSchema.parse(gate1SpreadBidAskAlignmentFixture)
    ).toStrictEqual(gate1SpreadBidAskAlignmentFixture);
    expect(
      Gate1CandleTimingIntegrityContractSchema.parse(gate1CandleTimingIntegrityFixture)
    ).toStrictEqual(gate1CandleTimingIntegrityFixture);
    expect(
      Gate1LookaheadBiasBlockerContractSchema.parse(gate1LookaheadBiasBlockerFixture)
    ).toStrictEqual(gate1LookaheadBiasBlockerFixture);
    expect(
      Gate1SameCandleAmbiguityContractSchema.parse(gate1SameCandleAmbiguityFixture)
    ).toStrictEqual(gate1SameCandleAmbiguityFixture);
    expect(
      Gate1BacktestAssumptionRiskRegisterContractSchema.parse(
        gate1BacktestAssumptionRiskRegisterFixture
      )
    ).toStrictEqual(gate1BacktestAssumptionRiskRegisterFixture);
    expect(
      Gate1ReproducibilityCheckContractSchema.parse(gate1ReproducibilityCheckFixture)
    ).toStrictEqual(gate1ReproducibilityCheckFixture);
  });

  it("keeps directional PnL fixtures explicit about long and short bid/ask sides", () => {
    expect(gate1LongDirectionalPnlFixture.position_direction).toBe("long");
    expect(gate1LongDirectionalPnlFixture.entry_price_side).toBe("ask");
    expect(gate1LongDirectionalPnlFixture.exit_price_side).toBe("bid");
    expect(gate1LongDirectionalPnlFixture.net_pnl_account_currency).toBe(93);

    expect(gate1ShortDirectionalPnlFixture.position_direction).toBe("short");
    expect(gate1ShortDirectionalPnlFixture.entry_price_side).toBe("bid");
    expect(gate1ShortDirectionalPnlFixture.exit_price_side).toBe("ask");
    expect(gate1ShortDirectionalPnlFixture.net_pnl_account_currency).toBe(93);
  });

  it("keeps cross-currency and JPY precision fixtures explicit", () => {
    expect(gate1CrossCurrencyDirectionalPnlFixture.instrument).toBe("EURGBP");
    expect(gate1CrossCurrencyDirectionalPnlFixture.quote_currency).toBe("GBP");
    expect(gate1CrossCurrencyDirectionalPnlFixture.gross_pnl_account_currency).toBe(125);

    expect(gate1JpyPrecisionDirectionalPnlFixture.instrument).toBe("USDJPY");
    expect(gate1JpyPrecisionDirectionalPnlFixture.quote_currency).toBe("JPY");
    expect(gate1JpyPrecisionDirectionalPnlFixture.gross_pnl_quote_currency).toBe(10000);
  });

  it("keeps bid/ask, timing, lookahead, ambiguity, and risk fixtures explicit", () => {
    const bidAskColumns = gate1BidAskHistoricalDataSnapshotFixture.column_schema.map(
      (column) => column.name
    );

    expect(bidAskColumns).toContain("open_bid");
    expect(bidAskColumns).toContain("open_ask");
    expect(gate1SpreadBidAskAlignmentFixture.alignment_status).toBe("checked");
    expect(gate1CandleTimingIntegrityFixture.timestamp_timezone).toBe("UTC");
    expect(gate1LookaheadBiasBlockerFixture.uses_only_closed_candles).toBe(true);
    expect(gate1SameCandleAmbiguityFixture.ambiguity_status).toBe("checked");
    expect(gate1BacktestAssumptionRiskRegisterFixture.risks.length).toBeGreaterThanOrEqual(2);
  });

  it("keeps the PnL evidence bundle evidence-only with checked declared costs", () => {
    expect(gate1PnlEvidenceReferenceFixture.directional_pnl_check_ids).toHaveLength(4);
    expect(gate1PnlEvidenceBundleFixture.includes_cross_currency_case).toBe(true);
    expect(gate1PnlEvidenceBundleFixture.includes_jpy_precision_case).toBe(true);
    expect(gate1PnlEvidenceBundleFixture.declared_cost_consistency_status).toBe("checked");
    expect(gate1PnlEvidenceBundleFixture.approval_claim).toBe(false);
    expect(gate1PnlEvidenceBundleFixture.performance_claim).toBe(false);
  });

  it("keeps mismatch fixtures unavailable for evidence use", () => {
    expect(gate1ReproducibilityMismatchFixture.reproducibility_status).toBe("mismatch");
    expect(gate1ReproducibilityMismatchFixture.evidence_usable).toBe(false);
  });
});
