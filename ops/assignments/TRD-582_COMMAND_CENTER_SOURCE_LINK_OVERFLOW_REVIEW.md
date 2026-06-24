# TRD-582 Command Center Source-Link Overflow Review

Status: accepted

## Goal

Review and harden Command Center source-link overflow so the upcoming Strategy Review Workspace can
surface the sources needed for one local research case without forcing the operator through archive
depth.

## Management Rule

This closeout lane exists only to support the Strategy Review Workspace. A packet is acceptable only
when it makes the upcoming workspace safer, clearer, or easier to inspect.

## Scope

- Preserve `G2_PAPER_TRADING` / `paper_simulation_planning_only` scope.
- Add a compact source-overflow review summary to the read-only Command Center docs panel.
- Keep long historical source groups grouped, scroll-bounded, and locally inspectable.
- Preserve visible local paths for source traceability.

## Blocked Scope

- Broker integration, external account access, credentials, live execution, broker paper-trading
  execution, autonomous action, AI buy/sell prediction, approval semantics, readiness semantics,
  performance claims, report output, export controls, sharing controls, print controls, and
  risk-gate loosening.

## Required Outputs

- Command Center source-overflow review summary.
- Fixture coverage proving source overflow remains local, compact, and workspace-focused.
- Updated tracker, QA_SECURITY review, RISK review, and ORCHESTRATOR acceptance.

## Acceptance

Accepted when focused tests and full Gate 0 verification pass, source links remain grouped by
operator purpose, workspace-critical source guidance is visible, and no action or output channel is
introduced.
