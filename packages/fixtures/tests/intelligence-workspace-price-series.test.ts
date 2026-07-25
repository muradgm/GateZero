import { describe, expect, it } from "vitest";
import { workspaceCharts } from "../../../scripts/intelligence-workspace-price-series.js";

describe("intelligence workspace price series", () => {
  it("provides valid 1H, 4H, and 1D local OHLC series for every workspace candidate", () => {
    expect(Object.keys(workspaceCharts).sort()).toEqual(["btcusd", "eurusd", "xauusd"]);

    for (const chartSet of Object.values(workspaceCharts)) {
      expect(["1H", "4H", "1D"]).toContain(chartSet.defaultTimeframe);
      expect(Object.keys(chartSet.timeframes).sort()).toEqual(["1D", "1H", "4H"]);

      for (const chart of Object.values(chartSet.timeframes)) {
        expect(chart).toBeDefined();
        if (!chart) continue;
        expect(chart.candles.length).toBeGreaterThanOrEqual(12);
        expect(chart.timeframe.length).toBeGreaterThan(0);
        expect(chart.precision).toBeGreaterThanOrEqual(0);

        for (const candle of chart.candles) {
          expect(candle.high).toBeGreaterThanOrEqual(Math.max(candle.open, candle.close));
          expect(candle.low).toBeLessThanOrEqual(Math.min(candle.open, candle.close));
          expect(Date.parse(candle.time)).not.toBeNaN();
        }
      }
    }
  });

  it("keeps reviewed levels renderable for every timeframe", () => {
    for (const chartSet of Object.values(workspaceCharts)) {
      for (const chart of Object.values(chartSet.timeframes)) {
        if (!chart) continue;
        const lows = chart.candles.map((candle) => candle.low);
        const highs = chart.candles.map((candle) => candle.high);
        const domainLow = Math.min(...lows, chart.levels.trigger, chart.levels.invalidation);
        const domainHigh = Math.max(...highs, chart.levels.trigger, chart.levels.invalidation);

        expect(chart.levels.trigger).toBeGreaterThanOrEqual(domainLow);
        expect(chart.levels.trigger).toBeLessThanOrEqual(domainHigh);
        expect(chart.levels.invalidation).toBeGreaterThanOrEqual(domainLow);
        expect(chart.levels.invalidation).toBeLessThanOrEqual(domainHigh);

        if (chart.levels.target !== null) {
          expect(Number.isFinite(chart.levels.target)).toBe(true);
        }
      }
    }
  });
});