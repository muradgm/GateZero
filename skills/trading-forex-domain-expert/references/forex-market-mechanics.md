# Forex Market Mechanics Reference

Use this reference when reviewing calculations, symbol assumptions, account state, margin, and
trading correctness.

## Contents

- Symbol And Account Fundamentals
- Pip, Tick, Lot, And Contract Size
- Bid, Ask, Spread, And Trigger Rules
- P/L And Currency Conversion
- Position Sizing
- Margin, Leverage, And Liquidation Risk
- Fees, Commission, Swap, And Financing
- Common Domain Bugs
- Verification Checklist

## Symbol And Account Fundamentals

Always identify:

- Base currency and quote currency for each pair
- Account currency
- Broker symbol name and asset class
- Price precision, tick size, tick value, contract size, min lot, max lot, and lot step
- Margin mode and leverage rules
- Trade mode: full trading, close-only, disabled, long-only, short-only, or session-limited

Do not hard-code universal assumptions such as "all forex pairs have 5 decimals" or "1 lot always
equals 100,000 units" unless the broker metadata confirms it for the symbol.

## Pip, Tick, Lot, And Contract Size

Review whether the app distinguishes:

- **Point/tick**: The smallest price increment supported by the symbol.
- **Pip**: Conventional forex price movement unit, often 0.0001 for most major pairs and 0.01 for
  many JPY pairs.
- **Pipette/fractional pip**: One tenth of a pip on many brokers.
- **Lot**: Broker-defined order quantity unit.
- **Contract size**: Units represented by one lot.

Red flags:

- JPY pairs treated like EURUSD decimal precision.
- Metals, indices, crypto, or CFDs treated with forex pip rules.
- Position size calculated without broker lot step rounding.
- Tick value assumed constant when it depends on account currency or price.

## Bid, Ask, Spread, And Trigger Rules

Forex and CFD products usually quote bid and ask:

- A long position typically opens at ask and closes at bid.
- A short position typically opens at bid and closes at ask.
- Buy stops and sell stops must be checked against the correct side of the quote.
- Stop-loss and take-profit triggers can differ by position direction and broker rule.

Do not accept mid-price-only execution for broker-connected trading. Mid-price can be useful for
charting, but execution and risk require bid/ask awareness.

Check that spread is included in:

- Entry price
- Stop distance when relevant
- Take-profit feasibility
- Break-even price
- Backtest fills
- Risk/reward display
- P/L estimates

## P/L And Currency Conversion

P/L must be converted into account currency. Cases:

- EURUSD trade, USD account: quote currency already matches account currency.
- USDJPY trade, USD account: P/L is first in JPY and must be converted to USD.
- EURGBP trade, USD account: P/L is in GBP and must be converted using GBPUSD or another valid
  conversion path.

Check:

- Long and short formulas are directionally correct.
- Account currency conversion uses current or appropriate historical conversion rates.
- Open floating P/L and closed realized P/L use consistent conventions.
- Commission, swap, and financing are included when displayed as net P/L.

## Position Sizing

Position sizing should be based on:

- Account equity or balance, explicitly chosen
- Risk percent or fixed money risk
- Entry price
- Stop-loss price
- Correct stop distance in ticks or pips
- Tick value or pip value in account currency
- Broker min lot, max lot, and lot step
- Additional costs if the product claims exact risk

Common formula shape:

```text
risk_money = equity * risk_percent
loss_per_lot = stop_distance_in_ticks * tick_value_per_lot
raw_lots = risk_money / loss_per_lot
trade_lots = round_down_to_lot_step(raw_lots)
```

Flag zero stop distance, missing stop, invalid price, negative risk, and lot rounding that increases
risk above the user's configured limit.

## Margin, Leverage, And Liquidation Risk

Check that the app distinguishes:

- Balance
- Equity
- Floating P/L
- Used margin
- Free margin
- Margin level
- Leverage
- Required margin
- Stop-out or liquidation thresholds

Red flags:

- Margin calculated as notional / global leverage when symbol-specific margin rules exist.
- Equity ignored in favor of static balance.
- Free margin shown without open P/L.
- Hedged positions treated incorrectly for netting or hedging accounts.
- Margin call or stop-out not modeled in simulation.

## Fees, Commission, Swap, And Financing

Review whether the product accounts for:

- Spread cost
- Per-lot or percentage commission
- Overnight swap or financing
- Triple swap days
- Broker markup
- Conversion fees
- Minimum commissions

If the UI says "net profit", costs must be included or clearly excluded.

## Common Domain Bugs

- Using candle high/low from a mid-price chart to decide whether a live stop filled.
- Treating all symbols as forex majors.
- Applying EURUSD pip value logic to JPY, metals, crypto, or indices.
- Calculating position size from balance while showing risk against equity.
- Letting lot-step rounding increase risk.
- Ignoring spread in risk/reward and break-even displays.
- Showing backtest performance before deducting spread, commission, swap, and slippage.
- Mixing broker timezone, UTC, and user timezone without labeling.
- Reusing live quote conversion rates for historical backtest P/L.

## Verification Checklist

- Test one long and one short for EURUSD with USD account.
- Test one JPY pair with USD account.
- Test one cross pair where neither base nor quote equals account currency.
- Test one non-forex CFD or metal if supported.
- Test min lot, max lot, and lot step.
- Test invalid stop distance and extreme leverage.
- Test weekend gap and high-spread period.
- Compare app results against broker platform values for the same order.
