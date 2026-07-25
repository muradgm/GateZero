import React, { useMemo, useState } from "react";

const candidates = [
  {
    id: "eurusd",
    instrument: "EUR/USD",
    market: "FX",
    score: 84,
    recommendation: "PAPER_SIMULATE",
    confidence: "High",
    session: "London / New York overlap",
    volatility: "Normal",
    trend: "Bullish",
    structure: "Pullback",
    momentum: "Stable",
    pipeline: "operator_decision",
    invalidation: "Reject below the confirmed 1H structure low at 1.0800.",
    risk: { amount: "$55", ceiling: "$100", exposure: "12%", rewardRisk: "2.0R" },
    contributions: [
      ["Trend", 18, "Daily and 4H structure remain aligned."],
      ["Market structure", 16, "The 1H pullback holds above the prior expansion base."],
      ["Liquidity", 10, "Nearby sell-side liquidity has already been tested."],
      ["Momentum", 7, "Momentum is stable rather than accelerating."],
      ["Macro", -5, "US data risk remains inside the review window."],
      ["Correlation", -2, "Existing USD exposure limits additional conviction."]
    ],
    bull: [
      "Daily and 4H direction agree",
      "Pullback remains structurally valid",
      "Risk remains below account ceiling"
    ],
    bear: ["Macro event can invalidate the timing", "Momentum is not yet strengthening"],
    neutral: ["Wait for the defined 1H trigger", "Do not infer approval from the score"],
    timeline: [
      ["08:00", "London session opened", "info"],
      ["09:10", "Sell-side liquidity tested", "info"],
      ["10:00", "Evidence bundle refreshed", "info"],
      ["11:00", "Risk review linked", "attention"],
      ["11:20", "Operator decision pending", "attention"]
    ]
  },
  {
    id: "btcusd",
    instrument: "BTC/USD",
    market: "Crypto",
    score: 76,
    recommendation: "WATCH",
    confidence: "Moderate",
    session: "Continuous",
    volatility: "Elevated",
    trend: "Bullish",
    structure: "Expansion",
    momentum: "Weakening",
    pipeline: "risk_review",
    invalidation: "Reject if price closes below the 4H expansion base.",
    risk: { amount: "$70", ceiling: "$100", exposure: "19%", rewardRisk: "1.7R" },
    contributions: [
      ["Trend", 17, "Higher-timeframe trend remains positive."],
      ["Market structure", 13, "Expansion is intact but extended."],
      ["Momentum", -8, "Momentum has weakened into resistance."],
      ["Liquidity", 8, "Liquidity remains available below the current range."],
      ["Event risk", -4, "Weekend liquidity conditions remain uncertain."]
    ],
    bull: ["Higher-timeframe trend is intact", "Structure has not broken"],
    bear: ["Momentum is weakening", "Current location is extended"],
    neutral: ["Wait for a retracement", "Keep the case in review"],
    timeline: [
      ["07:30", "Context snapshot created", "info"],
      ["09:40", "Momentum downgrade recorded", "attention"],
      ["10:30", "Risk review requested", "attention"]
    ]
  },
  {
    id: "xauusd",
    instrument: "XAU/USD",
    market: "Metals",
    score: 48,
    recommendation: "REJECT",
    confidence: "Low",
    session: "New York",
    volatility: "Event risk",
    trend: "Mixed",
    structure: "Range",
    momentum: "Conflicted",
    pipeline: "outcome",
    invalidation: "No valid entry exists while the range and event risk remain unresolved.",
    risk: { amount: "$0", ceiling: "$100", exposure: "0%", rewardRisk: "—" },
    contributions: [
      ["Trend", 4, "Weekly trend is constructive but lower frames disagree."],
      ["Market structure", -12, "Price remains inside an unresolved range."],
      ["Event risk", -16, "High-impact macro risk dominates the setup."],
      ["Correlation", -3, "USD concentration is already elevated."],
      ["Risk", -5, "No defensible stop placement is available."]
    ],
    bull: ["Weekly trend remains constructive"],
    bear: ["Range structure is unresolved", "Event risk is high", "Stop placement is weak"],
    neutral: ["Record the rejection", "Reassess only after context changes"],
    timeline: [
      ["08:15", "Candidate created", "info"],
      ["09:00", "Event-risk blocker added", "blocking"],
      ["09:20", "Operator rejected setup", "blocking"]
    ]
  }
];

