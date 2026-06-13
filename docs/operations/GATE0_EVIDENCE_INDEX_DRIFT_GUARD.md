# Gate 0 Evidence Index Drift Guard

## Purpose

This document records the local evidence-index drift guard.

The guard is local and read-only. It checks evidence-index documentation, source artifact tracking,
command records, validation records, and tracker references. It does not change strategy state, risk
state, maturity state, operator decisions, gate status, product scope, or execution capability.

## Boundary

Current financial gate:

```text
G0_RESEARCH
```

Current operating scope:

```text
research_only
```

Use this guard only to detect local evidence-index drift. Do not use guard success as strategy
approval, readiness review, performance evidence, profitability evidence, deployment approval,
product expansion approval, or future-phase eligibility.

## Guard Command

```powershell
pnpm check:gate0-evidence-index
```

## Guard Coverage

| Coverage area            | Local check                                                               |
| ------------------------ | ------------------------------------------------------------------------- |
| Evidence-index docs      | Required evidence-index docs exist, include source links, and are listed. |
| Source artifacts         | Schema, fixture, tests, guard script, and guard tests are tracked.        |
| Command records          | Package script, command index, validation audit, and tracklist are wired. |
| Packet review references | Packet-backed docs reference matching QA, RISK, and ORCHESTRATOR records. |

## Locality Notes

The guard reads local repository files and exits with bounded findings. It does not access external
services, credentials, brokers, APIs, UI routes, publishing systems, execution paths, or prediction
systems.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Guard source: `scripts/check-gate0-evidence-index-drift.ts`
- Guard tests: `packages/fixtures/tests/gate0-evidence-index-drift-check.test.ts`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-100_GATE0_EVIDENCE_INDEX_DRIFT_GUARD.md`
- Reviews: `ops/runtime/reviews/TRD-100_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-100_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-100_ORCHESTRATOR_ACCEPTANCE.md`
