# Validation Rules

## Global validation

Every task must validate:

- scope compliance
- truth alignment
- allowed file discipline
- benchmark completion
- risk notes
- rollback path

## Trading-specific validation

Any task touching strategy, data, risk, or execution must validate:

- no lookahead bias introduced
- no hidden strategy promotion
- no unapproved financial gate change
- no broker secret exposure
- no live execution path unless explicitly approved
- no risk rule bypass
