import { describe, expect, it } from "vitest";
import {
  Gate1BacktestReproducibilityEvidenceSchema,
  Gate1DeterministicBacktestInputSchema,
  Gate1DeterministicBacktestOutputSchema
} from "../../contracts/src/index.js";
import {
  gate1DeterministicBacktestCandleFixtures,
  gate1DeterministicBacktestInputFixture,
  gate1DeterministicBacktestOutputFixture,
  gate1DeterministicBacktestReproducibilityFixture
} from "../src/index.js";

describe("Gate 1 deterministic backtest runner fixtures", () => {
  it("keeps one checked-in daily bid/ask dataset", () => {
    expect(gate1DeterministicBacktestCandleFixtures).toHaveLength(12);
    expect(gate1DeterministicBacktestCandleFixtures[0]?.timestamp).toBe("2025-01-01T00:00:00.000Z");
  });

  it("keeps input, output, and reproducibility fixtures contract-valid", () => {
    expect(
      Gate1DeterministicBacktestInputSchema.parse(gate1DeterministicBacktestInputFixture)
    ).toEqual(gate1DeterministicBacktestInputFixture);
    expect(
      Gate1DeterministicBacktestOutputSchema.parse(gate1DeterministicBacktestOutputFixture)
    ).toEqual(gate1DeterministicBacktestOutputFixture);
    expect(
      Gate1BacktestReproducibilityEvidenceSchema.parse(
        gate1DeterministicBacktestReproducibilityFixture
      )
    ).toEqual(gate1DeterministicBacktestReproducibilityFixture);
  });

  it("keeps runtime evidence distinct from the old schema-only fixture IDs", () => {
    expect(gate1DeterministicBacktestOutputFixture.backtest_run_id).toContain("gate1-runtime-run");
    expect(gate1DeterministicBacktestOutputFixture.limitations).toContain(
      "Historical results are evidence only and do not imply future performance."
    );
  });
});