const pipelineStages = [
  "research_case",
  "market_context",
  "evidence_assessment",
  "setup_review",
  "intelligence_report",
  "risk_review",
  "operator_decision",
  "paper_simulation",
  "outcome",
  "learning"
];

function BrandMark() {
  return (
    <svg viewBox="0 0 128 128" aria-label="TraderFrame symbol" role="img">
      <path d="M20 22h84v18H72v66H52V40H20z" fill="currentColor" />
      <path d="M20 22h18v84H20z" fill="currentColor" />
      <path d="M38 58h54v18H38z" fill="#7C5CFF" />
      <path d="M52 40h20v66H52z" fill="#00C6A7" />
    </svg>
  );
}

function Recommendation({ value }) {
  return (
    <span className={`recommendation recommendation--${value.toLowerCase()}`}>
      {value.replace("_", " ")}
    </span>
  );
}

export function App() {
  const [selectedId, setSelectedId] = useState(candidates[0].id);
  const selected = useMemo(
    () => candidates.find((candidate) => candidate.id === selectedId) ?? candidates[0],
    [selectedId]
  );
  const currentStageIndex = pipelineStages.indexOf(selected.pipeline);

  return (
    <div className="workspace-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-symbol">
            <BrandMark />
          </div>
          <div>
            <div className="brand-name">
              TRADER<span>FRAME</span>
            </div>
            <div className="brand-tagline">Decision intelligence workspace</div>
          </div>
        </div>
        <div className="topbar-status">
          <span className="status-dot" />
          <span>G2 paper-simulation planning</span>
          <kbd>⌘ K</kbd>
        </div>
      </header>

      <main className="workspace-grid">
        <aside className="watchlist panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Ranked queue</span>
              <h2>Watchlist</h2>
            </div>
            <span className="count">{candidates.length}</span>
          </div>
          <div className="candidate-list">
            {candidates.map((candidate, index) => (
              <button
                key={candidate.id}
                type="button"
                className={`candidate ${candidate.id === selected.id ? "candidate--active" : ""}`}
                onClick={() => setSelectedId(candidate.id)}
              >
                <span className="candidate-rank">0{index + 1}</span>
                <span className="candidate-main">
                  <strong>{candidate.instrument}</strong>
                  <small>
                    {candidate.market} · {candidate.trend}
                  </small>
                </span>
                <span className="candidate-score">{candidate.score}</span>
                <Recommendation value={candidate.recommendation} />
              </button>
            ))}
          </div>
          <div className="boundary-note">
            <strong>Evidence only</strong>
            <p>No broker connection, live order routing, or automated action.</p>
          </div>
        </aside>

        <section className="market-column">
          <section className="market-hero panel">
            <div className="market-title-row">
              <div>
                <span className="eyebrow">Selected candidate</span>
                <h1>{selected.instrument}</h1>
                <p>{selected.session}</p>
              </div>
              <div className="score-lockup">
                <div className="score-ring" style={{ "--score": selected.score }}>
                  <strong>{selected.score}</strong>
                  <span>Evidence</span>
                </div>
                <Recommendation value={selected.recommendation} />
              </div>
            </div>
            <div className="market-metrics">
              <Metric label="Trend" value={selected.trend} />
              <Metric label="Structure" value={selected.structure} />
              <Metric label="Momentum" value={selected.momentum} />
              <Metric label="Volatility" value={selected.volatility} />
            </div>
            <div className="chart-surface" aria-label="Placeholder market structure visualization">
              <svg
                viewBox="0 0 900 280"
                preserveAspectRatio="none"
                role="img"
                aria-label="Abstract market structure line"
              >
                <defs>
                  <linearGradient id="area" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#7C5CFF" stopOpacity="0.32" />
                    <stop offset="1" stopColor="#7C5CFF" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 220 C80 205 90 155 160 174 S260 212 315 146 S420 102 470 133 S565 170 620 108 S745 66 900 82 L900 280 L0 280 Z"
                  fill="url(#area)"
                />
                <path
                  d="M0 220 C80 205 90 155 160 174 S260 212 315 146 S420 102 470 133 S565 170 620 108 S745 66 900 82"
                  fill="none"
                  stroke="#9B87FF"
                  strokeWidth="3"
                />
                <line
                  x1="0"
                  x2="900"
                  y1="178"
                  y2="178"
                  stroke="#00C6A7"
                  strokeDasharray="8 8"
                  opacity="0.7"
                />
                <line
                  x1="0"
                  x2="900"
                  y1="232"
                  y2="232"
                  stroke="#FF8A00"
                  strokeDasharray="8 8"
                  opacity="0.7"
                />
              </svg>
              <div className="chart-label chart-label--trigger">Trigger zone</div>
              <div className="chart-label chart-label--invalid">Invalidation</div>
            </div>
          </section>

          <section className="pipeline panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Protected loop</span>
                <h2>Decision pipeline</h2>
              </div>
              <span className="stage-name">{selected.pipeline.replaceAll("_", " ")}</span>
            </div>
            <div className="pipeline-track">
              {pipelineStages.map((stage, index) => {
                const status =
                  index < currentStageIndex
                    ? "complete"
                    : index === currentStageIndex
                      ? "current"
                      : selected.recommendation !== "PAPER_SIMULATE" && stage === "paper_simulation"
                        ? "skipped"
                        : "pending";
                return (
                  <div
                    key={stage}
                    className={`pipeline-step pipeline-step--${status}`}
                    title={stage.replaceAll("_", " ")}
                  >
                    <span>{index + 1}</span>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="bottom-grid">
            <section className="risk-panel panel">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">Risk frame</span>
                  <h2>Capital impact</h2>
                </div>
              </div>
              <div className="risk-grid">
                <Metric label="Planned loss" value={selected.risk.amount} />
                <Metric label="Risk ceiling" value={selected.risk.ceiling} />
                <Metric label="Exposure after" value={selected.risk.exposure} />
                <Metric label="Reward / risk" value={selected.risk.rewardRisk} />
              </div>
              <div className="invalidation">
                <span>Mandatory invalidation</span>
                <p>{selected.invalidation}</p>
              </div>
            </section>

            <section className="timeline-panel panel">
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">Reasoning replay</span>
                  <h2>Timeline</h2>
                </div>
              </div>
              <div className="timeline-list">
                {selected.timeline.map(([time, label, severity]) => (
                  <div
                    className={`timeline-event timeline-event--${severity}`}
                    key={`${time}-${label}`}
                  >
                    <time>{time}</time>
                    <span />
                    <p>{label}</p>
                  </div>
                ))}
              </div>
            </section>
          </section>
        </section>

        <aside className="intelligence-column">
          <section className="cases panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Decision challenge</span>
                <h2>Intelligence cases</h2>
              </div>
              <span className="confidence">{selected.confidence}</span>
            </div>
            <Case title="Bull" items={selected.bull} tone="positive" />
            <Case title="Bear" items={selected.bear} tone="negative" />
            <Case title="Neutral" items={selected.neutral} tone="neutral" />
          </section>

          <section className="evidence-tree panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">Explainability</span>
                <h2>Evidence tree</h2>
              </div>
              <strong className="tree-total">{selected.score}</strong>
            </div>
            <div className="contributions">
              {selected.contributions.map(([label, points, rationale]) => (
                <details key={label} className="contribution">
                  <summary>
                    <span>{label}</span>
                    <strong className={points >= 0 ? "positive" : "negative"}>
                      {points >= 0 ? "+" : ""}
                      {points}
                    </strong>
                  </summary>
                  <p>{rationale}</p>
                </details>
              ))}
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Case({ title, items, tone }) {
  return (
    <section className={`case case--${tone}`}>
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
