# Gate 2 Credential Exclusion Guard Plan

TRD-416 plans credential exclusion for Gate 2.

## Forbidden Classes

- API keys.
- Tokens.
- Account secrets.
- Login credentials.
- Secret-bearing environment variables for external services.
- Raw sensitive payloads.

## Future Guard Expectation

Any implementation packet must preserve scanner coverage and must not add allowlist expansion unless
QA_SECURITY accepts a narrow, documented reason.

## Source Links

- Source packet: `ops/assignments/TRD-416_CREDENTIAL_EXCLUSION_GUARD_PLAN.md`
- Reviews: `ops/runtime/reviews/TRD-416_QA_SECURITY_REVIEW.md`,
  `ops/runtime/reviews/TRD-416_RISK_REVIEW.md`,
  `ops/runtime/reviews/TRD-416_ORCHESTRATOR_ACCEPTANCE.md`
