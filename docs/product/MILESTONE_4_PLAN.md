# Milestone 4 Plan — Evidence and Risk Correctness

## Outcome

Historical strategy evidence is correct, explicit, and conservative enough to support Setup Review decisions.

## Required corrections

### Signal timing

- Add focused tests that prove moving-average windows use only intended closed candles.
- Prove the signal is observed on the prior closed candle.
- Prove execution occurs at the next candle open.
- Rename helper parameters to make inclusive and exclusive indexes unambiguous.

### Capital and exposure

- Calculate entry capital usage from simulated fill price.
- Include entry commission in capital sufficiency checks.
- Define whether exit-cost reserves are required by policy.
- Calculate projected gross exposure using actual simulated notional.

### Equity evidence

Expose two values:

- mark-to-market equity;
- conservative liquidation equity after estimated exit costs and slippage.

### Strategy evidence quality

Add explicit fields for:

- sample size;
- trade count;
- regime coverage;
- in-sample versus out-of-sample status;
- parameter sensitivity;
- reproducibility;
- known limitations.

### Strategy plugin boundary

Create a deterministic strategy interface with versioned logic identity. Do not authorize parameter optimization, provider loading, arbitrary code execution, or external data access.

## Exit criteria

- Focused tests remove ambiguity in signal and execution timing.
- No-leverage checks use actual simulated capital requirements.
- Risk surfaces can choose conservative liquidation equity.
- Setup Reviews display evidence-quality limitations beside performance metrics.
