# TRD-584 Market Intelligence Roadmap Alignment

Status: accepted

## Goal

Align the queued roadmap after `TRD-592` so market-intelligence work proceeds through evidence,
contracts, red flags, scenario drafts, and risk review before any operator-facing intelligence
workspace.

## Scope

- Preserve `G2_PAPER_TRADING` / `paper_simulation_planning_only` scope.
- Keep `TRD-592` as the Strategy Review Workspace MVP turning point.
- Queue market-intelligence work after `TRD-592`.
- Record the sequence from `TRD-593` through `TRD-600`.
- Preserve the rule that no market-intelligence recommendation appears without evidence, source
  references, confidence, red flags, invalidation, risk review, and operator decision requirement.

## Blocked Scope

- Broker integration, external account access, credentials, live execution, broker paper-trading
  execution, autonomous action, AI buy/sell prediction, unreviewed trade recommendations, prediction
  certainty, profit claims, approval semantics, readiness semantics, report output, export controls,
  sharing controls, print controls, and risk-gate loosening.

## Required Outputs

- Updated tracker queue.
- Post-`TRD-592` market-intelligence roadmap.
- Command Center roadmap record.
- Guard coverage proving market intelligence remains sequenced after the Strategy Review Workspace
  and does not become a trade-command lane.
- QA_SECURITY, RISK, and ORCHESTRATOR review records.

## Acceptance

Accepted when focused tests and full Gate 0 verification pass, `TRD-592` remains the workspace MVP
turning point, `TRD-593` through `TRD-600` are queued as market-intelligence planning/contract
packets, and no execution, prediction, or unreviewed recommendation authority is introduced.
