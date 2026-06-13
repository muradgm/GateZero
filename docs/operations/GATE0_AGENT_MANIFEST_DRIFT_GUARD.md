# Gate 0 Agent Manifest Drift Guard

## Purpose

This guard keeps GateZero's agent registry and local agent reference files aligned.

Command:

```powershell
pnpm check:gate0-agents
```

## Checks

- `ops/AGENTS_MANIFEST.json` parses as JSON.
- Manifest agents match folders under `ops/agents/`.
- Every manifest agent has all `required_per_agent` files.
- Agent eval files parse as JSON.
- Agent skill and reference files do not carry the old project name.
- Local `URL/path` references in agent reference docs resolve to actual local files under supported
  control-plane roots.

## Boundary

The guard checks local operating records only. It does not create agents, dispatch work, increase
autonomy, approve strategies, or authorize execution.

## Source Links

- Source packet: `ops/assignments/TRD-174_AGENT_MANIFEST_DRIFT_GUARD.md`
- Reviews: `ops/runtime/reviews/TRD-174_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-174_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-174_ORCHESTRATOR_ACCEPTANCE.md`
- Guard script: `scripts/check-gate0-agent-manifest.ts`
- Guard tests: `packages/fixtures/tests/gate0-agent-manifest-check.test.ts`
- Command source: `package.json`
- Tracker: `ops/runtime/tracklist.md`
