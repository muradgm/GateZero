# TRD-507 Frontend Keyboard Navigation QA Recheck

Status: accepted

## Goal

Recheck keyboard and hash-navigation behavior for the frontend shell.

## Scope

- Preserve skip link, focus-visible styling, semantic landmarks, and hash-aware navigation.
- Add active navigation state semantics.
- Keep navigation as review navigation only.

## Blocked Scope

- Keyboard shortcuts for trading actions, execution hotkeys, order forms, and approval actions.

## Required Outputs

- Keyboard navigation QA record.
- Render guard update.
- QA_SECURITY review.
- RISK review.
- ORCHESTRATOR acceptance.

## Acceptance

Accepted when active navigation exposes current state and no keyboard path triggers action
semantics.
