# Local Case Operator Workflow Dry Run

## Scope

TRD-727 through TRD-735 exercised one checked-in operational evidence case. The case exists to test
TraderFrame's authoring and revision workflow. It is not a trading strategy, market recommendation,
approval, or execution record.

## Commands Exercised

```powershell
pnpm scaffold:local-case -- --case-id operator-workflow-case-001 --title "Operator workflow evidence case"
pnpm revise:local-case -- --case-id operator-workflow-case-001 --reason "Replace template placeholders with checked-in workflow evidence and explicit limitations." --evidence-ref docs/operations/LOCAL_CASE_AUTHORING_USABILITY_REVIEW.md --evidence-ref docs/operations/LOCAL_CASE_REVISION_CHECKPOINT.md --provenance-ref ops/runtime/tracklist.md --limitation-note "Operational workflow evidence only; this case is not a strategy, market recommendation, approval, or execution route."
pnpm inspect:local-cases -- --revisions operator-workflow-case-001
```

## Observed Evidence

| Workflow step | Result                                                                             |
| ------------- | ---------------------------------------------------------------------------------- |
| Scaffold      | Created one unverified, blocked local original.                                    |
| Revise        | Created revision `operator-workflow-case-001-r1` without changing the original.    |
| Audit         | Preserved revision reason, changed fields, parent identity, and content hashes.    |
| Catalog       | Projected the latest revision as unverified, blocked, and pending operator review. |
| Workspace     | Displayed revision state beside checked-in sources and limitations.                |

## Friction Found

1. List inspection omitted revision identity and pending-review state.
2. The workspace label said only `review required`, which was ambiguous beside a blocked case.
3. Full revision lineage was available on disk but had no bounded inspection command.

## Corrections

- List inspection now includes revision identity, number, and pending-review state.
- `--revisions <case-id>` returns read-only lineage summaries.
- Workspace copy now says `blocked pending review`.

No editor UI was justified by this dry run.
