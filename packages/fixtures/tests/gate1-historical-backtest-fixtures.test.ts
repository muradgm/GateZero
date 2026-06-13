import { describe, expect, it } from "vitest";
import {
  Gate1BacktestResultContractSchema,
  Gate1FeesAndSlippageAssumptionContractSchema,
  Gate1HistoricalDataSnapshotContractSchema,
  Gate1ImmutableBacktestRecordContractSchema,
  Gate1ReproducibilityCheckContractSchema,
  Gate1StrategyVersionContractSchema
} from "../../contracts/src/index.js";
import {
  gate1BacktestResultFixture,
  gate1FeesAndSlippageAssumptionFixture,
  gate1HistoricalDataSnapshotFixture,
  gate1ImmutableBacktestRecordFixture,
  gate1ReproducibilityCheckFixture,
  gate1ReproducibilityMismatchFixture,
  gate1StrategyVersionFixture
} from "../src/index.js";

describe("Gate 1 historical backtest fixtures", () => {
  it("keeps every fixture in Gate 0 research-only schema authority", () => {
    const fixtures = [
      gate1HistoricalDataSnapshotFixture,
      gate1StrategyVersionFixture,
      gate1FeesAndSlippageAssumptionFixture,
      gate1ImmutableBacktestRecordFixture,
      gate1BacktestResultFixture,
      gate1ReproducibilityCheckFixture,
      gate1ReproducibilityMismatchFixture
    ];

    for (const fixture of fixtures) {
      expect(fixture.financial_gate).toBe("G0_RESEARCH");
      expect(fixture.scope).toBe("research_only");
      expect(fixture.contract_authority).toBe("schema_only");
      expect(fixture.external_access).toBe(false);
      expect(fixture.execution_path).toBe(false);
    }
  });

  it("validates all synthetic fixtures against their contracts", () => {
    expect(
      Gate1HistoricalDataSnapshotContractSchema.parse(gate1HistoricalDataSnapshotFixture)
    ).toStrictEqual(gate1HistoricalDataSnapshotFixture);
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
    expect(
      Gate1ReproducibilityCheckContractSchema.parse(gate1ReproducibilityCheckFixture)
    ).toStrictEqual(gate1ReproducibilityCheckFixture);
  });

  it("keeps mismatch fixtures unavailable for evidence use", () => {
    expect(gate1ReproducibilityMismatchFixture.reproducibility_status).toBe("mismatch");
    expect(gate1ReproducibilityMismatchFixture.evidence_usable).toBe(false);
  });
});
