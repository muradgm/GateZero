# Market Intelligence Foundation Gap Review

## Decision

TraderFrame already has the truth, Gate 2 safety boundary, local market-intelligence contracts,
deterministic fixtures, consistency guard, and read-only inspection workspace needed to begin a
bounded analyst foundation.

The next lane must extend these assets. It must not replace them or introduce network access,
scheduled polling, trading instructions, broker connectivity, credentials, or execution authority.

## Current Gate

- Financial gate: `G2_PAPER_TRADING`
- Operating scope: `paper_simulation_planning_only`
- Autonomy: advisory analysis and bounded named-file implementation only
- Operator authority: required for every decision

The governing rule remains:

> No trade without evidence. No execution without risk approval.

## Reusable Assets

### Truth And Governance

- `ops/truth/PROJECT_TRUTH.md`
- `ops/truth/PRODUCT_WEDGE.md`
- `ops/truth/MARKET_INTELLIGENCE_TRUTH.md`
- `ops/truth/RISK_RULES.md`
- `ops/governance/FINANCIAL_RISK_GATES.md`
- `ops/governance/AUTONOMY_GATES.md`

These already authorize source-linked, uncertainty-aware scenario analysis while blocking prediction
certainty, unreviewed recommendations, autonomous action, and hidden promotion to trade execution.

### Contracts And Fixtures

The Gate 2 paper-simulation contract lane already defines:

- market-intelligence inputs
- news and event records
- evidence-only signal candidates
- red-flag blocker evidence
- non-final scenario recommendation drafts
- risk-gated recommendation review
- local paper-simulation candidate linkage

The checked-in fixtures exercise one synthetic local scenario with explicit evidence, confidence,
red flags, invalidation conditions, limitations, risk review, and operator review.

### Validation And Product Surface

- `scripts/check-market-intelligence-workspace.ts` checks local reference consistency.
- Contract and fixture tests reject action routes, final-recommendation flags, certainty flags, and
  missing review requirements.
- The current contracts do not inspect arbitrary free text for contradictory action, certainty,
  ranking, or profitability language. That remains a confirmed safety gap.
- The Command Center renders the scenario, sources, controls, limitations, and risk state as
  read-only evidence.
- Existing workspace QA covers empty states, source grouping, mobile layout, keyboard behavior, and
  blocked-scope copy.

### Existing Agent Capabilities

- `MARKET_DATA` owns source quality, lineage, timestamps, gaps, duplicates, and stale-data
  protection.
- `RISK` owns the veto, red flags, review requirements, and financial boundary.
- `QA_SECURITY` owns validation, negative cases, secret exclusion, and fail-closed behavior.
- `ORCHESTRATOR` owns sequencing, assignment boundaries, and acceptance.
- `trading-forex-domain-expert` supplies market-mechanics and time-series correctness review.

## Confirmed Gaps

### 1. Analyst Role And Authority

There is no dedicated Senior Market Intelligence and Scenario Analyst skill. The role needs an
explicit read-only mandate, required evidence fields, uncertainty language, prohibited outputs,
handoff rules, and evaluated examples before it can shape product records.

Its negative evals must include direct and disguised trade instructions, certainty claims,
profitability claims, autonomous ranking, and text that contradicts otherwise-safe boolean flags.

### 2. Source Adapter Boundary

The current source fields point to checked-in local records, but there is no normalized local replay
source envelope. The future boundary needs source identity, source class, observed and published
times, as-of time, ingestion time, freshness, provenance, limitations, and deterministic payload
identity.

TRD-749 may define local replay contracts and fixtures only. It may not fetch from a network, select
a vendor, handle credentials, or run a polling worker.

Current path enforcement is not sufficient authority for future source ingestion. Some
market-intelligence fields accept URLs, and existing prefix checks do not canonicalize paths, reject
traversal, verify file existence, or verify that a file is tracked. TRD-749 must reject URLs,
absolute paths, traversal, encoded traversal, and disallowed roots, then confirm that each
repository-relative source exists and is tracked.

### 3. Multi-Timeframe Evidence

The current contracts do not explicitly separate hourly, daily, and monthly evidence. A future
assembly must preserve each timeframe independently, record coverage and as-of time, and surface
conflicts instead of flattening them into one directional conclusion.

### 4. Evidence Quality Disposition

Freshness exists elsewhere in the Gate 2 evidence model, but market-intelligence records do not yet
have one fail-closed quality disposition for stale, missing, conflicting, or weak-provenance input.
Those states must block scenario consideration rather than merely lower a confidence label.

The quality gate must also classify unsafe free text before rendering. A safe boolean flag must not
override contradictory instruction, certainty, ranking, or profitability language.

### 5. Conditional Scenario Set

The current fixture demonstrates one non-final scenario draft. The next synthesis layer must model
bullish, bearish, and neutral conditional scenarios together, each with supporting evidence,
counter-evidence, invalidation conditions, limitations, and review requirements.

It must not select a trade, emit a buy or sell instruction, calculate position size, or claim a most
likely profitable outcome.

Scenario text must be validated or classified as blocked; authority booleans alone are not an
adequate semantic safety control.

### 6. Adversarial Review

No dedicated record currently challenges source conflicts, regime assumptions, missing
counter-evidence, timeframe disagreement, or invalidation quality before operator consideration.

### 7. Historical Replay Calibration

There is no benchmark that replays frozen historical evidence as it was known at the time and
measures scenario calibration. The benchmark must evaluate evidence handling and uncertainty
quality, not strategy returns, profitability, or trading readiness.

### 8. Manual Brief Workflow

There is no bounded operator queue for inspecting a sourced scenario brief. This remains a later
planning item. Scheduled automation, notifications, alerts, publishing, exports, and external
delivery remain blocked.

## Cut Or Defer

Do not add:

- a second market-intelligence truth model
- replacement contracts for the accepted TRD-593 through TRD-600 lane
- network providers or web scraping
- provider credentials or secret storage
- scheduled scanning or background polling
- trade direction instructions
- position sizing or order preparation
- autonomous ranking or promotion
- performance, hit-rate, edge, or profitability claims
- report, export, share, print, alert, or publishing channels

## Required Sequence

1. `TRD-748`: Create and govern the analyst role and authority skill.
2. `TRD-749`: Define and harden the canonical local replay source boundary.
3. `TRD-750`: Assemble separate hourly, daily, and monthly evidence.
4. `TRD-751`: Add fail-closed evidence and semantic quality disposition.
5. `TRD-752`: Produce a conditional three-scenario set.
6. `TRD-753`: Add adversarial risk review.
7. `TRD-754`: Benchmark historical replay calibration without performance claims.
8. `TRD-755`: Plan a manual read-only brief queue.
9. `TRD-756`: Decide whether the foundation supports a useful operator brief.

## TRD-748 Entry Criteria

TRD-748 may proceed only if it:

- creates one dedicated governed skill
- preserves Gate 2 paper-simulation planning scope
- requires source references, confidence, red flags, invalidation, limitations, risk review, and
  operator decision
- forbids buy or sell instructions, certainty, final recommendations, execution routes, and
  profitability claims
- includes positive and negative eval cases for direct and disguised instruction, certainty,
  profitability, ranking, and authority-conflict language
- routes market-data, risk, QA_SECURITY, and orchestrator review explicitly
- does not modify market-intelligence runtime contracts or UI

## Done Definition

This gap review is complete when the reusable assets, eight missing capabilities, blocked scope,
required sequence, and TRD-748 entry criteria are recorded and accepted without changing product
authority.
