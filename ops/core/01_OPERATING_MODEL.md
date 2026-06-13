# Operating Model

## Modes

### Human-directed mode

Use when:

- product truth changes
- risk policy changes
- live or paper execution is involved
- strategy maturity changes
- broker integration is touched

### PM-routed mode

Use when:

- task is bounded
- truth is stable
- financial gate is known
- rollback is obvious
- no live execution risk exists

### Agent-executed mode

Use when:

- assignment packet is explicit
- allowed files are narrow
- benchmark and validation are named
- outputs are contractable
- QA/Security and Risk review rules are clear

## Acceptance path

assignment packet -> specialist execution -> QA/Security review -> Risk review when applicable -> PM
decision -> runtime update

## Financial safety override

Risk Officer can block any task. QA/Security can block any task. Human operator can block any task.
PM cannot override Risk or QA/Security on financial-safety matters.
