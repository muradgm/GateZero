import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  createPortfolioRiskCheckpoint,
  evaluatePortfolioRisk
} from "../packages/application/src/index.js";
import type { PortfolioRiskContext } from "../packages/contracts/src/index.js";

const commonContext = {
  schemaVersion: 1 as const,
  policy: {
    policyId: "bounded-paper-risk-policy",
    policyVersion: "1.0.0",
    accountCurrency: "USD",
    accountEquity: 10_000,
    equityHighWaterMark: 10_400,
    maximumInstrumentExposurePct: 20,
    maximumCurrencyExposurePct: 30,
    maximumCorrelationExposurePct: 25,
    maximumEventRiskPct: 0.5,
    maximumSessionRiskAmount: 100,
    maximumDailyRiskAmount: 150,
    maximumDrawdownPct: 5,
    warningUtilizationPct: 80
  },
  existingPositions: [
    {
      positionId: "existing-gbpusd",
      instrument: "GBPUSD",
      baseCurrency: "GBP",
      quoteCurrency: "USD",
      side: "LONG" as const,
      notionalAmount: 1_000,
      plannedRiskAmount: 25,
      correlationGroup: "USD_DIRECTION",
      session: "OVERLAP" as const,
      eventIds: ["US_CPI"],
      evidenceVersionIds: ["gbpusd-position-v1"]
    }
  ],
  realizedSessionLossAmount: 20,
  realizedDailyLossAmount: 30,
  evidenceVersionIds: ["portfolio-state-v1", "risk-policy-v1"],
  evaluatedAt: "2026-07-24T16:30:00.000Z",
  localSimulationOnly: true as const,
  executionPath: false as const,
  automatedAction: false as const
};

function buildContext(
  contextId: string,
  candidate: Pick<PortfolioRiskContext["candidatePosition"], "notionalAmount" | "plannedRiskAmount">
): PortfolioRiskContext {
  return {
    ...commonContext,
    contextId,
    candidatePosition: {
      positionId: `candidate-eurusd-${contextId}`,
      instrument: "EURUSD",
      baseCurrency: "EUR",
      quoteCurrency: "USD",
      side: "LONG",
      notionalAmount: candidate.notionalAmount,
      plannedRiskAmount: candidate.plannedRiskAmount,
      correlationGroup: "USD_DIRECTION",
      session: "OVERLAP",
      eventIds: ["US_CPI"],
      evidenceVersionIds: ["epoch3-eurusd-candidate-v1"]
    }
  };
}

const limitations = [
  "One local EURUSD paper-simulation portfolio fixture only.",
  "Correlation groups and event links are manually declared fixture evidence.",
  "Risk status is not approval, readiness, or execution authority."
];
const reviewContext = buildContext("epoch3-review-context", {
  notionalAmount: 1_000,
  plannedRiskAmount: 25
});
const blockedContext = buildContext("epoch3-blocked-context", {
  notionalAmount: 1_800,
  plannedRiskAmount: 40
});
const reviewAssessment = evaluatePortfolioRisk({
  assessmentId: "epoch3-review-assessment",
  context: reviewContext,
  limitations
});
const repeatedAssessment = evaluatePortfolioRisk({
  assessmentId: "epoch3-review-assessment",
  context: reviewContext,
  limitations
});
const blockedAssessment = evaluatePortfolioRisk({
  assessmentId: "epoch3-blocked-assessment",
  context: blockedContext,
  limitations
});
const checkpoint = createPortfolioRiskCheckpoint({
  checkpointId: "epoch3-risk-checkpoint",
  firstReviewAssessment: reviewAssessment,
  secondReviewAssessment: repeatedAssessment,
  blockedAssessment,
  checkedAt: "2026-07-24T16:35:00.000Z"
});
const output = {
  dataMode: "LOCAL_PORTFOLIO_RISK_FIXTURE",
  reviewContext,
  reviewAssessment,
  blockedContext,
  blockedAssessment,
  checkpoint,
  limitations
};
const target = path.join(process.cwd(), "apps", "intelligence-workspace", "public", "runtime");
await mkdir(target, { recursive: true });
await writeFile(
  path.join(target, "epoch3-risk-case.json"),
  `${JSON.stringify(output, null, 2)}\n`,
  "utf8"
);
