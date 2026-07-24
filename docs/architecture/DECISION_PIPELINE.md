# TraderFrame Decision Pipeline

## Purpose

The Decision Pipeline is the single protected orchestration path for turning a research case into a bounded operator outcome and learning record.

```text
Research Case
  -> Market Context
  -> Evidence Assessment
  -> Setup Review
  -> Intelligence Report
  -> Risk Review
  -> Operator Decision
  -> Paper Simulation (only when selected)
  -> Outcome
  -> Learning
```

## Rules

- Every stage appears exactly once.
- Stages advance only in order.
- Completed stages require a record identifier and completion time.
- Blocked stages require explicit blockers.
- `REJECT` and `WATCH` skip paper simulation and advance to outcome.
- `PAPER_SIMULATE` does not imply execution authority; it only preserves the local simulation-planning path.
- The pipeline never creates external access, automated action, broker connectivity, or execution authority.

## Browser role

The Trading Intelligence Command Center should consume this pipeline to show:

- current stage;
- completed evidence chain;
- blockers;
- bounded recommendation;
- simulation applicability;
- outcome and learning progression.

UI code must not invent or bypass stage transitions.
