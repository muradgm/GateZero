/* global document, fetch */

const response = await fetch("./src/simulator-workspace-data.json", { cache: "no-store" });

if (!response.ok) {
  throw new Error("Local simulator workspace data is unavailable.");
}

const data = await response.json();

const root = document.querySelector("#simulator-workspace");

if (!root) {
  throw new Error("Missing simulator workspace root.");
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: data.account.currency,
  maximumFractionDigits: 2
});
const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 });
const percent = (value) => `${number.format(value * 100)}%`;
const statusLabel = (value) => value.replaceAll("_", " ");

root.innerHTML = `
  <div class="sim-shell">
    <header class="sim-header">
      <div class="brand-lockup">
        <span class="brand-name">TraderFrame</span>
        <span class="brand-control">Controlled by GateZero</span>
      </div>
      <a class="back-link" href="./#workspace">Back to Command Center</a>
    </header>

    <main>
      <section class="sim-intro" aria-labelledby="sim-title">
        <div>
          <p class="eyebrow">Read-only local evidence</p>
          <h1 id="sim-title">${data.title}</h1>
          <p class="intro-copy">${data.subtitle}</p>
        </div>
        <div class="scope-lockup" aria-label="Operating boundary">
          <span>${data.gate}</span>
          <strong>${statusLabel(data.status)}</strong>
          <small>${data.scope}</small>
        </div>
      </section>

      <section class="evidence-strip" aria-label="Account evidence summary">
        ${metric("Cash", money.format(data.account.cashAfter), `Before ${money.format(data.account.cashBefore)}`)}
        ${metric("Equity", money.format(data.account.equityAfter), `Before ${money.format(data.account.equityBefore)}`)}
        ${metric("Open positions", String(data.account.openPositions), data.position.instrument)}
        ${metric("Journal events", String(data.journal.eventCount), statusLabel(data.journal.eventType))}
      </section>

      <div class="evidence-grid">
        ${panel(
          "Position and equity",
          "Deterministic accounting",
          rows([
            ["Instrument", data.position.instrument],
            [
              "Quantity",
              `${number.format(data.position.quantityBefore)} → ${number.format(data.position.quantityAfter)}`
            ],
            [
              "Average price",
              `${number.format(data.position.averagePriceBefore)} → ${number.format(data.position.averagePriceAfter)}`
            ],
            ["Mark price", number.format(data.position.markPrice)],
            ["Marked value", money.format(data.position.markedValue)],
            ["Fee-adjusted P&L", money.format(data.account.feeAdjustedPnl)]
          ])
        )}
        ${panel(
          "Lifecycle evidence",
          "Manual transition",
          `<ol class="timeline">
            <li><span>From</span><strong>${statusLabel(data.lifecycle.from)}</strong></li>
            <li><span>Operator review</span><strong>${data.lifecycle.operatorRequired ? "Required" : "Missing"}</strong></li>
            <li><span>To</span><strong>${statusLabel(data.lifecycle.to)}</strong></li>
          </ol><p class="panel-note">${data.lifecycle.reason}</p>`
        )}
        ${panel(
          "Risk and candidate guards",
          data.risk.policyLocked ? "Policy locked" : "Policy review required",
          rows([
            ["Risk evaluation", statusLabel(data.risk.status)],
            ["Candidate integrity", statusLabel(data.candidate.status)],
            [
              "Position fraction",
              `${percent(data.risk.positionFraction)} / ${percent(data.risk.maxPositionFraction)}`
            ],
            [
              "Drawdown fraction",
              `${percent(data.risk.drawdownFraction)} / ${percent(data.risk.maxDrawdownFraction)}`
            ],
            ["Policy version", data.risk.policyVersion],
            ["Candidate age limit", `${data.candidate.maxAgeSeconds}s`]
          ])
        )}
        ${panel(
          "Fill-cost evidence",
          "Synthetic assumptions",
          rows([
            ["Side / quantity", `${data.fill.side} / ${number.format(data.fill.quantity)}`],
            ["Fill price", number.format(data.fill.price)],
            ["Notional", money.format(data.fill.notional)],
            ["Fee", money.format(data.fill.fee)],
            ["Spread / slippage", `${data.fill.spreadBps} / ${data.fill.slippageBps} bps`],
            ["Modeled latency", `${data.fill.latencyMs} ms`]
          ]) + `<p class="panel-note warning">${data.fill.limitation}</p>`
        )}
        ${panel(
          "Journal integrity",
          data.journal.immutable ? "Immutable" : "Integrity review required",
          rows([
            ["Event count", String(data.journal.eventCount)],
            ["Event type", statusLabel(data.journal.eventType)],
            ["Tail hash", `<code>${data.journal.tailHash}</code>`],
            ["Reconciliation", statusLabel(data.reconciliation.status)],
            [
              "Readonly emergency",
              data.reconciliation.readonlyEmergency ? "Required" : "Not required"
            ]
          ])
        )}
        ${panel(
          "Operating boundary",
          "Inspection only",
          `<ul class="boundary-list">${data.boundaries.map((item) => `<li>${item}</li>`).join("")}</ul>`
        )}
      </div>
    </main>

    <footer>
      <span>Record ${data.account.id}</span>
      <span>Generated ${new Date(data.reducedAt).toLocaleString("en-GB", { timeZone: "UTC" })} UTC</span>
    </footer>
  </div>
`;

function metric(label, value, detail) {
  return `<div class="metric"><span>${label}</span><strong>${value}</strong><small>${detail}</small></div>`;
}

function panel(title, chip, content) {
  return `<section class="evidence-panel"><header><h2>${title}</h2><span>${chip}</span></header>${content}</section>`;
}

function rows(items) {
  return `<dl class="evidence-rows">${items
    .map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`)
    .join("")}</dl>`;
}
