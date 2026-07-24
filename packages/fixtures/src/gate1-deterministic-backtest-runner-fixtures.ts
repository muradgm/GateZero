import {
  Gate1DeterministicBacktestInputSchema,
  type Gate1BacktestCandle,
  type Gate1DeterministicBacktestInput
} from "../../contracts/src/index.js";
import {
  GATE1_REFERENCE_STRATEGY_LOGIC_HASH,
  calculateGate1DatasetContentHash,
  checkGate1BacktestReproducibility,
  runGate1DeterministicBacktest
} from "../../core/src/index.js";

const bidCloses = [100, 99, 98, 99, 101, 102, 103, 101, 99, 98, 100, 102] as const;
const bidOpens = [100, 100, 99, 98, 99, 101, 102, 103, 102, 99, 98, 100] as const;

export const gate1DeterministicBacktestCandleFixtures: readonly Gate1BacktestCandle[] =
  bidCloses.map((bidClose, index) => {
    const bidOpen = bidOpens[index];
    if (bidOpen === undefined) {
      throw new Error("fixture open price is missing");
    }

    const bidHigh = Math.max(bidOpen, bidClose) + 0.5;
    const bidLow = Math.min(bidOpen, bidClose) - 0.5;
    const spread = 0.1;

    return {
      timestamp: new Date(Date.UTC(2025, 0, index + 1)).toISOString(),
      bid_open: bidOpen,
      ask_open: bidOpen + spread,
      bid_high: bidHigh,
      ask_high: bidHigh + spread,
      bid_low: bidLow,
      ask_low: bidLow + spread,
      bid_close: bidClose,
      ask_close: bidClose + spread
    };
  });

export const gate1DeterministicBacktestInputFixture: Gate1DeterministicBacktestInput =
  Gate1DeterministicBacktestInputSchema.parse({
    financial_gate: "G1_BACKTESTING",
    scope: "historical_backtesting_only",
    runtime_authority: "local_deterministic_research",
    local_only: true,
    evidence_only: true,
    operator_required: true,
    risk_review_required: true,
    external_access: false,
    execution_path: false,
    automated_action: false,
    approval_claim: false,
    performance_claim: false,
    historical_data_snapshot_id: "gate1-runtime-data-snapshot-001",
    dataset_content_hash: calculateGate1DatasetContentHash(
      gate1DeterministicBacktestCandleFixtures
    ),
    instrument: "SYNTH",
    timeframe: "1d",
    interval_seconds: 86400,
    as_of: "2025-01-12T23:59:59.000Z",
    starting_capital: 10_000,
    candles: gate1DeterministicBacktestCandleFixtures,
    strategy: {
      strategy_version_id: "gate1-runtime-strategy-version-001",
      strategy_family: "moving_average_crossover_long_only",
      source_logic_hash: GATE1_REFERENCE_STRATEGY_LOGIC_HASH,
      short_window: 2,
      long_window: 3,
      quantity: 10,
      one_position_maximum: true,
      signal_on_closed_candle_only: true,
      execute_on_next_candle_open: true
    },
    costs: {
      fees_and_slippage_assumption_id: "gate1-runtime-cost-assumption-001",
      commission_bps_per_side: 10,
      slippage_bps_per_side: 5,
      spread_source: "candle_bid_ask",
      zero_cost_assumption: false
    }
  });

export const gate1DeterministicBacktestOutputFixture = runGate1DeterministicBacktest(
  gate1DeterministicBacktestInputFixture
);

export const gate1DeterministicBacktestReproducibilityFixture = checkGate1BacktestReproducibility({
  first: gate1DeterministicBacktestOutputFixture,
  second: runGate1DeterministicBacktest(gate1DeterministicBacktestInputFixture),
  checkedAt: "2025-01-13T00:00:00.000Z"
});
