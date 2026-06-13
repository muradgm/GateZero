# Gate 0 Source Links Coverage Check

## Purpose

This check verifies that current Gate 0 operator-facing operations documents keep explicit source
links to local truth, governance, tracker, assignment, and review records.

It is a documentation check only. It does not change command behavior, strategy state, risk state,
maturity state, operator decisions, gate status, product scope, or execution capability.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Use this check only to verify local source-link coverage. Do not use source-link coverage as
strategy approval, readiness review, performance evidence, profitability evidence, deployment
approval, or future-phase eligibility.

## Coverage Result

| Coverage area               | Expected condition                                                | Status |
| --------------------------- | ----------------------------------------------------------------- | ------ |
| Truth references            | Operator-facing operations docs link to truth files.              | Pass   |
| Governance references       | Operator-facing operations docs link to financial/autonomy gates. | Pass   |
| Tracker references          | Operator-facing operations docs link to the current tracklist.    | Pass   |
| Assignment and review links | Packet-backed docs identify source assignment and reviews.        | Pass   |
| Local-only references       | Source links remain local repo-relative references.               | Pass   |

## Findings

No blocking source-link coverage drift was found.

## Maintenance Rule

Update this check when source-link sections or operator-facing operations documents change. Do not
use this check to authorize execution, strategy promotion, product launch, risk-gate movement, or
later-phase operation.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Cross-link audit: `docs/operations/GATE0_DOCUMENTATION_CROSS_LINK_AUDIT.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-075_GATE0_SOURCE_LINKS_COVERAGE_CHECK.md`
- Reviews: `ops/runtime/reviews/TRD-075_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-075_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-075_ORCHESTRATOR_ACCEPTANCE.md`
