# Gate 1 Dependency Audit And Upgrade Plan

## Purpose

This record captures the current dependency audit result and defines the next safe upgrade action.

## Audit Command

```powershell
pnpm audit --audit-level moderate
```

## Audit Result

The audit failed with 6 vulnerabilities:

- 1 critical: `vitest <3.2.6`
- 1 high: transitive `vite <=6.4.2`
- 3 moderate: transitive `vite` and `esbuild <=0.24.2`
- 1 low

The vulnerable path is rooted in `vitest@2.1.9`, which pulls `vite@5.4.21` and `esbuild@0.21.5`.

## Risk Interpretation

These findings affect development and test tooling, not production trading code. However, they still
matter because TraderFrame uses local command-center preview and test tooling as operating evidence.

## Required Next Action

Run a bounded dependency upgrade packet:

```text
TRD-268 Dependency Upgrade Execution
```

Minimum target:

- Upgrade Vitest to a patched line at or above `3.2.6`.
- Confirm transitive Vite is patched at or above `6.4.3`.
- Confirm transitive esbuild is patched at or above `0.25.0`.
- Run `pnpm audit --audit-level moderate`.
- Run `pnpm verify:gate0`.

## Boundary

The audit does not add broker integration, market access, execution paths, AI prediction, strategy
approval, performance claims, external publishing, credentials, or risk-gate changes.

## Source Links

- Source packet: `ops/assignments/TRD-267_DEPENDENCY_AUDIT_AND_UPGRADE_PLAN.md`
- QA/security review: `ops/runtime/reviews/TRD-267_QA_SECURITY_REVIEW.md`
- Risk review: `ops/runtime/reviews/TRD-267_RISK_REVIEW.md`
- Orchestrator acceptance: `ops/runtime/reviews/TRD-267_ORCHESTRATOR_ACCEPTANCE.md`
- Package manifest: `package.json`
- Lockfile: `pnpm-lock.yaml`
- Tracklist: `ops/runtime/tracklist.md`
