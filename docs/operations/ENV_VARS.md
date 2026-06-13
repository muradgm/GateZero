# Environment Variables

## Purpose

This document defines environment variable discipline for GateZero.

GateZero starts as an internal, single-operator research system. Even so, it must not normalize weak
secret handling because later phases may touch broker APIs and financial data.

## Phase 0 Boundary

Phase 0 must not include broker credentials.

Blocked in Phase 0:

- `BROKER_API_KEY`
- `BROKER_API_SECRET`
- live execution credentials
- exchange credentials
- production order-routing tokens

## Internal API Boundary

| Variable                  | Used by        | Required              | Notes                                                                                                         |
| ------------------------- | -------------- | --------------------- | ------------------------------------------------------------------------------------------------------------- |
| `INTERNAL_API_TOKEN`      | API            | Production            | Internal token for product-changing routes. Startup should fail in production if missing.                     |
| `VITE_INTERNAL_API_TOKEN` | Web            | When token is enabled | Web app sends this only to the internal API boundary. Do not expose secrets beyond this simple internal gate. |
| `DATABASE_URL`            | API / worker   | Yes                   | PostgreSQL connection string.                                                                                 |
| `REDIS_URL`               | Worker / queue | Later                 | Required when background jobs are introduced.                                                                 |
| `NODE_ENV`                | All Node apps  | Yes                   | `development`, `test`, or `production`.                                                                       |
| `PYTHON_ENV`              | Quant engine   | Optional              | Used to separate local/test/prod-like quant runs.                                                             |

## Future Broker Variables

Future-only variables must be documented before use:

| Variable               | Gate             | Notes                                              |
| ---------------------- | ---------------- | -------------------------------------------------- |
| `BROKER_MODE`          | Paper Trading+   | Must be `paper` before any live credentials exist. |
| `BROKER_API_KEY`       | Paper Trading+   | Never committed, never exposed to frontend.        |
| `BROKER_API_SECRET`    | Paper Trading+   | Secret manager preferred.                          |
| `LIVE_TRADING_ENABLED` | Supervised Live+ | Must default to `false`.                           |
| `MAX_DAILY_LOSS_PCT`   | Supervised Live+ | Must be enforced server-side.                      |
| `KILL_SWITCH_ENABLED`  | Supervised Live+ | Must default to `true` once execution exists.      |

## Rules

- No broker secrets in frontend.
- No broker secrets in git.
- No live trading env vars in Phase 0.
- `.env.example` may include names but never values.
- Production startup should fail if required safety variables are missing.
