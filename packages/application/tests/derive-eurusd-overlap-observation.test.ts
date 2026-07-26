import { describe, expect, it } from "vitest";
import type { NormalizedMarketCandle, TimeBoundMarketCandle } from "@traderframe/contracts";
import { deriveEurUsdOverlapObservation, evaluateEurUsdOverlapPullback } from "../src/index.js";

const DECISION_TIME = "2026-07-24T13:00:00.000Z";

function sourceCandle(
  index: number,
  values: Pick<NormalizedMarketCandle, "open" | "high" | "low" | "close">
): NormalizedMarketCandle {
  const openedAt = new Date(
    Date.parse("2026-07-24T08:45:00.000Z") + index * 15 * 60 * 1000
  ).toISOString();
  const closedAt = new Date(Date.parse(openedAt) + 15 * 60 * 1000).toISOString();
  return {
    candleId: `EURUSD-15m-${openedAt}`,
    sourceId: "historical-eurusd-case-001",
    instrument: "EURUSD",
    timeframe: "15m",
    openedAt,
    closedAt,
    timezone: "UTC",
    ...values,
    volume: 100 + index,
    finalized: true,
    sourceHash: `source-15m-${index}`,
    normalizationVersion: "market-normalization-v1"
  };
}

function sourceSeries(): NormalizedMarketCandle[] {
  const candles: NormalizedMarketCandle[] = [];
  for (let index = 0; index < 12; index += 1) {
    const open = 1.1 + index * 0.00025;
    candles.push(
      sourceCandle(index, {
        open,
        high: open + 0.00055,
        low: open - 0.0004,
        close: open + 0.00025
      })
    );
  }

  candles.push(
    sourceCandle(12, {
      open: 1.1012,
      high: 1.1017,
      low: 1.0993,
      close: 1.10015
    })
  );
  candles.push(
    sourceCandle(13, {
      open: 1.1002,
      high: 1.1022,
      low: 1.1001,
      close: 1.1019
    })
  );
  candles.push(
    sourceCandle(14, {
      open: 1.1019,
      high: 1.103,
      low: 1.1016,
      close: 1.1027
    })
  );
  candles.push(
    sourceCandle(15, {
      open: 1.1027,
      high: 1.10285,
      low: 1.1019,
      close: 1.10225
    })
  );
  candles.push(
    sourceCandle(16, {
      open: 1.10225,
      high: 1.1026,
      low: 1.1018,
      close: 1.1022
    })
  );
  return candles;
}

function higherTimeframeSeries(timeframe: "1H" | "4H"): TimeBoundMarketCandle[] {
  const interval = timeframe === "1H" ? 60 * 60 * 1000 : 4 * 60 * 60 * 1000;
  return Array.from({ length: 50 }, (_, index) => {
    const closedAt = new Date(Date.parse(DECISION_TIME) - (49 - index) * interval).toISOString();
    const openedAt = new Date(Date.parse(closedAt) - interval).toISOString();
    const close = 1.08 + index * 0.0005;
    return {
      candleId: `EURUSD-${timeframe}-${openedAt}`,
      sourceId: "historical-eurusd-case-001",
      instrument: "EURUSD",
      timeframe,
      openedAt,
      closedAt,
      timezone: "UTC",
      open: close - 0.0002,
      high: close + 0.00035,
      low: close - 0.00035,
      close,
      volume: 400 + index,
      finalized: true,
      sourceHash: `source-${timeframe}-${index}`,
      normalizationVersion: "market-normalization-v1",
      availableAt: closedAt,
      derivedFromCandleIds: [`derived-${timeframe}-${index}`],
      derivedFromHashes: [`derived-hash-${timeframe}-${index}`],
      aggregationVersion: "timeframe-aggregation-v1"
    };
  });
}

