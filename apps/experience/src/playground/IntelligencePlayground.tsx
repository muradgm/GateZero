import { useMemo, useState } from "react";
import { evaluateIntelligence, type IntelligenceSignal } from "../engine/intelligence";
import { baseTimestamp, sampleSignals } from "./sampleSignals";

const categoryLabel: Record<IntelligenceSignal["category"], string> = {
  "market-structure": "Structure",
  "macro-event": "Macro",
  news: "News",
  sentiment: "Sentiment",
  flow: "Flow",
  technical: "Technical",
  risk: "Risk"
};

const percent = (value: number) => `${Math.round(value * 100)}%`;

export function IntelligencePlayground() {
  const [ageHours, setAgeHours] = useState(0);
  const [contradictionBoost, setContradictionBoost] = useState(0);
  const [riskBoost, setRiskBoost] = useState(0);

  const adjustedSignals = useMemo(
    () =>
      sampleSignals.map((signal) => ({
        ...signal,
        contradiction: Math.min(1, signal.contradiction + contradictionBoost),
        riskImpact: Math.min(1, signal.riskImpact + riskBoost)
      })),
    [contradictionBoost, riskBoost]
  );

  const state = useMemo(
    () => evaluateIntelligence(adjustedSignals, baseTimestamp + ageHours * 3_600_000),
    [adjustedSignals, ageHours]
  );

  const dominantDirection = Object.entries(state.directionalBalance).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "neutral";

  return (
    <section className="intelligence-playground" aria-labelledby="playground-title">
      <header className="playground-header">
        <div>
          <p className="eyebrow">Conviction Atlas / Intelligence Engine</p>
          <h1 id="playground-title">Watch the thesis form.</h1>
          <p>
            This playground exposes the semantic layer before terrain exists. Signals merge by category,
            decay over time, carry contradiction and risk, and produce route weights for the future landscape.
          </p>
        </div>
        <div className="playground-verdict" aria-live="polite">
          <span>Current directional thesis</span>
          <strong>{dominantDirection}</strong>
          <em>{percent(state.confidence)} confidence · {percent(state.risk)} risk</em>
        </div>
      </header>

      <div className="playground-controls" aria-label="Intelligence simulation controls">
        <label>
          <span>Time elapsed</span>
          <strong>{ageHours}h</strong>
          <input type="range" min="0" max="48" value={ageHours} onChange={(event) => setAgeHours(Number(event.target.value))} />
        </label>
        <label>
          <span>Contradiction pressure</span>
          <strong>{percent(contradictionBoost)}</strong>
          <input type="range" min="0" max="0.5" step="0.01" value={contradictionBoost} onChange={(event) => setContradictionBoost(Number(event.target.value))} />
        </label>
        <label>
          <span>Risk pressure</span>
          <strong>{percent(riskBoost)}</strong>
          <input type="range" min="0" max="0.5" step="0.01" value={riskBoost} onChange={(event) => setRiskBoost(Number(event.target.value))} />
        </label>
      </div>

      <div className="intelligence-summary">
        <article><span>Confidence</span><strong>{percent(state.confidence)}</strong></article>
        <article><span>Freshness</span><strong>{percent(state.freshness)}</strong></article>
        <article><span>Contradiction</span><strong>{percent(state.contradiction)}</strong></article>
        <article><span>Risk</span><strong>{percent(state.risk)}</strong></article>
      </div>

      <div className="thread-field" role="img" aria-label="Semantic intelligence threads converging into category clusters">
        <svg viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="thread-cyan" x1="0" x2="1"><stop stopColor="#1f4c58"/><stop offset="1" stopColor="#53e6ff"/></linearGradient>
            <linearGradient id="thread-amber" x1="0" x2="1"><stop stopColor="#5d4323"/><stop offset="1" stopColor="#ffb657"/></linearGradient>
            <linearGradient id="thread-violet" x1="0" x2="1"><stop stopColor="#34274f"/><stop offset="1" stopColor="#a889ff"/></linearGradient>
          </defs>
          {state.signals.map((signal, index) => {
            const y = 58 + index * 62;
            const clusterIndex = state.clusters.findIndex((cluster) => cluster.category === signal.category);
            const targetY = 52 + clusterIndex * (410 / Math.max(1, state.clusters.length - 1));
            const stroke = signal.riskImpact > 0.6 || signal.contradiction > 0.55 ? "url(#thread-amber)" : signal.bias === "bullish" ? "url(#thread-cyan)" : "url(#thread-violet)";
            return (
              <g key={signal.id}>
                <path d={`M 40 ${y} C 250 ${y}, 300 ${targetY}, 525 ${targetY}`} fill="none" stroke={stroke} strokeWidth={2 + signal.effectiveWeight * 8} opacity={0.28 + signal.freshness * 0.72} />
                <circle cx="40" cy={y} r={4 + signal.importance * 5} fill="currentColor" opacity={0.65} />
                <text x="58" y={y - 10}>{signal.source}</text>
              </g>
            );
          })}
          {state.clusters.map((cluster, index) => {
            const y = 52 + index * (410 / Math.max(1, state.clusters.length - 1));
            return (
              <g key={cluster.id}>
                <circle cx="550" cy={y} r={10 + cluster.routeWeight * 24} className="cluster-node" opacity={0.28 + cluster.support * 0.72} />
                <path d={`M 570 ${y} C 760 ${y}, 785 ${260 + (cluster.dominantBias === "bullish" ? -70 : cluster.dominantBias === "bearish" ? 70 : 0)}, 975 260`} fill="none" stroke={cluster.riskImpact > 0.55 ? "url(#thread-amber)" : "url(#thread-cyan)"} strokeWidth={2 + cluster.routeWeight * 10} opacity={0.25 + cluster.routeWeight * 0.75} />
                <text x="590" y={y - 12}>{categoryLabel[cluster.category]}</text>
                <text x="590" y={y + 10} className="thread-meta">{cluster.dominantBias} · route {percent(cluster.routeWeight)}</text>
              </g>
            );
          })}
          <circle cx="1000" cy="260" r={36 + state.confidence * 54} className="thesis-node" opacity={0.35 + state.confidence * 0.65} />
          <text x="1000" y="255" textAnchor="middle" className="thesis-label">THESIS</text>
          <text x="1000" y="278" textAnchor="middle" className="thread-meta">{dominantDirection}</text>
        </svg>
      </div>

      <div className="cluster-grid">
        {state.clusters.map((cluster) => (
          <article key={cluster.id}>
            <header><span>{categoryLabel[cluster.category]}</span><strong>{cluster.dominantBias}</strong></header>
            <dl>
              <div><dt>Support</dt><dd>{percent(cluster.support)}</dd></div>
              <div><dt>Route weight</dt><dd>{percent(cluster.routeWeight)}</dd></div>
              <div><dt>Contradiction</dt><dd>{percent(cluster.contradiction)}</dd></div>
              <div><dt>Risk impact</dt><dd>{percent(cluster.riskImpact)}</dd></div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}
