import {
  gate1DeterministicBacktestOutputFixture,
  gate1DeterministicBacktestReproducibilityFixture
} from "../packages/fixtures/src/index.js";

export interface BacktestRunEvidenceView {
  readonly title: string;
  readonly runId: string;
  readonly resultId: string;
  readonly status: string;
  readonly engineVersion: string;
  readonly instrument: string;
  readonly observationCount: number;
  readonly closedTradeCount: number;
  readonly declaredCostsApplied: boolean;
  readonly reproducibilityStatus: string;
  readonly inputHash: string;
  readonly outputHash: string;
  readonly limitations: readonly string[];
}

export function buildBacktestRunEvidence(): BacktestRunEvidenceView {
  const output = gate1DeterministicBacktestOutputFixture;
  const reproducibility = gate1DeterministicBacktestReproducibilityFixture;

  return {
    title: "Generated Historical Backtest Evidence",
    runId: output.backtest_run_id,
    resultId: output.backtest_result_id,
    status:
      output.result_status === "completed"
        ? "Historical evidence recorded"
        : "Historical evidence recorded with no closed trades",
    engineVersion: output.backtest_engine_version,
    instrument: output.instrument,
    observationCount: output.metrics.observation_count,
    closedTradeCount: output.metrics.trade_count,
    declaredCostsApplied:
      output.metrics.total_commission_cost > 0 && output.metrics.total_slippage_cost > 0,
    reproducibilityStatus: reproducibility.reproducibility_status,
    inputHash: output.input_hash,
    outputHash: output.output_hash,
    limitations: output.limitations
  };
}