describe("deriveEurUsdOverlapObservation", () => {
  it("derives EMA context, ATR pullback, sweep, reclaim, displacement and trigger from candles", () => {
    const result = deriveEurUsdOverlapObservation({
      decisionTimestamp: DECISION_TIME,
      candles15m: sourceSeries(),
      candles1H: higherTimeframeSeries("1H"),
      candles4H: higherTimeframeSeries("4H"),
      minutesToNearestHighImpactEvent: 120
    });

    expect(result.observation.dataReady).toBe(true);
    expect(result.observation.direction).toBe("LONG");
    expect(result.observation.higherTimeframeAligned).toBe(true);
    expect(result.observation.pullbackRetracementAtr).toBeGreaterThanOrEqual(0.25);
    expect(result.observation.pullbackRetracementAtr).toBeLessThanOrEqual(1.25);
    expect(result.observation.liquiditySweepDetected).toBe(true);
    expect(result.observation.sweepPenetrationPips).toBeGreaterThanOrEqual(1);
    expect(result.observation.displacementAtr).toBeGreaterThanOrEqual(0.5);
    expect(result.observation.triggerConfirmed).toBe(true);
    expect(result.observation.invalidationPrice).toBeLessThan(1.0993);
    expect(result.diagnostics.sweepCandleId).toContain("11:45:00.000Z");
    expect(result.diagnostics.triggerCandleId).toContain("12:00:00.000Z");
  });

  it("produces a gate assessment without manually authored evidence booleans", () => {
    const derived = deriveEurUsdOverlapObservation({
      decisionTimestamp: DECISION_TIME,
      candles15m: sourceSeries(),
      candles1H: higherTimeframeSeries("1H"),
      candles4H: higherTimeframeSeries("4H"),
      minutesToNearestHighImpactEvent: 120
    });
    const assessment = evaluateEurUsdOverlapPullback(derived.observation);

    expect(assessment.recommendation).toBe("PAPER_SIMULATE");
    expect(assessment.ruleResults.every((rule) => rule.status === "PASS")).toBe(true);
    expect("score" in assessment).toBe(false);
    expect("confidence" in assessment).toBe(false);
  });

  it("excludes candles unavailable at the decision timestamp", () => {
    const future15m = sourceCandle(17, {
      open: 1.1022,
      high: 1.104,
      low: 1.102,
      close: 1.1038
    });
    const future1H = {
      ...higherTimeframeSeries("1H").at(-1)!,
      candleId: "future-1H",
      openedAt: "2026-07-24T13:00:00.000Z",
      closedAt: "2026-07-24T14:00:00.000Z",
      availableAt: "2026-07-24T14:00:00.000Z"
    };

    const result = deriveEurUsdOverlapObservation({
      decisionTimestamp: DECISION_TIME,
      candles15m: [...sourceSeries(), future15m],
      candles1H: [...higherTimeframeSeries("1H"), future1H],
      candles4H: higherTimeframeSeries("4H"),
      minutesToNearestHighImpactEvent: 120
    });

    expect(result.diagnostics.excludedFutureCandleIds).toEqual(
      expect.arrayContaining([future15m.candleId, "future-1H"])
    );
    expect(Date.parse(result.observation.availableAt)).toBeLessThanOrEqual(
      Date.parse(DECISION_TIME)
    );
    expect(result.observation.currentPrice).toBe(sourceSeries().at(-1)!.close);
  });

  it("fails data readiness when higher-timeframe EMA history is insufficient", () => {
    const result = deriveEurUsdOverlapObservation({
      decisionTimestamp: DECISION_TIME,
      candles15m: sourceSeries(),
      candles1H: higherTimeframeSeries("1H").slice(-10),
      candles4H: higherTimeframeSeries("4H").slice(-10),
      minutesToNearestHighImpactEvent: 120
    });

    expect(result.observation.dataReady).toBe(false);
    expect(result.observation.higherTimeframeAligned).toBe(false);
    expect(result.diagnostics.reasons).toContain(
      "Insufficient closed candles for ATR, sweep, or higher-timeframe EMA derivation."
    );
  });
});
