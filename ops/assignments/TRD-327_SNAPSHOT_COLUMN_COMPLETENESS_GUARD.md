# TRD-327 Snapshot Column Completeness Guard

## Goal

Add a local check that the Gate 1 bid/ask OHLC snapshot keeps required columns explicit.

## Scope

- Require timestamp, open/high/low/close bid, and open/high/low/close ask columns.
- Require all listed columns to remain required.
- Keep the fixture synthetic.

## Blocked

- No real data adapter.
- No live quote access.

## Acceptance

- Guard fails when a required bid/ask OHLC column is missing.
- Fixture tests assert column completeness.
