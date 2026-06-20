# Gate 1 Command Naming Migration Plan

TraderFrame still exposes legacy `gate0` command names for compatibility, while the operating gate
is `G1_BACKTESTING` and the scope is `historical_backtesting_only`.

## Migration Position

- Treat `gate0` command names as stable local command identifiers, not as the current operating
  phase.
- Keep command output explicit about Gate 1 historical backtesting when relevant.
- Do not rename commands in-place until a compatibility packet can preserve existing scripts, CI,
  docs, and operator muscle memory.
- Prefer future aliases over destructive renames.

## Blockers

- No broker, paper, live, or autonomous command naming may be introduced.
- No command may imply strategy readiness, approval, or performance quality.

## Source Links

- Source packet: `ops/assignments/TRD-323_GATE_COMMAND_NAMING_MIGRATION_PLAN.md`
- Reviews: `ops/runtime/reviews/TRD-323_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-323_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-323_ORCHESTRATOR_ACCEPTANCE.md`
