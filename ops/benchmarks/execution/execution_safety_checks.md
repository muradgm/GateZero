# Execution Benchmark — Broker Safety

Execution code must handle:

- market closed
- insufficient buying power
- rejected orders
- partial fills
- duplicate order requests
- broker disconnect
- delayed confirmations
- order cancellation failure
- position mismatch
- stale quote data
- emergency kill switch

Live execution is blocked until these are tested.
