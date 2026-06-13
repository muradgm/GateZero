# Gate 0 Operator Review Runbook

## Purpose

This runbook defines the local operator routine for reviewing the Gate 0 dry-run inspect path.

It is an operating discipline, not a product feature. It does not change strategy state, risk
limits, operator decisions, maturity status, or gate status.

## Boundary

Current gate:

```text
G0_RESEARCH
```

Current scope:

```text
research_only
```

Use this runbook only for local, deterministic, synthetic, redacted Gate 0 review.

## When To Run

Run this routine when:

- A Gate 0 dry-run inspect command changes.
- A dry-run fixture changes.
- Checklist, friction, or iteration recommendation behavior changes.
- The tracklist is updated after an accepted ergonomics packet.
- QA_SECURITY or RISK requests a local operator review check.

Do not use this routine as strategy approval, readiness review, execution review, deployment
approval, or product launch review.

## Review Routine

### 1. Confirm Boundary

Read the current tracklist:

```powershell
Get-Content ops/runtime/tracklist.md
```

Confirm:

- Latest accepted packet is current.
- Operating gate is `G0_RESEARCH`.
- Operating scope is `research_only`.
- No rejected-for-now scope has been moved into active work.

### 2. Inspect Help

Run:

```powershell
pnpm inspect:gate0-dry-run -- --help
pnpm inspect:gate0-dry-run -- -h
```

Confirm:

- Help exits successfully.
- Help lists only static local scenario keys.
- Help confirms `G0_RESEARCH`.
- Help confirms `research_only`.
- Help does not print inspect JSON payloads.

### 3. Inspect Clear Scenario

Run:

```powershell
pnpm inspect:gate0-dry-run
```

Confirm:

- Output is redacted JSON.
- `financial_gate` is `G0_RESEARCH`.
- `scope` is `research_only`.
- `inspect_status` is `clear`.
- Output includes checklist summary, friction report, and iteration recommendation.
- Output does not include raw bundle, trace, metric, evidence, approval, readiness, profitability,
  or performance content.

### 4. Inspect Friction Scenario

Run:

```powershell
pnpm inspect:gate0-dry-run -- --scenario friction
```

Confirm:

- Output is redacted JSON.
- `financial_gate` is `G0_RESEARCH`.
- `scope` is `research_only`.
- `inspect_status` is `friction_found`.
- The blocked item is local review friction only.
- The action label is a local review action only.

### 5. Inspect Invalid Scenario Handling

Run:

```powershell
pnpm inspect:gate0-dry-run -- --scenario other
```

Confirm:

- Command exits nonzero.
- Output is bounded usage text.
- No stack trace is printed.
- No inspect JSON payload is printed.

### 6. Run Full Validation

Run:

```powershell
pnpm lint
pnpm format:check
pnpm typecheck
pnpm test
pnpm validate:gate0
```

Confirm all commands pass before an ORCHESTRATOR acceptance note is finalized.

## Local Decision Rules

Use `clear` to mean the accepted synthetic dry-run fixture passed the local inspect path.

Use `friction_found` to mean the local fixture exposed bounded review friction.

Do not treat either status as:

- Strategy approval.
- Strategy rejection.
- Trading readiness.
- Product readiness.
- Future-phase eligibility.
- Performance evidence.
- Profitability evidence.

## Escalation Rules

Escalate to QA_SECURITY when:

- Output includes raw payloads.
- Invalid input prints stack traces.
- Help text includes unsupported scope.
- A command path introduces external access or report publishing.

Escalate to RISK when:

- Any text implies approval, readiness, profitability, or performance.
- Any change weakens `G0_RESEARCH` or `research_only`.
- Any output suggests risk limits, autonomy, execution, or future-phase movement changed.

Escalate to ORCHESTRATOR when:

- QA_SECURITY and RISK reviews pass.
- Validation commands pass.
- Tracklist updates are ready.
- Acceptance can be recorded.

## Done When

The operator review routine is complete when:

- Help, clear, friction, and invalid scenario paths behave as expected.
- Full validation passes.
- QA_SECURITY review is recorded.
- RISK review is recorded.
- ORCHESTRATOR acceptance is recorded.
- Tracklist reflects the accepted packet and validation count.

## Source Links

- Truth: `ops/truth/PROJECT_TRUTH.md`, `ops/truth/PRODUCT_WEDGE.md`, `ops/truth/RISK_RULES.md`
- Governance: `ops/governance/FINANCIAL_RISK_GATES.md`, `ops/governance/AUTONOMY_GATES.md`
- Current tracker: `ops/runtime/tracklist.md`
- Source packet: `ops/assignments/TRD-052_GATE0_OPERATOR_REVIEW_RUNBOOK.md`
- Reviews: `ops/runtime/reviews/TRD-052_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-052_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-052_ORCHESTRATOR_ACCEPTANCE.md`
