import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  buildTradingIntelligenceReport,
  createDecisionPipeline,
  completeDecisionPipelineStage,
  rankTradingIntelligenceReports
} from "../packages/application/src/index.js";

const generatedAt = "2026-07-25T01:45:00.000Z";

function buildPipeline(
  id: string,
  researchCaseId: string,
  instrument: string,
  recommendation: "REJECT" | "WATCH" | "PAPER_SIMULATE",
  completedStages: readonly string[]
) {
  let pipeline = createDecisionPipeline({
    pipelineId: id,
    researchCaseId,
    instrument,
    researchCaseRecordId: `${researchCaseId}-record`,
    now: generatedAt
  });

  for (const stage of completedStages) {
    pipeline = completeDecisionPipelineStage(pipeline, {
      stage: stage as Parameters<typeof completeDecisionPipelineStage>[1]["stage"],
      recordId: `${id}-${stage}`,
      evidenceIds: [`${id}-${stage}-evidence`],
      completedAt: generatedAt,
      recommendation: stage === "operator_decision" ? recommendation : undefined
    });
  }

  return pipeline;
}

const cases = [
  {
    id: "eurusd",
    instrument: "EUR/USD",
    market: "FX",
    context: {
      session: "London / New York overlap",
      volatility: "Normal",
      trend: "Bullish",
      structure: "Pullback",
      momentum: "Stable"
    },
    risk: { amount: "$55", ceiling: "$100", exposure: "12%", rewardRisk: "2.0R" },
    invalidation: "Reject below the confirmed 1H structure low at 1.0800.",
    report: buildTradingIntelligenceReport({
      reportId: "intelligence-eurusd-001",
      setupReviewId: "setup-review-eurusd-001",
      instrument: "EUR/USD",
      generatedAt,
      contributions: [
        {
          contributionId: "eur-trend",
          dimension: "trend",
          label: "Trend",
          evidenceIds: ["eur-trend-evidence"],
          direction: "supporting",
          points: 18,
          rationale: "Daily and four-hour structures remain aligned.",
          limitation: "Historical local snapshot only."
        },
        {
          contributionId: "eur-structure",
          dimension: "market_structure",
          label: "Market structure",
          evidenceIds: ["eur-structure-evidence"],
          direction: "supporting",
          points: 16,
          rationale: "The one-hour pullback remains above the prior expansion base.",
          limitation: "Trigger confirmation is still required."
        },
        {
          contributionId: "eur-liquidity",
          dimension: "liquidity",
          label: "Liquidity",
          evidenceIds: ["eur-liquidity-evidence"],
          direction: "supporting",
          points: 8,
          rationale: "Sell-side liquidity has already been tested.",
          limitation: "No external order-book feed is used."
        },
        {
          contributionId: "eur-macro",
          dimension: "macro",
          label: "Macro",
          evidenceIds: ["eur-macro-evidence"],
          direction: "contradicting",
          points: -5,
          rationale: "US data risk remains inside the review window.",
          limitation: "Event impact is not predicted."
        },
        {
          contributionId: "eur-risk",
          dimension: "risk",
          label: "Risk",
          evidenceIds: ["eur-risk-evidence"],
          direction: "supporting",
          points: 13,
          rationale: "Planned loss remains below the declared account ceiling.",
          limitation: "Paper-simulation planning only."
        }
      ],
      bullCase: {
        title: "Bull case",
        summary: "Higher-timeframe alignment and bounded risk support continued review.",
        evidenceIds: ["eur-trend-evidence", "eur-structure-evidence"],
        limitations: ["The trigger has not yet been observed."]
      },
      bearCase: {
        title: "Bear case",
        summary: "Macro timing and stable rather than strengthening momentum reduce conviction.",
        evidenceIds: ["eur-macro-evidence"],
        limitations: ["Event impact is uncertain."]
      },
      neutralCase: {
        title: "Neutral case",
        summary: "Wait for the defined one-hour trigger before any paper simulation.",
        evidenceIds: [],
        limitations: ["No recommendation is execution authority."]
      },
      timeline: [
        {
          eventId: "eur-open",
          occurredAt: "2026-07-25T08:00:00.000Z",
          type: "market_open",
          title: "London session opened",
          summary: "Local market context became active.",
          evidenceIds: [],
          severity: "info"
        },
        {
          eventId: "eur-liquidity-event",
          occurredAt: "2026-07-25T09:10:00.000Z",
          type: "liquidity_event",
          title: "Sell-side liquidity tested",
          summary: "The reviewed structure remained intact.",
          evidenceIds: ["eur-liquidity-evidence"],
          severity: "info"
        },
        {
          eventId: "eur-risk-review",
          occurredAt: "2026-07-25T11:00:00.000Z",
          type: "risk_review",
          title: "Risk review linked",
          summary: "Declared loss remained within the bounded ceiling.",
          evidenceIds: ["eur-risk-evidence"],
          severity: "attention"
        }
      ],
      invalidationSummary: "Reject below the confirmed one-hour structure low.",
      downgradeReasons: []
    }),
    pipeline: buildPipeline(
      "pipeline-eurusd",
      "research-case-eurusd",
      "EUR/USD",
      "PAPER_SIMULATE",
      [
        "market_context",
        "evidence_assessment",
        "setup_review",
        "intelligence_report",
        "risk_review"
      ]
    )
  },
  {
    id: "btcusd",
    instrument: "BTC/USD",
    market: "Crypto",
    context: {
      session: "Continuous",
      volatility: "Elevated",
      trend: "Bullish",
      structure: "Expansion",
      momentum: "Weakening"
    },
    risk: { amount: "$70", ceiling: "$100", exposure: "19%", rewardRisk: "1.7R" },
    invalidation: "Reject if price closes below the four-hour expansion base.",
    report: buildTradingIntelligenceReport({
      reportId: "intelligence-btcusd-001",
      setupReviewId: "setup-review-btcusd-001",
      instrument: "BTC/USD",
      generatedAt,
      contributions: [
        {
          contributionId: "btc-trend",
          dimension: "trend",
          label: "Trend",
          evidenceIds: ["btc-trend-evidence"],
          direction: "supporting",
          points: 17,
          rationale: "Higher-timeframe direction remains constructive.",
          limitation: "Crypto market structure can change quickly."
        },
        {
          contributionId: "btc-structure",
          dimension: "market_structure",
          label: "Market structure",
          evidenceIds: ["btc-structure-evidence"],
          direction: "supporting",
          points: 13,
          rationale: "The expansion remains intact.",
          limitation: "Current location is extended."
        },
        {
          contributionId: "btc-momentum",
          dimension: "momentum",
          label: "Momentum",
          evidenceIds: ["btc-momentum-evidence"],
          direction: "contradicting",
          points: -8,
          rationale: "Momentum is weakening into resistance.",
          limitation: "Momentum is derived from a local snapshot."
        },
        {
          contributionId: "btc-risk",
          dimension: "risk",
          label: "Risk",
          evidenceIds: ["btc-risk-evidence"],
          direction: "supporting",
          points: 4,
          rationale: "Risk is bounded but portfolio exposure is elevated.",
          limitation: "Correlation remains partially unresolved."
        }
      ],
      bullCase: {
        title: "Bull case",
        summary: "Trend and expansion structure remain constructive.",
        evidenceIds: ["btc-trend-evidence", "btc-structure-evidence"],
        limitations: ["Location is extended."]
      },
      bearCase: {
        title: "Bear case",
        summary: "Weakening momentum and elevated exposure reduce confidence.",
        evidenceIds: ["btc-momentum-evidence", "btc-risk-evidence"],
        limitations: ["No live order-flow feed is present."]
      },
      neutralCase: {
        title: "Neutral case",
        summary: "Keep the case on watch until a retracement improves asymmetry.",
        evidenceIds: [],
        limitations: ["No automated action is permitted."]
      },
      timeline: [
        {
          eventId: "btc-context",
          occurredAt: "2026-07-25T07:30:00.000Z",
          type: "evidence_update",
          title: "Context snapshot created",
          summary: "Local evidence package created.",
          evidenceIds: [],
          severity: "info"
        },
        {
          eventId: "btc-momentum-event",
          occurredAt: "2026-07-25T09:40:00.000Z",
          type: "structure_change",
          title: "Momentum downgrade",
          summary: "Momentum weakened into resistance.",
          evidenceIds: ["btc-momentum-evidence"],
          severity: "attention"
        }
      ],
      invalidationSummary: "Reject below the four-hour expansion base.",
      downgradeReasons: ["Correlation concentration remains unresolved."]
    }),
    pipeline: buildPipeline("pipeline-btcusd", "research-case-btcusd", "BTC/USD", "WATCH", [
      "market_context",
      "evidence_assessment",
      "setup_review",
      "intelligence_report"
    ])
  },
  {
    id: "xauusd",
    instrument: "XAU/USD",
    market: "Metals",
    context: {
      session: "New York",
      volatility: "Event risk",
      trend: "Mixed",
      structure: "Range",
      momentum: "Conflicted"
    },
    risk: { amount: "$0", ceiling: "$100", exposure: "0%", rewardRisk: "—" },
    invalidation: "No valid entry exists while the range and event risk remain unresolved.",
    report: buildTradingIntelligenceReport({
      reportId: "intelligence-xauusd-001",
      setupReviewId: "setup-review-xauusd-001",
      instrument: "XAU/USD",
      generatedAt,
      contributions: [
        {
          contributionId: "xau-trend",
          dimension: "trend",
          label: "Trend",
          evidenceIds: ["xau-trend-evidence"],
          direction: "supporting",
          points: 4,
          rationale: "Weekly context remains constructive.",
          limitation: "Lower timeframes disagree."
        },
        {
          contributionId: "xau-structure",
          dimension: "market_structure",
          label: "Market structure",
          evidenceIds: ["xau-structure-evidence"],
          direction: "contradicting",
          points: -12,
          rationale: "Price remains inside an unresolved range.",
          limitation: "No valid trigger is present."
        },
        {
          contributionId: "xau-event",
          dimension: "event_risk",
          label: "Event risk",
          evidenceIds: ["xau-event-evidence"],
          direction: "contradicting",
          points: -16,
          rationale: "High-impact macro risk dominates the setup.",
          limitation: "Event direction cannot be predicted."
        },
        {
          contributionId: "xau-risk",
          dimension: "risk",
          label: "Risk",
          evidenceIds: ["xau-risk-evidence"],
          direction: "contradicting",
          points: -5,
          rationale: "No defensible stop placement is available.",
          limitation: "The setup remains research-only."
        }
      ],
      bullCase: {
        title: "Bull case",
        summary: "Weekly context remains constructive.",
        evidenceIds: ["xau-trend-evidence"],
        limitations: ["Lower timeframes disagree."]
      },
      bearCase: {
        title: "Bear case",
        summary: "Range structure, event risk, and weak stop placement invalidate the setup.",
        evidenceIds: ["xau-structure-evidence", "xau-event-evidence", "xau-risk-evidence"],
        limitations: ["Reassessment requires new context."]
      },
      neutralCase: {
        title: "Neutral case",
        summary: "Record the rejection and wait for a materially different context.",
        evidenceIds: [],
        limitations: ["No execution path exists."]
      },
      timeline: [
        {
          eventId: "xau-created",
          occurredAt: "2026-07-25T08:15:00.000Z",
          type: "evidence_update",
          title: "Candidate created",
          summary: "Initial context package created.",
          evidenceIds: [],
          severity: "info"
        },
        {
          eventId: "xau-blocked",
          occurredAt: "2026-07-25T09:00:00.000Z",
          type: "macro_event",
          title: "Event-risk blocker",
          summary: "Macro-event risk prevents progression.",
          evidenceIds: ["xau-event-evidence"],
          severity: "blocking"
        }
      ],
      invalidationSummary: "No valid entry exists under the current context.",
      downgradeReasons: [
        "High-impact event risk remains unresolved.",
        "No defensible stop placement is available."
      ]
    }),
    pipeline: buildPipeline("pipeline-xauusd", "research-case-xauusd", "XAU/USD", "REJECT", [
      "market_context",
      "evidence_assessment",
      "setup_review",
      "intelligence_report",
      "risk_review",
      "operator_decision"
    ])
  }
];

const ranked = rankTradingIntelligenceReports(cases.map((candidate) => candidate.report));
const rankByReport = new Map(ranked.map((candidate, index) => [candidate.reportId, index + 1]));

const output = {
  schemaVersion: 1,
  generatedAt,
  source: "generated local repository evidence",
  boundary: {
    gate: "G2_PAPER_TRADING",
    scope: "paper_simulation_planning_only",
    externalAccess: false,
    executionPath: false,
    automatedAction: false
  },
  candidates: cases
    .map((candidate) => ({
      ...candidate,
      rank: rankByReport.get(candidate.report.reportId) ?? 999
    }))
    .sort((a, b) => a.rank - b.rank)
};

const target = path.join(process.cwd(), "apps", "intelligence-workspace", "public", "runtime");
await mkdir(target, { recursive: true });
await writeFile(
  path.join(target, "workspace-data.json"),
  `${JSON.stringify(output, null, 2)}\n`,
  "utf8"
);
console.log(`Generated intelligence workspace data for ${output.candidates.length} candidates.`);
