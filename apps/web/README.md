# GateZero Web

This folder contains the static Gate 0 command center prototype.

The command center is a local, read-only control-plane dashboard. It shows operating health, Gate 0
status, verification status, CI evidence, agent/review coverage, risk boundaries, and source links.

No product surface in this folder may add broker integration, autonomous execution, AI buy/sell
prediction, paper/live execution, strategy performance claims, readiness labels, or approval
semantics.

Open locally:

```text
apps/web/index.html
```

Preview locally:

```powershell
pnpm preview:web
```

Use `pnpm preview:web -- --port 4175` when the default local port is already in use.
