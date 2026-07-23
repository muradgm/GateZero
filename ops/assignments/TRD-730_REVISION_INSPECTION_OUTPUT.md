# TRD-730 Revision Inspection Output

Status: accepted

## Goal

Added bounded CLI inspection for immutable revision lineage.

## Boundary

Read-only summaries only. No revised payload mutation, verification, approval, or promotion.

## Acceptance

`--revisions <case-id>` shows chain metadata, hashes, blocked state, and safety literals.
