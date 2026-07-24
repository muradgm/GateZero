# Market Intelligence Foundation Implementation

## Purpose

This implementation extends the accepted local market-intelligence lane into a deterministic,
read-only foundation for operator-reviewed scenario briefs.

It does not add live sources, polling, providers, credentials, broker connectivity, order routes,
trade instructions, final recommendations, or gate movement.

## TRD-748 Analyst Authority

The governed `senior-market-intelligence-scenario-analyst` skill:

- accepts supplied repository-local evidence only
- requires bullish, bearish, and neutral conditional scenarios
- requires supporting and counter-evidence
- requires confidence, red flags, invalidation, limitations, risk review, and operator decision
- refuses direct and disguised trading instructions
- refuses certainty, profitability, ranking, risk approval, execution, and promotion authority

Its eval suite includes unsafe-language, stale-evidence, broker-permission, network-access, and
contradictory-flag cases.

## TRD-749 Local Replay Source Boundary

The source envelope records:

- source identity and type
- canonical repository-relative path
- observed, published, as-of, and ingestion times
- deterministic payload hash
- freshness, provenance, and limitations
- replay-only, no-network, no-credential, and tracked-file requirements

Allowed roots are limited to `ops/`, `docs/`, and `packages/fixtures/data/`. URLs, absolute paths,
backslashes, query fragments, path traversal, encoded traversal, and other roots are rejected.

The repository source guard verifies that every fixture source:

- resolves to a regular file inside the real repository root
- is tracked by Git
- matches its frozen SHA-256 payload hash

Quality assessment invokes the same validation boundary. A caller cannot bypass source integrity by
calling the quality function directly.

## TRD-750 Multi-Timeframe Assembly

The assembly requires exactly one hourly, daily, and monthly evidence record. Each timeframe keeps:

- independent coverage and as-of time
- its own sources
- supporting and counter-evidence
- conflicts, red flags, invalidation, limitations, and confidence

Cross-timeframe conflicts remain visible. The assembly cannot create a directional conclusion.

## TRD-751 Evidence And Semantic Quality

The quality assessment derives freshness from each source's as-of time, explicit maximum age, and
assessment time. Provenance uses a structured status rather than arbitrary note text. It fails
closed on:

- stale, unknown, or falsely declared source freshness
- missing sources
- untracked, unreadable, escaped, non-file, or hash-mismatched sources
- unresolved timeframe conflicts
- weak provenance
- direct or disguised trading instructions
- certainty or profitability language
- autonomous opportunity ranking
- text that contradicts non-action authority

Every timeframe text field is scanned automatically. Any finding blocks scenario consideration.
Boolean safety fields and caller-selected text subsets do not override unsafe text.

## TRD-752 Conditional Scenario Synthesis

Clear evidence may produce one bullish, one bearish, and one neutral scenario together. Every
scenario includes source references, conditions, supporting evidence, counter-evidence, structured
regime assumptions, observable invalidation criteria, red flags, limitations, and bounded
confidence.

Every rendered scenario field is scanned again at synthesis. Blocked evidence or unsafe draft text
produces no scenarios. Research-case, assembly, and quality-assessment identities must agree. No
scenario is selected for action or expressed as a trade instruction.

## TRD-753 Adversarial Review

The adversarial review challenges:

- blocked source or semantic quality
- unresolved timeframe disagreement
- placeholder or unlinked counter-evidence
- placeholder or unlinked regime assumptions
- placeholder, unobservable, or unlinked invalidation criteria

The scenario set, quality assessment, assembly, and research case must describe the same evidence
chain. High or critical challenges prevent a clear review. Unresolved reviews block operator
consideration.

## TRD-754 Historical Replay Benchmark

Each replay case links frozen source IDs, quality assessment, scenario set, adversarial review, and
unique artifact hashes. Rates are derived and schema-validated from those records rather than
self-attested booleans. The benchmark measures:

- required-source coverage
- three-scenario completion
- invalidation documentation
- red-flag detection
- unsafe-input blocking

It excludes return metrics, profitability metrics, hit-rate claims, edge claims, and trading
readiness.

## Validation

Required commands:

```powershell
pnpm check:market-intelligence-sources
pnpm check:gate0-skills
pnpm check:gate0-skill-routing
pnpm typecheck
pnpm test:ci
pnpm verify:gate0
```
