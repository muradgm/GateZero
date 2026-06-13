# QA + Risk Gate

A task is not accepted because it compiles or sounds plausible.

## QA/Security review checks

- Does the change match the assignment packet?
- Did the agent stay inside allowed files?
- Are tests meaningful?
- Are edge cases covered?
- Are secrets protected?
- Is the behavior reproducible?
- Does the change create hidden execution paths?

## Risk review checks

- Does this affect financial exposure?
- Could this create duplicate orders?
- Could this use stale data?
- Could this misstate backtest quality?
- Could this hide drawdown or losses?
- Could this promote a strategy incorrectly?
- Could this bypass human approval?

## Blocking rule

One critical QA or Risk finding blocks acceptance.
