# TRD-171: Canonical Repo Hygiene And Agent Alignment

## Objective

Make `C:\Users\Murad\Documents\gatezero` the canonical GateZero workspace and bring repo hygiene and
agent registration into alignment there.

## Scope

Allowed:

- Initialize git metadata for the canonical local workspace.
- Add `.gitignore` for dependencies, local caches, logs, build output, and environment files.
- Register `BRAND_DESIGNER` in `ops/AGENTS_MANIFEST.json`.
- Add missing BRAND_DESIGNER reference index files.
- Verify all agents resolve required local references.

Blocked:

- Live trading, broker integration, paper execution, autonomous execution, AI prediction, external
  execution paths, strategy readiness claims, performance claims, or risk-gate loosening.

## Required Output

- `.gitignore`
- Updated `ops/AGENTS_MANIFEST.json`
- `ops/agents/BRAND_DESIGNER/references/README.md`
- `ops/agents/BRAND_DESIGNER/references/source_map.json`
- `docs/operations/GATE0_CANONICAL_REPO_HYGIENE_AND_AGENT_ALIGNMENT.md`

## Acceptance Criteria

- `node_modules/` is ignored by git.
- The canonical local repo has initialized git metadata.
- Manifest agent count matches agent folder count.
- All manifest-required agent files exist.
- Gate 0 verification remains passing.

## Source Links

- Current tracker: `ops/runtime/tracklist.md`
- Agent manifest: `ops/AGENTS_MANIFEST.json`
- Agent root: `ops/agents/`
