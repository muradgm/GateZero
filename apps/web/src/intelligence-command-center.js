import { commandCenterData } from "./command-center-data.js";

const mount = document.querySelector("#intelligence-command-center");
const runtimeDataUrl = "/runtime/command-center-data.json";

if (!mount) {
  throw new Error("Missing intelligence command center mount node.");
}

const candidates = [
  {
    symbol: "EUR/USD",
    setup: "Trend continuation pullback",
    timeframe: "D1 / H4 / H1",
    bias: "Bullish",
    score: 82,
    state: "PAPER_SIMULATE",
    stateClass: "paper"
  },
  {
    symbol: "XAU/USD",
    setup: "Range-break retest",
    timeframe: "H4 / H1",
    bias: "Neutral",
    score: 68,
    state: "WATCH",
    stateClass: "watch"
  },
  {
    symbol: "BTC/USD",
    setup: "Momentum recovery",
    timeframe: "D1 / H4",
    bias: "Mixed",
    score: 54,
    state: "REJECT",
    stateClass: "reject"
  }
];

const selected = candidates[0];

render(commandCenterData);
void refreshRuntimeStatus();

async function refreshRuntimeStatus() {
  try {
    const response = await fetch(runtimeDataUrl, { cache: "no-store" });
    if (!response.ok) return;
    const runtime = await response.json();
    render({ ...commandCenterData, ...runtime });
  } catch {
    // The checked-in command-center data remains the local fallback.
  }
}

