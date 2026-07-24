# Read-Only Intelligence Brief MVP

## Operator Question

Can the operator inspect one concise, source-linked market scenario brief without mistaking it for a
trading instruction?

TRD-758 answers that question with one deterministic local fixture rendered inside the Strategy
Review Workspace.

## Evidence Chain

The brief binds:

1. Three checked-in local source envelopes.
2. Separate hourly, daily, and monthly evidence.
3. A clear evidence and semantic-quality assessment.
4. Bullish, bearish, and neutral conditional scenarios shown together.
5. A clear adversarial review.
6. Explicit limitations, blocked scope, risk-review requirement, and operator-decision requirement.
7. A SHA-256 content hash over the assembled brief.

The assembler rejects missing sources, stale or unverified provenance, unsafe quality findings,
blocked scenario synthesis, unresolved adversarial review, and mismatched evidence-chain references.

## Product Boundary

The browser view is a local inspection surface. It has no action buttons, provider calls, polling,
alerts, account routes, credential fields, order controls, export controls, ranking, selected
scenario, timing instruction, final recommendation, performance claim, or approval state.

Confidence describes the limitation of the evidence record. It is not probability, attractiveness,
or permission.

## Current Limitation

The MVP renders the accepted evidence path. Rejected inputs fail closed in contracts and tests but
do not yet have a dedicated operator-visible blocked-state presentation. That is the bounded purpose
of TRD-759.

## Validation

```text
pnpm check:intelligence-brief
pnpm check:market-workspace
pnpm verify:gate0
```
