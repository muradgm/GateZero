# TRD-583 Market Intelligence Truth Alignment

Status: accepted

## Goal

Surgically extend TraderFrame truth files to include future market intelligence, news/event
scanning, red-flag detection, signal candidate analysis, and evidence-based scenario analysis
without changing the core wedge or increasing trading autonomy.

## Scope

- Preserve `G2_PAPER_TRADING` / `paper_simulation_planning_only` scope.
- Keep the wedge: "No trade without evidence. No execution without risk approval."
- Add a secondary product promise: "Read the market. Frame the risk. Decide with evidence."
- Add `ops/truth/MARKET_INTELLIGENCE_TRUTH.md`.
- Clarify the distinction between allowed future AI-assisted intelligence and blocked AI-generated
  trade decisions.
- Add guard coverage for truth language.

## Blocked Scope

- Broker integration, external account access, credentials, live execution, broker paper-trading
  execution, autonomous action, AI buy/sell prediction, unreviewed trade recommendations, prediction
  certainty, profit claims, approval semantics, readiness semantics, report output, export controls,
  sharing controls, print controls, and risk-gate loosening.

## Required Outputs

- Updated `ops/truth/PROJECT_TRUTH.md`.
- Updated `ops/truth/PRODUCT_WEDGE.md`.
- Updated `ops/truth/RISK_RULES.md`.
- New `ops/truth/MARKET_INTELLIGENCE_TRUTH.md`.
- Guard coverage proving market intelligence remains evidence-based, source-linked, risk-gated, and
  operator-reviewed.
- Updated tracker, QA_SECURITY review, RISK review, and ORCHESTRATOR acceptance.

## Acceptance

Accepted when focused tests and full Gate 0 verification pass, the wedge remains unchanged, future
market intelligence is framed as scenario analysis only, and no truth file authorizes execution,
prediction certainty, profit claims, or unreviewed trade recommendations.
