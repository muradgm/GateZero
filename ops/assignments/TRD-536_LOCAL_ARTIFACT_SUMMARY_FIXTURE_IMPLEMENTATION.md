# TRD-536 Local Artifact Summary Fixture Implementation

Status: accepted

## Goal

Represent local artifact summary references inside the simulation evidence detail fixture.

## Scope

- Add local artifact summary identifiers.
- Require local `ops/` or `docs/` source artifact paths.
- Keep all references deterministic and checked into the repo.

## Blocked Scope

- External URLs as source artifacts, external accounts, live data routes, or credential payloads.

## Acceptance

Accepted when local-source negative tests reject nonlocal artifact paths.
