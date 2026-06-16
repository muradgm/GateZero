# Risk, Trust, And Safety Reference

Use this reference when reviewing risk visibility, alerts, journaling, behavioral safety, and
operational confidence.

## Contents

- Risk Visibility
- Alerts And Attention
- Journaling And Review
- Behavioral Safety
- Operational Safety
- Product Claims And Disclaimers
- Review Checklist

## Risk Visibility

The product should make the following visible where relevant:

- Risk per trade
- Open risk across all positions
- Account balance and equity
- Drawdown
- Margin used, free margin, and margin level
- Stop-loss distance and money risk
- Position size and notional exposure
- Leverage impact
- Exposure by symbol, currency, sector, strategy, or account
- Correlated exposure
- Worst-case loss when gaps or slippage matter

Red flags:

- Showing reward without loss.
- Showing win rate without average loss, drawdown, or trade count.
- Showing account balance without equity.
- Hiding stop-loss state on open trades.
- Reporting "safe" position size without margin and lot-step constraints.

## Alerts And Attention

Alerts should be:

- Specific
- Timely
- Actionable
- Prioritized by severity
- Reviewable after the fact

Separate alert types:

- Price alerts
- Order and execution alerts
- Risk limit alerts
- Margin alerts
- Connection and stale-data alerts
- Strategy or signal alerts
- Journal or review reminders

Avoid alert fatigue. Critical alerts should not look like ordinary informational messages.

## Journaling And Review

A useful trading journal captures:

- Trade plan before entry
- Setup or strategy
- Screenshot or chart state
- Entry, stop, target, and size
- Reason for entry
- Invalidation condition
- Exit reason
- Planned vs. actual behavior
- Rule adherence
- Mistake tags
- Emotional or process notes if appropriate

Review analytics should separate process quality from outcome luck. A profitable rule break should
still be visible as a rule break.

## Behavioral Safety

Check whether the product reduces harmful behavior:

- Accidental duplicate orders
- Revenge trading
- Oversizing after losses
- Removing stops without awareness
- Overtrading during volatility
- Chasing signals without invalidation
- Ignoring daily loss limits
- Treating backtest curves as guaranteed performance

Useful safeguards:

- Daily loss and trade-count limits
- Clear warnings for oversized risk
- Cooldown or lockout options
- Rule-adherence checks
- Confirmation for removing stops or increasing risk
- Distinct styling for simulated vs. live actions

## Operational Safety

The product should handle:

- Connection loss
- Stale prices
- Broker rejection
- Market closed state
- Insufficient margin
- Invalid stop distance
- Symbol disabled or close-only state
- Partial fills
- Delayed data
- Mobile network interruption

Safety message quality matters. A trader should know whether to retry, wait, reduce size, change
price, or contact broker support.

## Product Claims And Disclaimers

Be skeptical of claims such as:

- Guaranteed profit
- High win rate without risk context
- Backtest performance without costs
- Signal accuracy without sample size
- AI confidence without explanation
- Low risk without stop, size, slippage, and margin assumptions

The app should clearly distinguish:

- Education vs. advice
- Analytics vs. execution
- Historical performance vs. expected future performance
- Paper/demo behavior vs. live broker behavior

## Review Checklist

- Is risk visible at the moment of action?
- Can the trader tell live vs. demo vs. simulated immediately?
- Are prices and signals timestamped?
- Are stale data and connection loss obvious?
- Is order state broker-confirmed?
- Are warnings shown before dangerous actions?
- Are losses, exposure, and drawdown more prominent than vanity metrics?
- Can the trader review what happened after a mistake?
- Does the app avoid overstating certainty or performance?
