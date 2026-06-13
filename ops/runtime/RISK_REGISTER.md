# Risk Register

| ID    | Risk                                    | Severity | Owner            | Status | Mitigation                                              |
| ----- | --------------------------------------- | -------- | ---------------- | ------ | ------------------------------------------------------- |
| R-001 | False confidence from overfit backtests | Critical | QUANT/RISK       | Open   | Enforce backtest honesty checks and strategy versioning |
| R-002 | Hidden live execution path              | Critical | QA_SECURITY      | Open   | Block broker integration until approved financial gate  |
| R-003 | Stale data used for decisions           | High     | MARKET_DATA/RISK | Open   | Require timestamp checks and data provenance            |
