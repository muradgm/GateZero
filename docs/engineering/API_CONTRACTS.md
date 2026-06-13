# API Contracts

## Purpose

This document defines contract discipline for GateZero APIs and internal data exchanges.

Contracts are important because misleading or incomplete trading data can create false confidence.

## Required Contract Families

Phase 0 requires contract definitions for:

- strategy review
- backtest result
- risk review
- learning event
- agent return

Future phases require:

- paper order event
- broker adapter event
- execution readiness
- kill switch event

## Contract Rules

- Every contract must be schema-validated.
- Every financial decision contract must include assumptions.
- Every strategy verdict must include maturity level and risk flags.
- Every backtest result must include fees and slippage assumptions.
- Every learning event must include whether it changes rules, tests, or docs.
- No contract may imply live readiness during Phase 0.

## Error Semantics

Errors should be explicit:

| Error Type           | Meaning                                      |
| -------------------- | -------------------------------------------- |
| `validation_error`   | Input violates contract.                     |
| `data_quality_error` | Dataset cannot support the requested review. |
| `risk_blocked`       | Risk rules reject the action.                |
| `phase_blocked`      | Current gate does not allow the action.      |
| `security_blocked`   | Access or secret-handling rule was violated. |
| `unsupported_scope`  | Feature belongs to a future phase.           |

## Acceptance Rule

A product feature is not accepted until its contracts are clear enough for QA_SECURITY and RISK to
test.
