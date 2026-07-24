# TraderFrame Web

This folder contains the local TraderFrame command center and evidence workspaces.

The command center is a local, read-only control-plane dashboard at `G2_PAPER_TRADING` /
`paper_simulation_planning_only`. It shows operating health, generated historical backtest evidence,
a source-linked read-only Intelligence Brief, strategy-review evidence, simulation evidence, CI
state, review coverage, risk boundaries, and source links.

The Trading Intelligence Command Center is the decision-first product surface. It leads with market
context, candidate ranking, supporting and contradicting evidence, invalidation, risk, exposure, and
the bounded `REJECT`, `WATCH`, or `PAPER_SIMULATE` outcome.

No product surface in this folder may add external account integration, autonomous execution, AI
buy/sell prediction, real or external paper execution, strategy performance claims, readiness
labels, or approval semantics.

## Preview locally

Run:

```powershell
pnpm preview:web
```

Open the control-plane dashboard:

```text
http://127.0.0.1:4173/
```

Open the branded Trading Intelligence Command Center:

```text
http://127.0.0.1:4173/intelligence-command-center.html
```

Use `pnpm preview:web -- --port 4175` when the default local port is already in use.
