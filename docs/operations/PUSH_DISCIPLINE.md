# Push Discipline

Use this default sequence for meaningful tracked work:

```text
assignment -> implementation -> return -> qa -> risk review -> decision -> runtime update -> push
```

## Operating Rule

- After each accepted tracked code task, create one clean commit and push it.
- Use a proper commit message that matches the task outcome and changed surface.
- Do not batch unrelated work into one delayed push.
- Do not push local-only `ops/runtime/` artifacts unless the project explicitly tracks them.
- If something should stay local-only, keep it out of tracked paths before pushing.

## Trading-Specific Rule

Any change touching these areas requires explicit QA + Risk review before push:

- strategy logic
- backtest metrics
- risk gates
- strategy maturity rules
- execution or broker boundaries
- learning rules
- environment variables related to financial access

## Suggested Commit Message Format

```text
<area>: <specific outcome>
```

Examples:

```text
docs: lock GateZero phase 0 product wedge
risk: add strategy promotion gate policy
quant: define reproducible backtest standards
qa: add phase 0 validation checklist
```
