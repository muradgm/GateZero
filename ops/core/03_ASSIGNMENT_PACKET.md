# Assignment Packet Standard

Every meaningful task must be assigned through a packet.

## Required sections

- task id
- assigned agent
- objective
- product wedge relevance
- current financial gate
- allowed files
- blocked files
- source truth files
- required benchmarks
- required validation
- risk controls
- expected return contract
- done_when

## Required blocked files for most tasks

Unless explicitly allowed, agents may not edit:

- ops/truth/RISK_RULES.md
- ops/governance/FINANCIAL_RISK_GATES.md
- broker secret handling
- live execution code
- strategy maturity records