function render(data) {
  const backtest = data.strategyReviewWorkspace?.backtestRunEvidence ?? {};
  const brief = data.marketIntelligenceWorkspace?.intelligenceBrief ?? {};
  const riskReview = data.marketIntelligenceWorkspace?.riskReview ?? {};

  mount.innerHTML = `
    <div class="command-shell">
      <aside class="command-rail" aria-label="TraderFrame command navigation">
        <a href="#overview" aria-label="TraderFrame intelligence command center home">
          <img class="brand-lockup" src="./assets/traderframe-horizontal-lockup.svg" alt="TraderFrame — Research first. Risk framed. Execution controlled." />
        </a>
        <nav class="rail-nav" aria-label="Primary workspace sections">
          ${[
            ["overview", "Market Overview"],
            ["candidates", "Candidate Queue"],
            ["setup-review", "Setup Review"],
            ["evidence", "Evidence"],
            ["risk", "Risk & Exposure"],
            ["system-health", "System Health"]
          ]
            .map(
              ([id, label], index) =>
                `<a class="${index === 0 ? "active" : ""}" href="#${id}" data-nav="${id}">${label}</a>`
            )
            .join("")}
        </nav>
        <div class="rail-boundary">
          <span class="eyebrow">Operating boundary</span>
          <strong>${escapeText(data.gate ?? "G2_PAPER_TRADING")}</strong>
          <small>Local evidence and paper-simulation planning only. No external execution route.</small>
        </div>
      </aside>

      <main class="command-main" id="main" tabindex="-1">
        <header class="command-topbar" id="overview">
          <div>
            <span class="eyebrow">Trading Intelligence Command Center</span>
            <h1>Frame the highest-quality setup.</h1>
            <p>Market context, contradicting evidence, deterministic research, and risk constraints are reviewed together before any paper-simulation decision.</p>
          </div>
          <div class="status-cluster" aria-label="System status">
            <span class="status-pill">Local evidence</span>
            <span class="status-pill">Risk review required</span>
            <span class="status-pill">Operator controlled</span>
          </div>
        </header>

        <section class="metric-grid" aria-label="Market operating overview">
          ${metricCard("Session", "London → New York", "Overlap approaching; liquidity expected to rise.", "accent")}
          ${metricCard("Volatility", "Moderate", "Event risk remains visible in the setup review.", "warning")}
          ${metricCard("Broad bias", "Selective risk-on", "USD softness is not uniform across instruments.")}
          ${metricCard("Top candidate", `${selected.symbol} · ${selected.score}`, "Evidence supports review, not certainty.", "accent")}
        </section>

        <div class="dashboard-grid">
          <div class="stack">
            <section class="panel" aria-labelledby="market-overview-title">
              <div class="panel-heading">
                <div>
                  <span class="panel-label">Market map</span>
                  <h2 id="market-overview-title">Session, regime, and cross-market context</h2>
                </div>
                <span class="state-pill watch">Conditional</span>
              </div>
              <div class="panel-body market-strip">
                ${marketCell("USD", "Softening", "Short-term weakness, but event sensitivity remains high.")}
                ${marketCell("Rates", "Stable", "No material local evidence of a fresh rate shock.")}
                ${marketCell("Risk assets", "Constructive", "Momentum is positive but participation is uneven.")}
                ${marketCell("Correlation", "Contained", "No portfolio concentration blocker is recorded.")}
              </div>
            </section>

            <section class="panel" id="candidates" aria-labelledby="candidate-title">
              <div class="panel-heading">
                <div>
                  <span class="panel-label">Candidate queue</span>
                  <h2 id="candidate-title">Ranked by evidence quality and risk readiness</h2>
                </div>
                <span class="score-chip">3 setups</span>
              </div>
              <div class="panel-body candidate-list">
                ${candidates.map(renderCandidate).join("")}
              </div>
            </section>

            <section class="panel" id="setup-review" aria-labelledby="setup-review-title">
              <div class="panel-heading">
                <div>
                  <span class="panel-label">Evidence-gated setup review</span>
                  <h2 id="setup-review-title">Selected candidate</h2>
                </div>
                <span class="score-chip">Score ${selected.score}</span>
              </div>
              <div class="panel-body">
                <div class="setup-hero">
                  <div>
                    <span class="mini-label">${selected.symbol} · ${selected.timeframe}</span>
                    <div class="setup-title">${selected.setup}</div>
                    <p class="setup-copy">Daily and four-hour structure remain aligned while the one-hour pullback holds above the current invalidation area. The setup remains conditional because high-impact macro risk can alter short-term volatility.</p>
                    <div class="tag-row">
                      <span class="tag">Multi-timeframe aligned</span>
                      <span class="tag">Declared costs applied</span>
                      <span class="tag">Operator decision required</span>
                    </div>
                  </div>
                  <div class="decision-block">
                    <span class="mini-label">Recommendation</span>
                    <strong>${selected.state}</strong>
                    <small>Paper evidence only</small>
                  </div>
                </div>

                <div class="evidence-grid" id="evidence">
                  <article class="evidence-card support">
                    <h3>Supporting evidence</h3>
                    <ul>
                      <li>Daily and H4 trend structure are directionally aligned.</li>
                      <li>H1 pullback remains above the latest protected structure low.</li>
                      <li>Historical runner applies spread, slippage, and commission assumptions.</li>
                    </ul>
                  </article>
                  <article class="evidence-card counter">
                    <h3>Contradicting evidence</h3>
                    <ul>
                      <li>A high-impact macro event may invalidate short-term structure.</li>
                      <li>Historical evidence represents one strategy family and one local dataset.</li>
                      <li>No real-time order-flow or external market-access evidence is present.</li>
                    </ul>
                  </article>
                </div>

                <div class="invalidation">
                  <strong>Mandatory invalidation</strong>
                  <p>Reject or exit the paper setup if the EUR/USD one-hour candle closes below 1.0800. The invalidation is observable and must not be moved after the decision record is frozen.</p>
                </div>
              </div>
            </section>
          </div>

          <div class="stack">
            <section class="panel" id="risk" aria-labelledby="risk-title">
              <div class="panel-heading">
                <div>
                  <span class="panel-label">Risk & exposure</span>
                  <h2 id="risk-title">Risk before reward</h2>
                </div>
                <span class="state-pill paper">Within limit</span>
              </div>
              <div class="panel-body risk-grid">
                ${riskCard("Account risk", "$55", "0.55% of a $10,000 paper account")}
                ${riskCard("Risk ceiling", "$100", "Maximum declared risk: 1.00%")}
                ${riskCard("Exposure after entry", "12%", "No correlation warning recorded")}
                ${riskCard("Reward / risk", "2.0R", "Target is informational, not a performance claim")}
              </div>
            </section>

            <section class="panel" aria-labelledby="ai-evidence-title">
              <div class="panel-heading">
                <div>
                  <span class="panel-label">AI evidence panel</span>
                  <h2 id="ai-evidence-title">Bull, bear, and neutral cases</h2>
                </div>
                <span class="state-pill watch">Review</span>
              </div>
              <div class="panel-body">
                <div class="system-list">
                  ${systemRow("Bull case", "Trend alignment and controlled pullback support continuation.")}
                  ${systemRow("Bear case", "Macro volatility can break the H1 structure and invalidate the thesis.")}
                  ${systemRow("Neutral case", "Wait for a cleaner post-event structure confirmation.")}
                  ${systemRow("Confidence", "Moderate · evidence-limited")}
                </div>
              </div>
            </section>

            <section class="panel" id="system-health" aria-labelledby="system-title">
              <div class="panel-heading">
                <div>
                  <span class="panel-label">System health</span>
                  <h2 id="system-title">Evidence and control-plane status</h2>
                </div>
                <span class="state-pill paper">Healthy</span>
              </div>
              <div class="panel-body system-list">
                ${systemRow("Verification", escapeText(data.localVerification ?? "Not recorded"))}
                ${systemRow("Latest packet", escapeText(data.latestPacket ?? "Not recorded"))}
                ${systemRow("CI state", escapeText(data.ciState ?? "Not recorded"))}
                ${systemRow("Backtest", escapeText(backtest.reproducibilityStatus ?? "not checked"))}
                ${systemRow("Brief", escapeText(brief.status ?? "not recorded"))}
                ${systemRow("Risk review", escapeText(riskReview.disposition ?? "required"))}
              </div>
            </section>
          </div>
        </div>

        <footer class="command-footer">
          <span>Research the trade. Frame the risk. Execute only when allowed.</span>
          <span>${escapeText(data.scope ?? "paper_simulation_planning_only")}</span>
        </footer>
      </main>
    </div>
  `;

  bindNavigation();
}

