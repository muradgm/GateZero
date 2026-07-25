import React, { useEffect, useMemo, useState } from "react";

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
      {value.replaceAll("_", " ")}
    </span>
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

function LoadingState({ error }) {
  return (
    <div className="workspace-shell workspace-state">
      <div className="panel workspace-state-card">
        <BrandMark />
        <span className="eyebrow">Decision intelligence workspace</span>
        <h1>{error ? "Workspace data unavailable" : "Loading repository evidence"}</h1>
        <p>
          {error
            ? "Generate the local workspace snapshot and reload the page. No fallback recommendation is shown."
            : "Loading ranked candidates, evidence contributions, risk context, and pipeline state."}
        </p>
        {error ? <code>pnpm generate:workspace-data</code> : null}
      </div>
    </div>
  );
}

export function AppRuntime() {
  const [workspace, setWorkspace] = useState(null);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    let active = true;
    fetch("/runtime/workspace-data.json", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("workspace data unavailable");
        return response.json();
      })
      .then((data) => {
        if (!active) return;
        setWorkspace(data);
        setSelectedId(data.candidates?.[0]?.id ?? null);
      })
      .catch(() => {
        if (active) setError(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const selected = useMemo(() => {
    if (!workspace) return null;
    return workspace.candidates.find((candidate) => candidate.id === selectedId) ?? workspace.candidates[0];
  }, [workspace, selectedId]);

  if (!workspace || !selected) return <LoadingState error={error} />;

  const report = selected.report;
  const pipeline = selected.pipeline;
  const currentStageIndex = pipelineStages.indexOf(pipeline.currentStage);

  return (
    <div className="workspace-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-symbol"><BrandMark /></div>
          <div>
            <div className="brand-name">TRADER<span>FRAME</span></div>
            <div className="brand-tagline">Decision intelligence workspace</div>
          </div>
        </div>
        <div className="topbar-status">
          <span className="status-dot" />
          <span>{workspace.boundary.gate.replaceAll("_", " ")}</span>
          <small>{workspace.source}</small>
        </div>
      </header>

      <main className="workspace-grid">
        <aside className="watchlist panel">
          <div className="panel-heading">
            <div><span className="eyebrow">Ranked queue</span><h2>Watchlist</h2></div>
            <span className="count">{workspace.candidates.length}</span>
          </div>
          <div className="candidate-list">
            {workspace.candidates.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                className={`candidate ${candidate.id === selected.id ? "candidate--active" : ""}`}
                onClick={() => setSelectedId(candidate.id)}
              >
                <span className="candidate-rank">{String(candidate.rank).padStart(2, "0")}</span>
                <span className="candidate-main">
                  <strong>{candidate.instrument}</strong>
                  <small>{candidate.market} · {candidate.context.trend}</small>
                </span>
                <span className="candidate-score">{candidate.report.evidenceScore}</span>
                <Recommendation value={candidate.report.recommendation} />
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
                <p>{selected.context.session}</p>
              </div>
              <div className="score-lockup">
                <div className="score-ring" style={{ "--score": report.evidenceScore }}>
                  <strong>{report.evidenceScore}</strong><span>Evidence</span>
                </div>
                <Recommendation value={report.recommendation} />
              </div>
            </div>
            <div className="market-metrics">
              <Metric label="Trend" value={selected.context.trend} />
              <Metric label="Structure" value={selected.context.structure} />
              <Metric label="Momentum" value={selected.context.momentum} />
              <Metric label="Volatility" value={selected.context.volatility} />
            </div>
            <div className="chart-surface" aria-label="Decision context visualization">
              <svg viewBox="0 0 900 280" preserveAspectRatio="none" role="img" aria-label="Abstract market structure line">
                <defs><linearGradient id="area-runtime" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#7C5CFF" stopOpacity="0.32" /><stop offset="1" stopColor="#7C5CFF" stopOpacity="0" /></linearGradient></defs>
                <path d="M0 220 C80 205 90 155 160 174 S260 212 315 146 S420 102 470 133 S565 170 620 108 S745 66 900 82 L900 280 L0 280 Z" fill="url(#area-runtime)" />
                <path d="M0 220 C80 205 90 155 160 174 S260 212 315 146 S420 102 470 133 S565 170 620 108 S745 66 900 82" fill="none" stroke="#9B87FF" strokeWidth="3" />
                <line x1="0" x2="900" y1="178" y2="178" stroke="#00C6A7" strokeDasharray="8 8" opacity="0.7" />
                <line x1="0" x2="900" y1="232" y2="232" stroke="#FF8A00" strokeDasharray="8 8" opacity="0.7" />
              </svg>
              <div className="chart-label chart-label--trigger">Review zone</div>
              <div className="chart-label chart-label--invalid">Invalidation</div>
            </div>
          </section>

          <section className="pipeline panel">
            <div className="panel-heading">
              <div><span className="eyebrow">Protected loop</span><h2>Decision pipeline</h2></div>
              <span className="stage-name">{pipeline.currentStage.replaceAll("_", " ")}</span>
            </div>
            <div className="pipeline-track">
              {pipelineStages.map((stage, index) => {
                const record = pipeline.stages.find((item) => item.stage === stage);
                const status = record?.status === "not_applicable" ? "skipped" : index < currentStageIndex ? "complete" : index === currentStageIndex ? "current" : "pending";
                return <div key={stage} className={`pipeline-step pipeline-step--${status}`} title={`${stage.replaceAll("_", " ")} · ${record?.status ?? "pending"}`}><span>{index + 1}</span></div>;
              })}
            </div>
          </section>

          <section className="bottom-grid">
            <section className="risk-panel panel">
              <div className="panel-heading"><div><span className="eyebrow">Risk frame</span><h2>Capital impact</h2></div></div>
              <div className="risk-grid">
                <Metric label="Planned loss" value={selected.risk.amount} />
                <Metric label="Risk ceiling" value={selected.risk.ceiling} />
                <Metric label="Exposure after" value={selected.risk.exposure} />
                <Metric label="Reward / risk" value={selected.risk.rewardRisk} />
              </div>
              <div className="invalidation"><span>Mandatory invalidation</span><p>{selected.invalidation}</p></div>
            </section>

            <section className="timeline-panel panel">
              <div className="panel-heading"><div><span className="eyebrow">Reasoning replay</span><h2>Timeline</h2></div></div>
              <div className="timeline-list">
                {report.timeline.map((event) => (
                  <div className={`timeline-event timeline-event--${event.severity}`} key={event.eventId}>
                    <time>{new Date(event.occurredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
                    <span />
                    <div><strong>{event.title}</strong><small>{event.summary}</small></div>
                  </div>
                ))}
              </div>
            </section>
          </section>
        </section>

        <aside className="intelligence-column">
          <section className="intelligence-summary panel">
            <div className="panel-heading">
              <div><span className="eyebrow">Explainable reasoning</span><h2>Intelligence</h2></div>
              <span className="confidence">{report.confidence}</span>
            </div>
            <CaseBlock title="Bull case" className="case--bull" summary={report.bullCase.summary} limitations={report.bullCase.limitations} />
            <CaseBlock title="Bear case" className="case--bear" summary={report.bearCase.summary} limitations={report.bearCase.limitations} />
            <CaseBlock title="Neutral" className="case--neutral" summary={report.neutralCase.summary} limitations={report.neutralCase.limitations} />
          </section>

          <section className="evidence-panel panel">
            <div className="panel-heading"><div><span className="eyebrow">Contribution ledger</span><h2>Evidence tree</h2></div><strong>{report.evidenceScore}</strong></div>
            <div className="contribution-list">
              {report.contributions.map((contribution) => (
                <details key={contribution.contributionId} className={`contribution contribution--${contribution.points >= 0 ? "positive" : "negative"}`}>
                  <summary><span>{contribution.label}</span><strong>{contribution.points > 0 ? "+" : ""}{contribution.points}</strong></summary>
                  <p>{contribution.rationale}</p>
                  <small>{contribution.limitation}</small>
                  <code>{contribution.evidenceIds.join(" · ")}</code>
                </details>
              ))}
            </div>
            {report.downgradeReasons.length > 0 ? (
              <div className="downgrade-reasons"><strong>Downgrade reasons</strong>{report.downgradeReasons.map((reason) => <p key={reason}>{reason}</p>)}</div>
            ) : null}
          </section>
        </aside>
      </main>
    </div>
  );
}

function CaseBlock({ title, className, summary, limitations }) {
  return (
    <article className={`case-block ${className}`}>
      <h3>{title}</h3><p>{summary}</p><small>{limitations.join(" ")}</small>
    </article>
  );
}
