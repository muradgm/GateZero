# TRD-332 Skill Eval Phase Alignment Recheck

## Goal

Ensure project skill eval fixtures do not retain stale Gate 0 phase wording after Gate 1 activation.

## Scope

- Add eval fixture drift detection.
- Keep skill default prompts explicit and Gate 1-aware.
- Preserve explicit invocation metadata.

## Blocked

- No implicit skill invocation.
- No stale `G0_RESEARCH` or `research_only` eval examples.

## Acceptance

- Skill governance check fails on stale eval phase language.
- Focused and full validation pass.
