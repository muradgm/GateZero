# TRD-336 OHLC Mid-Price Limitation Record

## Goal

Record and enforce the limitation that Gate 1 bid/ask OHLC fixtures must not fall back to generic
mid-price OHLC columns.

## Scope

- Keep bid/ask OHLC columns explicit.
- Reject generic `open`, `high`, `low`, or `close` columns in the bid/ask fixture.
- Document the limitation before adapter work.

## Blocked

- No real data adapter.
- No live quotes.

## Acceptance

- Guard detects generic mid-price OHLC columns.
- Source-linked doc and reviews exist.
