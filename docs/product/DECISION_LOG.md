# Trading Intelligence Command Center Decision Log

## 2026-07-24 — Product direction

Decision: evolve TraderFrame around a decision-first Trading Intelligence Command Center while retaining GateZero as the internal control plane.

Reason: the repository has strong evidence, contract, validation, and governance foundations, but the product surface is still dominated by repository health rather than trader decisions.

## 2026-07-24 — First vertical slice

Decision: implement an Evidence-Gated Setup Review before broad market-intelligence expansion.

Reason: one complete candidate-to-learning workflow proves the wedge more effectively than adding many disconnected dashboard modules.

## 2026-07-24 — Bounded outcomes

Decision: the first Setup Review supports only `REJECT`, `WATCH`, and `PAPER_SIMULATE`.

Reason: these outcomes preserve operator authority and prevent research evidence from being interpreted as execution approval.

## 2026-07-24 — Confidence model

Decision: use explainable evidence-quality dimensions before introducing a scalar AI confidence score.

Reason: an uncalibrated score creates false precision and can bypass contradictory evidence, limitations, and risk blockers.

## 2026-07-24 — Delivery process

Decision: organize this branch around six cohesive milestones instead of one governance packet per small change.

Reason: the historical packet system provides auditability but has become too large to function as an effective product roadmap.
