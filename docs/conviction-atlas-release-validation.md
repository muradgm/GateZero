# Conviction Atlas Release Validation

## Purpose

This checklist separates implemented safeguards from evidence collected in a real browser. The production surface is not release-ready until every required item has a recorded result.

## Structural runtime checks

The in-browser QA harness validates:

- production surface mount;
- market landscape mount;
- canvas or static terrain availability;
- four scenario controls;
- four decision lenses;
- six decision-trace stages;
- three experience-quality modes;
- accessible live status;
- keyboard skip link;
- static SVG fallback.

Expected result: **10/10**.

## Manual interaction checks

- Select Bull, Sideways, Bear and Recommended scenarios.
- Confirm thesis, probability, risk and recommendation update together.
- Select Evidence, Opportunity, Risk and Conviction lenses.
- Confirm the landscape presentation and lens description update.
- Open all six decision-trace stages.
- Confirm trace context reflects the active scenario and lens.
- Pause and resume motion.
- Switch Full, Reduced and Static quality modes.
- Hide and restore the browser tab and confirm visibility pausing works.

## Accessibility checks

- Complete the full interaction path using only the keyboard.
- Verify visible focus indication on every control.
- Verify scenario, lens and quality controls expose pressed state.
- Verify live-region messages are concise and not repeatedly announced.
- Test with reduced-motion enabled at operating-system level.
- Confirm Static mode preserves all critical decision information.

## Responsive checks

Record results at:

- 360 × 800
- 768 × 1024
- 1280 × 800
- 1440 × 900
- 1920 × 1080

No horizontal page overflow, clipped controls or unreadable labels are allowed.

## Performance checks

- Full mode remains responsive during pointer movement and scenario switching.
- Automatic downgrade occurs when sustained frame rate falls below the configured threshold.
- Reduced mode removes nonessential effects.
- Static mode performs no continuous visual animation.
- Background-tab animation pauses.

## Browser matrix

- Chrome current
- Edge current
- Firefox current
- Safari current, when macOS or iOS hardware is available

## Release decision

Release status must remain **Pending browser evidence** until the local checks above are executed and failures are documented or fixed. A passing in-browser structural score alone is not sufficient for release approval.
