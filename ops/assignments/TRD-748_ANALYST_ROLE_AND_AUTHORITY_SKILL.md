# TRD-748 Analyst Role And Authority Skill

Status: accepted

## Goal

Create one governed Senior Market Intelligence and Scenario Analyst skill for source-linked,
conditional, read-only analysis.

## Outputs

- Skill instructions, explicit invocation metadata, authority reference, and adversarial evals.
- Skill governance and routing updates.

## Blocked Scope

No runtime behavior, network access, credentials, ranking, trading instructions, risk approval,
execution, claims, or gate movement.

## Acceptance

The skill is valid, explicitly invoked, Gate 2-aware, evaluation-backed, and unable to grant itself
action authority.

## Next Agent

MARKET_DATA implements TRD-749 after RISK and QA_SECURITY review.
