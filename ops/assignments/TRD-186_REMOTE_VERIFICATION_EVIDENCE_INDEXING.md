# TRD-186: Remote Verification Evidence Indexing

## Objective

Add a small index for Gate 0 remote verification evidence records.

## Scope

Allowed:

- List current CI evidence records and their run ids.
- Link remote verification docs, freshness guard docs, and source packets.

Blocked:

- Report publishing, public release claims, deployment, broker access, live trading, paper
  execution, autonomous execution, AI prediction, strategy claims, or risk-gate loosening.

## Required Output

- `docs/operations/GATE0_REMOTE_VERIFICATION_EVIDENCE_INDEX.md`
- Review records under `ops/runtime/reviews/`.

## Acceptance Criteria

- Index links all current Gate 0 GitHub CI evidence records.
- Index states evidence is repository-quality evidence only.
- Gate 0 verification remains passing.

## Source Links

- Remote verification runbook: `docs/operations/GATE0_REMOTE_VERIFICATION_RUNBOOK.md`
- Current tracker: `ops/runtime/tracklist.md`
