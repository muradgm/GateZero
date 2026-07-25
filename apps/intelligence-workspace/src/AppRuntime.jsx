import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  EvidenceRow,
  Metric,
  Panel,
  PanelHeading,
  RecommendationBadge,
  WatchlistCard
} from "@traderframe/ui";
import { PriceChart } from "./PriceChart.jsx";

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

function LoadingState({ error }) {
  return (
    <div className="workspace-shell workspace-state">
      <Panel className="workspace-state-card">
        <BrandMark />
        <span className="tf-eyebrow">Decision intelligence workspace</span>
        <h1>{error ? "Workspace data unavailable" : "Loading repository evidence"}</h1>
        <p>
          {error
            ? "Generate the local workspace snapshot and reload the page. No fallback recommendation is shown."
            : "Loading ranked candidates, evidence contributions, risk context, and pipeline state."}
        </p>
        {error ? <code>pnpm generate:workspace-data</code> : null}
      </Panel>
    </div>
  );
}

export function AppRuntime() {
  const [workspace, setWorkspace] = useState(null);
  const [error, setError] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [focusedTime, setFocusedTime] = useState(null);

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

  function selectCandidate(id) {
    setSelectedId(id);
    setFocusedTime(null);
  }

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
        <Panel as="aside" className="watchlist">
          <PanelHeading
            eyebrow="Ranked queue"
            title="Watchlist"
            aside={<Badge>{workspace.candidates.length}</Badge>}
          />
          <div className="candidate-list candidate-list--cards">
            {workspace.candidates.map((candidate) => (
              <WatchlistCard
                key={candidate.id}
                candidate={candidate}
                active={candidate.id === selected.id}
                onSelect={() => selectCandidate(candidate.id)}
              />
            ))}
          </div>
          <div className="boundary-note">
            <strong>Evidence only</strong>
            <p>No broker connection, live order routing, or automated action.</p>
          </div>
        </Panel>

        <section className="market-column">
          <Panel className="market-hero">
            <div className="market-title-row market-title-row--v2">
              <div>
                <span className="tf-eyebrow">Selected candidate</span>
                <h1>{selected.instrument}</h1>
                <p>{selected.context.session}</p>
              </div>
              <div className="decision-summary">
                <Metric label="Evidence" value={report.evidenceScore} emphasis />
                <Metric label="Confidence" value={report.confidence} emphasis />
                <div className="decision-summary__recommendation">
                  <span>Decision</span>
                  <RecommendationBadge value={report.recommendation} />
                </div>
              </div>
            </div>
            <div className="market-metrics">
              <Metric label="Trend" value={selected.context.trend} />
              <Metric label="Structure" value={selected.context.structure} />
              <Metric label="Momentum" value={selected.context.momentum} />
              <Metric label="Volatility" value={selected.context.volatility} />
            </div>
            <div className="chart-surface chart-surface--dominant">
              <PriceChart chart={selected.chart} focusedTime={focusedTime} />
            </div>
          </Panel>

          <Panel className="pipeline">
            <PanelHeading
              eyebrow="Protected loop"
              title="Decision pipeline"
              aside={<Badge>{pipeline.currentStage.replaceAll("_", " ")}</Badge>}
            />
            <div className="pipeline-track">
              {pipelineStages.map((stage, index) => {
                const record = pipeline.stages.find((item) => item.stage === stage);
                const status = record?.status === "not_applicable"
                  ? "skipped"
                  : index < currentStageIndex
                    ? "complete"
                    : index === currentStageIndex
                      ? "current"
                      : "pending";
                return (
                  <div
                    key={stage}
                    className={`pipeline-step pipeline-step--${status}`}
                    title={`${stage.replaceAll("_", " ")} · ${record?.status ?? "pending"}`}
                  >
                    <span>{index + 1}</span>
                  </div>
                );
              })}
            </div>
          </Panel>

          <section className="bottom-grid">
            <Panel className="risk-panel">
              <PanelHeading eyebrow="Risk frame" title="Capital impact" />
              <div className="risk-grid">
                <Metric label="Planned loss" value={selected.risk.amount} emphasis />
                <Metric label="Risk ceiling" value={selected.risk.ceiling} emphasis />
                <Metric label="Exposure after" value={selected.risk.exposure} emphasis />
                <Metric label="Reward / risk" value={selected.risk.rewardRisk} emphasis />
              </div>
              <div className="invalidation"><span>Mandatory invalidation</span><p>{selected.invalidation}</p></div>
            </Panel>

            <Panel className="timeline-panel">
              <PanelHeading eyebrow="Reasoning replay" title="Timeline" />
              <div className="timeline-list">
                {report.timeline.map((event) => (
                  <button
                    type="button"
                    className={`timeline-event timeline-event--${event.severity} ${focusedTime === event.occurredAt ? "timeline-event--active" : ""}`}
                    key={event.eventId}
                    onClick={() => setFocusedTime(event.occurredAt)}
                    title="Focus nearest candle"
                  >
                    <time>{new Date(event.occurredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time>
                    <span />
                    <div><strong>{event.title}</strong><small>{event.summary}</small></div>
                  </button>
                ))}
              </div>
            </Panel>
          </section>
        </section>

        <aside className="intelligence-column">
          <Panel className="intelligence-summary">
            <PanelHeading
              eyebrow="Explainable reasoning"
              title="Intelligence"
              aside={<Badge tone="neutral">{report.confidence}</Badge>}
            />
            <CaseBlock title="Bull case" className="case--bull" summary={report.bullCase.summary} limitations={report.bullCase.limitations} />
            <CaseBlock title="Bear case" className="case--bear" summary={report.bearCase.summary} limitations={report.bearCase.limitations} />
            <CaseBlock title="Neutral" className="case--neutral" summary={report.neutralCase.summary} limitations={report.neutralCase.limitations} />
          </Panel>

          <Panel className="evidence-panel">
            <PanelHeading eyebrow="Contribution ledger" title="Evidence tree" aside={<strong>{report.evidenceScore}</strong>} />
            <div className="contribution-list contribution-list--shared">
              {report.contributions.map((contribution) => (
                <EvidenceRow key={contribution.contributionId} contribution={contribution} />
              ))}
            </div>
            {report.downgradeReasons.length > 0 ? (
              <div className="downgrade-reasons"><strong>Downgrade reasons</strong>{report.downgradeReasons.map((reason) => <p key={reason}>{reason}</p>)}</div>
            ) : null}
          </Panel>
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
