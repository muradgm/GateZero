# Canonical Runtime Status Contract

## Purpose

Define the single status shape that should drive TraderFrame's README summaries, release status,
Command Center runtime metadata, and validation checks.

This is part of Milestone 1 — Source-of-Truth Consolidation.

## Contract intent

The runtime status contract prevents duplicated volatile values across documentation and frontend
source.

The status record is not trading evidence and does not imply market readiness, profitability,
execution readiness, or permission to trade.

## Proposed shape

```ts
export type OperatorOutcome = "REJECT" | "WATCH" | "PAPER_SIMULATE";

export interface RuntimeStatus {
  readonly product: "TraderFrame";
  readonly controlPlane: "GateZero";
  readonly operatingGate: "G2_PAPER_TRADING";
  readonly operatingScope: "paper_simulation_planning_only";
  readonly productMode: "local_research_and_read_only_decision_support";
  readonly executionAuthority: "none";
  readonly currentInitiative: "Trading Intelligence Command Center";
  readonly currentMilestone: "Evidence-Gated Setup Review MVP";
  readonly allowedOperatorOutcomes: readonly OperatorOutcome[];
  readonly latestAcceptedEvidenceId?: string;
  readonly validation?: ValidationStatus;
  readonly ci?: CiStatus;
  readonly boundaries: RuntimeBoundary;
  readonly generatedAt: string;
}

export interface ValidationStatus {
  readonly testFileCount: number;
  readonly testCount: number;
  readonly status: "passing" | "failing" | "unknown";
  readonly command: string;
}

export interface CiStatus {
  readonly lastVerifiedCommit?: string;
  readonly latestRunId?: string;
  readonly state: "success" | "failure" | "pending" | "unknown";
}

export interface RuntimeBoundary {
  readonly blocked: readonly string[];
  readonly allowed: readonly string[];
}
```

## Required boundary values

Blocked values must include:

- broker or exchange integration;
- external account access;
- credential handling;
- live order routing;
- external paper order routing;
- autonomous execution;
- unreviewed AI directional decisions;
- performance, approval, or readiness claims;
- report, share, print, or publishing channels.

Allowed values must stay limited to:

- local deterministic research evidence;
- local paper-simulation evidence;
- read-only decision support;
- manual operator review;
- evidence-linked `REJECT`, `WATCH`, or `PAPER_SIMULATE` outcomes.

## Generation rule

The runtime status should be generated from authoritative repository sources, not hand-edited in
multiple places.

Recommended generated artifact:

```text
apps/web/src/generated/runtime-status.json
```

Recommended source module or fixture:

```text
packages/contracts/src/runtime-status.ts
packages/fixtures/src/runtime-status/current-runtime-status.ts
```

## Validation rule

Validation should fail when:

- README, release status, generated runtime status, or Command Center disagree on gate or scope;
- allowed outcomes include anything outside `REJECT`, `WATCH`, or `PAPER_SIMULATE`;
- blocked boundary language disappears;
- generated artifacts are stale;
- a check command rewrites files that it claims only to validate.

## Non-goals

- No market-data provider model.
- No trading signal model.
- No broker model.
- No execution authority.
- No UI redesign.
- No branch deletion.

## Next implementation step

Add the TypeScript contract and fixture, then point the Command Center runtime metadata builder to the
fixture instead of duplicated literals.
