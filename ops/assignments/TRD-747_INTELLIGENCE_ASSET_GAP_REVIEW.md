# TRD-747 Intelligence Asset Gap Review

Status: accepted

## Goal

Inventory the accepted market-intelligence foundation and identify only the missing capabilities
needed for a bounded Senior Market Intelligence and Scenario Analyst lane.

## Required Agents

- ORCHESTRATOR
- MARKET_DATA
- RISK
- QA_SECURITY

## Allowed Scope

- Read existing truth, governance, contracts, fixtures, guards, skills, and workspace code.
- Record reusable assets and concrete gaps.
- Define sequencing and entry criteria for TRD-748 through TRD-756.

## Blocked Scope

- Runtime contract or UI implementation.
- Network access, providers, scraping, polling, credentials, or external storage.
- Trading instructions, final recommendations, autonomous ranking, or execution routes.
- Performance, profitability, readiness, approval, or promotion claims.
- Risk-gate or autonomy expansion.

## Required Output

- `docs/operations/MARKET_INTELLIGENCE_FOUNDATION_GAP_REVIEW.md`
- RISK review.
- QA_SECURITY review.
- ORCHESTRATOR acceptance.
- Tracklist and progress-state update.

## Acceptance Criteria

- Existing TRD-593 through TRD-616 assets are reused rather than duplicated.
- Missing capabilities are stated as bounded product or validation gaps.
- TRD-749 remains local replay only and requires canonical, tracked, repository-relative sources.
- TRD-748 requires negative evals for unsafe or contradictory analyst language.
- TRD-751 fails closed on unsafe semantic content as well as weak evidence.
- TRD-752 remains conditional scenario analysis without trade instructions or certainty language.
- TRD-754 measures calibration and evidence handling without performance claims.
- TRD-748 is the only next authorized implementation packet.
- Financial and autonomy gates remain unchanged.
- Focused tests preserve the gap-review boundaries and packet sequence.

## Validation

```powershell
pnpm verify:gate0
```

## Done When

The gap review is accepted and the next packet is the dedicated analyst role and authority skill.

## Next Agent

ORCHESTRATOR issues TRD-748 to create the governed Senior Market Intelligence and Scenario Analyst
skill with MARKET_DATA, RISK, and QA_SECURITY review.
