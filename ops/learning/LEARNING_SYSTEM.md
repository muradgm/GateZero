# GateZero Learning System

## Purpose

GateZero learns from research mistakes, backtest failures, paper-trading incidents, operator
overrides, agent errors, and live-trading incidents if the project ever reaches an approved live
gate.

Learning improves the system's review quality, tests, prompts, documentation, and safety rules.

Learning must never silently increase:

- trading autonomy
- risk limits
- position size
- leverage
- broker permissions
- strategy maturity level
- live execution privileges

## Learning Loop

```txt
observe -> classify -> postmortem -> rule/eval proposal -> PM + Risk + QA review -> update docs/tests -> monitor recurrence
```

## Learning Event Types

- bad_backtest_assumption
- data_quality_failure
- execution_state_error
- risk_limit_gap
- strategy_overfit
- operator_override
- agent_misrouting
- missed_test
- unclear_ui_warning
- incident_or_near_miss

## Required Reviews

Every learning update that changes behavior requires:

- PM approval for product fit
- Risk approval for safety
- QA/Security approval for validation

## Forbidden Learning

The system may not learn rules such as:

- increase size after wins
- bypass human approval after good performance
- loosen drawdown limits after profitable periods
- promote paper strategy to live automatically
- remove warnings because they are annoying

## Accepted Learning Outputs

- new evals
- stronger tests
- improved risk rules
- better UI warnings
- postmortem actions
- new benchmark cases
- updated assignment packet requirements
- strategy maturity downgrade or freeze
