# TRD-183: GitHub Actions Annotation Follow-Up Watch

## Objective

Record the current GitHub Actions annotation state and establish a bounded watch item for future
action-version cleanup.

## Scope

Allowed:

- Record current upstream action tags observed for `actions/checkout` and `actions/setup-node`.
- Document that the workflow currently forces JavaScript actions to Node.js 24.
- Recommend a future dedicated upgrade packet if action versions remove the annotation.

Blocked:

- Major action upgrade in this packet, deployment, broker access, credential handling, live trading,
  paper execution, autonomous execution, AI prediction, strategy claims, or risk-gate loosening.

## Required Output

- `docs/operations/GATE0_GITHUB_ACTIONS_ANNOTATION_FOLLOW_UP_WATCH.md`
- Review records under `ops/runtime/reviews/`.

## Acceptance Criteria

- Watch record states the current annotation is not a Gate 0 blocker.
- Watch record avoids automatic major-version upgrades.
- Gate 0 verification remains passing.

## Source Links

- Runtime hardening record: `docs/operations/GATE0_GITHUB_CI_WORKFLOW_RUNTIME_HARDENING.md`
- Current tracker: `ops/runtime/tracklist.md`
