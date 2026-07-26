import { describe, expect, it } from "vitest";
import { StrategyRegistrationSchema } from "../src/index.js";

const registration = {
  schemaVersion: 1,
  strategyId: "EURUSD_LONDON_RANGE_BREAKOUT",
  strategyVersion: "1.0.0",
  strategyFamily: "EURUSD_LONDON_RANGE_BREAKOUT",
  instrument: "EURUSD",
  sourceTimeframe: "15m",
  contextTimeframes: [],
  observationEngineVersion: "eurusd-london-range-observation-v1",
  definitionHash: "sha256:definition",
  requiredGates: [
    "DATA_READY",
    "SESSION_ELIGIBLE",
    "RANGE_ESTABLISHED",
    "BREAKOUT_CONFIRMED",
    "EVENT_RISK_CLEAR",
    "INVALIDATION_DEFINED",
    "NOT_EXPIRED"
  ],
  riskReviewRequired: true,
  deterministicSimulationRequired: true,
  outcomeRequired: true,
  learningRequired: true,
  localResearchOnly: true,
  optimizationAuthority: false,
  recommendationFinal: false,
  executionPath: false,
  automatedAction: false
};

describe("strategy platform contracts", () => {
  it("accepts a bounded static strategy registration", () => {
    expect(StrategyRegistrationSchema.parse(registration)).toEqual(registration);
  });

  it("rejects duplicate protected-loop gates", () => {
    expect(() =>
      StrategyRegistrationSchema.parse({
        ...registration,
        requiredGates: ["DATA_READY", "DATA_READY"]
      })
    ).toThrow(/unique protected-loop gates/);
  });

  it.each([
    ["localResearchOnly", false],
    ["optimizationAuthority", true],
    ["recommendationFinal", true],
    ["executionPath", true],
    ["automatedAction", true]
  ])("rejects authority expansion through %s", (field, value) => {
    expect(() => StrategyRegistrationSchema.parse({ ...registration, [field]: value })).toThrow();
  });
});
