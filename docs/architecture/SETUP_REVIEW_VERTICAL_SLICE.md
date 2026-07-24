# Evidence-Gated Setup Review Vertical Slice

## Purpose

Define the first product-complete TraderFrame workflow that proves the wedge:

```text
No trade without evidence. No execution without risk approval.
```

This architecture remains local, deterministic, operator-owned, and restricted to paper-simulation
evidence.

## Product question

For one market candidate, can the operator determine whether there is enough relevant evidence and an
acceptable risk plan to reject it, watch it, or move it into local paper simulation?

## Bounded outcomes

```ts
export type SetupReviewDecision = "REJECT" | "WATCH" | "PAPER_SIMULATE";
```

`PAPER_SIMULATE` is not approval to trade. It authorizes only a local deterministic simulation record.

## Aggregate

```ts
export interface SetupReview {
  readonly setupReviewId: string;
  readonly researchCaseId: string;
  readonly instrument: string;
  readonly asOf: string;
  readonly marketContext: MarketContext;
  readonly thesis: TradeThesis;
  readonly supportingEvidence: readonly EvidenceReference[];
  readonly contradictingEvidence: readonly EvidenceReference[];
  readonly strategyEvidence: StrategyEvidenceSummary;
  readonly invalidation: InvalidationPlan;
  readonly riskPlan: RiskPlan;
  readonly portfolioImpact: PortfolioImpact;
  readonly evidenceQuality: EvidenceQualityAssessment;
  readonly decision: SetupReviewDecision;
  readonly decisionReasons: readonly string[];
  readonly limitations: readonly string[];
  readonly operatorReview: OperatorReview;
  readonly boundary: SetupReviewBoundary;
}
```

## Domain sections

### Market context

```ts
export interface MarketContext {
  readonly session: string;
  readonly regime: "TREND" | "RANGE" | "TRANSITION" | "UNKNOWN";
  readonly volatilityState: "LOW" | "NORMAL" | "HIGH" | "UNKNOWN";
  readonly higherTimeframeBias: "BULLISH" | "BEARISH" | "NEUTRAL" | "MIXED";
  readonly timeframeSnapshots: readonly TimeframeSnapshot[];
  readonly relevantEvents: readonly EvidenceReference[];
  readonly correlations: readonly CorrelationObservation[];
  readonly freshness: EvidenceFreshness;
}
```

The first implementation may use checked-in local fixtures. It must preserve source timestamps,
limitations, and freshness status.

### Thesis

```ts
export interface TradeThesis {
  readonly direction: "LONG" | "SHORT" | "NEUTRAL";
  readonly strategyFamily: string;
  readonly setupType: string;
  readonly rationale: readonly string[];
  readonly proposedEntryZone?: PriceRange;
  readonly proposedTargetZone?: PriceRange;
  readonly expectedHoldingPeriod?: string;
}
```

A neutral thesis is allowed for research. It cannot result in `PAPER_SIMULATE`.

### Evidence

Evidence must be separated into supporting and contradicting lists. The UI must not collapse
contradicting evidence into an optional disclosure.

Each evidence reference must include:

- stable identifier;
- evidence type;
- source reference;
- observed timestamp;
- freshness state;
- relevance statement;
- limitation statement;
- integrity or content hash where applicable.

### Strategy evidence

```ts
export interface StrategyEvidenceSummary {
  readonly strategyVersionId: string;
  readonly backtestRunIds: readonly string[];
  readonly sampleSize: number;
  readonly tradeCount: number;
  readonly netReturnAfterDeclaredCostsPct?: number;
  readonly maximumDrawdownPct?: number;
  readonly regimeCoverage: readonly string[];
  readonly outOfSampleStatus: "NOT_RUN" | "PARTIAL" | "PASSED" | "FAILED";
  readonly sensitivityStatus: "NOT_RUN" | "STABLE" | "FRAGILE" | "INCONCLUSIVE";
  readonly reproducibilityStatus: "REPRODUCED" | "MISMATCH" | "NOT_CHECKED";
  readonly limitations: readonly string[];
}
```

Metrics alone must never imply a decision. Sample sufficiency, regime relevance, sensitivity,
out-of-sample posture, and limitations remain adjacent.

### Invalidation

```ts
export interface InvalidationPlan {
  readonly condition: string;
  readonly priceLevel?: number;
  readonly timeCondition?: string;
  readonly evidenceCondition?: string;
  readonly observable: boolean;
}
```

Invalidation is mandatory for `PAPER_SIMULATE`.

### Risk plan

```ts
export interface RiskPlan {
  readonly accountReferenceId: string;
  readonly maximumRiskPct: number;
  readonly proposedRiskPct: number;
  readonly estimatedEntryCost: number;
  readonly estimatedExitCost: number;
  readonly estimatedSlippageCost: number;
  readonly maximumLossAmount: number;
  readonly rewardToRiskEstimate?: number;
  readonly riskReviewRequired: true;
}
```

