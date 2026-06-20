# Gate 1 Provider Credential Exclusion Policy

TRD-355 records that provider credentials are excluded from current Gate 1 work.

## Exclusions

- No provider API keys, bearer tokens, account identifiers, refresh tokens, secrets, or broker
  credentials may be added.
- No `.env` provider contract may be introduced for adapter work during this packet.
- No provider account connection or authenticated request path may be created.
- Future credential work requires a separate authorization packet and QA_SECURITY review before any
  implementation.

## Boundary

Historical data adapter planning may describe blockers, required reviews, and future controls only.
It must not collect, store, validate, log, or transmit credentials.

## Source Links

- Source packet: `ops/assignments/TRD-355_PROVIDER_CREDENTIAL_EXCLUSION_POLICY.md`
- Reviews: `ops/runtime/reviews/TRD-355_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-355_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-355_ORCHESTRATOR_ACCEPTANCE.md`
