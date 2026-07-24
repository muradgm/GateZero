# TraderFrame Web

This folder contains the local TraderFrame command center and evidence workspaces.

The command center is a local, read-only control-plane dashboard at `G2_PAPER_TRADING` /
`paper_simulation_planning_only`. It shows operating health, generated historical backtest evidence,
strategy-review evidence, simulation evidence, CI state, review coverage, risk boundaries, and
source links.

No product surface in this folder may add external account integration, autonomous execution, AI
buy/sell prediction, real or external paper execution, strategy performance claims, readiness
labels, or approval semantics.

Open locally:

```text
apps/web/index.html
```

Preview locally:

```powershell
pnpm preview:web
```

Use `pnpm preview:web -- --port 4175` when the default local port is already in use.