Capital usage must use simulated fill prices and declared costs rather than reference prices alone.

### Portfolio impact

```ts
export interface PortfolioImpact {
  readonly currentGrossExposurePct: number;
  readonly projectedGrossExposurePct: number;
  readonly correlatedExposurePct?: number;
  readonly concentrationFlags: readonly string[];
  readonly exposureAllowed: boolean;
}
```

### Evidence quality

Do not begin with a generic AI confidence score. Use an explainable assessment:

```ts
export interface EvidenceQualityAssessment {
  readonly completeness: "INSUFFICIENT" | "PARTIAL" | "SUFFICIENT";
  readonly freshness: "STALE" | "MIXED" | "CURRENT";
  readonly consistency: "CONTRADICTORY" | "MIXED" | "CONSISTENT";
  readonly robustness: "UNKNOWN" | "FRAGILE" | "MODERATE" | "STRONG";
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
}
```

A later calibrated probability may be added only when outcomes provide enough evidence to measure
calibration.

## Decision rules

### `PAPER_SIMULATE`

Requires all of the following:

- non-neutral thesis;
- current market context;
- at least one supporting evidence reference;
- contradicting evidence explicitly reviewed;
- reproduced strategy evidence;
- observable invalidation;
- accepted risk review;
- allowed projected exposure;
- no critical evidence-quality blockers;
- manual operator confirmation.

### `WATCH`

Use when the candidate is plausible but one or more non-critical requirements are missing, stale, or
inconclusive.

Examples:

- event risk is unresolved;
- context is mixed;
- entry condition has not occurred;
- evidence is incomplete but not invalid;
- risk or exposure requires reduction.

### `REJECT`

Use when:

- thesis is contradicted by a critical blocker;
- evidence integrity fails;
- reproducibility fails;
- invalidation cannot be expressed;
- risk exceeds policy;
- projected exposure is not allowed;
- the case attempts to exceed the operating boundary.

## Application services

```text
createResearchCase
buildMarketContext
assembleSetupReview
runStrategyEvidence
assessEvidenceQuality
calculateRiskPlan
calculatePortfolioImpact
requestRiskReview
recordOperatorDecision
createPaperSimulationCandidate
recordOutcome
createLearningEvent
```

These services should live in a new `packages/application` package and call domain packages through
workspace exports rather than relative cross-package source imports.

## State machine

```text
DRAFT
  -> EVIDENCE_INCOMPLETE
  -> READY_FOR_RISK_REVIEW
  -> RISK_REJECTED | READY_FOR_OPERATOR
  -> REJECTED | WATCHING | PAPER_SIMULATION_CANDIDATE
  -> PAPER_SIMULATED
  -> OUTCOME_RECORDED
  -> LEARNING_RECORDED
```

Transitions must be explicit, schema-validated, and immutable once accepted.

## Frontend workflow

The MVP screen should contain:

1. Candidate and session context.
2. Multi-timeframe snapshots.
3. Thesis and trigger.
4. Supporting evidence.
5. Contradicting evidence.
6. Strategy evidence and limitations.
7. Invalidation.
8. Risk and portfolio impact.
9. Decision reasons.
10. Outcome and learning history.

Repository health, CI, review coverage, and artifact indexes belong under a secondary System Health
section.

## Security and rendering

Before user-authored, imported, provider, or news content enters the frontend:

- avoid unescaped `innerHTML` interpolation;
- render untrusted text through escaped DOM APIs or a framework that escapes by default;
- validate all runtime payloads against contracts;
- preserve source and limitation adjacency;
- prohibit credential, account, and execution controls.

## Initial technical corrections

The vertical slice depends on these focused fixes:

1. Add explicit tests proving moving-average windows and next-candle execution timing.
2. Base no-leverage and exposure checks on simulated fill notional and declared costs.
3. Expose mark-to-market and conservative liquidation equity separately.
4. Separate artifact generation commands from verification commands.
5. Replace manually duplicated runtime status values with one generated contract.
6. Introduce workspace package exports and remove direct `../../package/src` imports.

## MVP exit criteria

The slice is complete when:

- one checked-in market candidate can pass through the entire workflow;
- every conclusion links to evidence;
- contradicting evidence is visible;
- invalidation and risk are mandatory before paper simulation;
- decisions are manual and immutable;
- the same evidence bundle reproduces the same deterministic result;
- outcome recording cannot alter the original thesis;
- a learning event identifies what was correct, incorrect, missing, or poorly risked;
- no broker, external account, live execution, autonomous execution, or performance claim exists.
