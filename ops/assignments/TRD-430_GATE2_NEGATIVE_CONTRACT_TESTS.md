# TRD-430 Gate 2 Negative Contract Tests

## Goal

Add Gate 2 negative contract tests for blocked boundaries.

## Scope

- Reject external, credential, live, automated, claim, and missing-review boundary mutations.
- Keep tests local and deterministic.
- Cover synthetic negative fixture classes.

## Blocked

- No broad scanner allowlist expansion.
- No real payloads.
- No execution logic.

## Acceptance

- Negative tests exist.
- Fixture tests cover required boundary classes.
