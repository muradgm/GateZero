# Read-Only Intelligence Brief Workflow Plan

## Operator Question

Can the operator inspect one concise, source-linked market scenario brief without mistaking it for a
trading instruction?

## Manual Workflow

1. Select one checked-in research case.
2. Load its validated local replay source inventory.
3. Inspect hourly, daily, and monthly evidence separately.
4. Stop if evidence or semantic quality is blocked.
5. Inspect bullish, bearish, and neutral conditional scenarios together.
6. Inspect adversarial challenges beside the scenario set.
7. Record that risk review remains required.
8. Require an explicit operator decision outside the analyst.
9. Preserve the brief as local read-only evidence.

## Required Brief Sections

- Research case identity.
- Source inventory and freshness.
- Hourly evidence.
- Daily evidence.
- Monthly evidence.
- Cross-timeframe conflicts.
- Evidence and semantic quality disposition.
- Bullish, bearish, and neutral scenarios.
- Supporting and counter-evidence.
- Red flags and invalidation conditions.
- Adversarial review.
- Limitations.
- Risk-review requirement.
- Operator-decision requirement.
- Gate 2 blocked-scope reminder.

## Blocked Workflow

The brief must not:

- fetch or poll external data
- request credentials
- connect a broker or account
- notify, alert, publish, export, share, or print
- rank assets, opportunities, scenarios, or timing
- issue buy, sell, hold, enter, exit, sizing, or allocation instructions
- place simulated or real orders
- auto-approve risk or operator decisions
- claim certainty, edge, profitability, readiness, or promotion

## Failure States

- Missing source: block the brief.
- Untracked or unsafe path: block the brief.
- Stale or unknown freshness: block scenario synthesis.
- Conflicting timeframes: show the conflict and require revision.
- Unsafe language: suppress scenarios and show the semantic finding.
- Failed adversarial review: block operator consideration.

## Automation Boundary

The first brief is generated only from checked-in local fixtures on explicit operator request.
Scheduled automation, background scanning, alerts, notifications, and recurring jobs remain outside
the authorized scope.

## Acceptance

The workflow is ready for a bounded MVP only when one local case can be inspected end to end and
every blocked state remains visible, local, non-actionable, risk-reviewed, and operator-controlled.