function metricCard(label, value, detail, tone = "") {
  return `<article class="metric-card ${tone}"><span class="metric-label">${label}</span><strong>${value}</strong><p>${detail}</p></article>`;
}

function marketCell(label, value, detail) {
  return `<article class="market-cell"><span class="mini-label">${label}</span><strong>${value}</strong><small>${detail}</small></article>`;
}

function riskCard(label, value, detail) {
  return `<article class="risk-card"><span class="mini-label">${label}</span><strong class="risk-value">${value}</strong><small>${detail}</small></article>`;
}

function systemRow(label, value) {
  return `<div class="system-row"><span>${label}</span><strong>${value}</strong></div>`;
}

function renderCandidate(candidate, index) {
  return `
    <article class="candidate-row ${index === 0 ? "selected" : ""}">
      <div><span class="mini-label">${candidate.symbol}</span><strong class="candidate-name">${candidate.setup}</strong></div>
      <div><span class="mini-label">Timeframes</span><small>${candidate.timeframe}</small></div>
      <div><span class="mini-label">Bias</span><small>${candidate.bias}</small></div>
      <span class="score-chip">${candidate.score}</span>
      <span class="state-pill ${candidate.stateClass}">${candidate.state}</span>
    </article>
  `;
}

function bindNavigation() {
  const links = [...document.querySelectorAll("[data-nav]")];
  const update = () => {
    const current = window.location.hash.replace("#", "") || "overview";
    for (const link of links) {
      link.classList.toggle("active", link.dataset.nav === current);
    }
  };
  window.addEventListener("hashchange", update, { once: true });
  update();
}

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
