import React, { useEffect, useMemo, useState } from "react";
import { Badge, Panel, PanelHeading, RecommendationBadge } from "@traderframe/ui";

const stageLabels = {
  research_case: "Research case",
  market_context: "Market context",
  evidence_assessment: "Evidence assessment",
  setup_review: "Setup review",
  intelligence_report: "Intelligence report",
  risk_review: "Risk review",
  operator_decision: "Operator decision",
  paper_simulation: "Paper simulation",
  outcome: "Outcome",
  learning: "Learning"
};

export function DecisionReplay({ candidate }) {
  const steps = useMemo(() => buildReplaySteps(candidate), [candidate]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setPlaying(false);
  }, [candidate?.id]);

  useEffect(() => {
    if (!playing || steps.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => {
        if (current >= steps.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1200);

    return () => window.clearInterval(timer);
  }, [playing, steps.length]);

  if (!candidate || steps.length === 0) return null;

  const active = steps[activeIndex];
  const progress = steps.length === 1 ? 100 : (activeIndex / (steps.length - 1)) * 100;

  function selectStep(index) {
    setActiveIndex(index);
    setPlaying(false);
    if (steps[index]?.occurredAt) {
      window.dispatchEvent(
        new CustomEvent("traderframe:replay-focus", {
          detail: { occurredAt: steps[index].occurredAt, candidateId: candidate.id }
        })
      );
    }
  }

  return (
    <Panel className="decision-replay-panel">
      <PanelHeading
        eyebrow="Decision debugger"
        title="Decision replay"
        aside={<Badge tone={playing ? "success" : "neutral"}>{activeIndex + 1} / {steps.length}</Badge>}
      />

      <div className="replay-controls">
        <button type="button" onClick={() => selectStep(Math.max(0, activeIndex - 1))} disabled={activeIndex === 0}>
          Previous
        </button>
        <button type="button" className="replay-controls__primary" onClick={() => setPlaying((value) => !value)}>
          {playing ? "Pause" : activeIndex === steps.length - 1 ? "Replay" : "Play"}
        </button>
        <button
          type="button"
          onClick={() => selectStep(Math.min(steps.length - 1, activeIndex + 1))}
          disabled={activeIndex === steps.length - 1}
        >
          Next
        </button>
      </div>

      <div className="replay-progress" aria-label={`Replay progress ${Math.round(progress)} percent`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="replay-track" role="list" aria-label="Decision replay steps">
        {steps.map((step, index) => (
          <button
            type="button"
            role="listitem"
            key={step.id}
            className={`replay-step ${index === activeIndex ? "replay-step--active" : ""} ${index < activeIndex ? "replay-step--complete" : ""}`}
            onClick={() => selectStep(index)}
            title={step.title}
          >
            <span>{index + 1}</span>
            <small>{step.shortLabel}</small>
          </button>
        ))}
      </div>

      <article className={`replay-inspector replay-inspector--${active.severity}`}>
        <div className="replay-inspector__header">
          <div>
            <span>{active.kind}</span>
            <h3>{active.title}</h3>
          </div>
          {active.occurredAt ? (
            <time>{new Date(active.occurredAt).toLocaleString([], { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</time>
          ) : null}
        </div>
        <p>{active.summary}</p>
        {active.evidenceIds.length > 0 ? (
          <div className="replay-evidence">
            <span>Evidence references</span>
            <code>{active.evidenceIds.join(" · ")}</code>
          </div>
        ) : null}
        {active.blockers.length > 0 ? (
          <div className="replay-blockers">
            <span>Blockers</span>
            {active.blockers.map((blocker) => <p key={blocker}>{blocker}</p>)}
          </div>
        ) : null}
      </article>

      <footer className="replay-decision">
        <div>
          <span>Current bounded recommendation</span>
          <strong>{candidate.report.evidenceScore} evidence · {candidate.report.confidence} confidence</strong>
        </div>
        <RecommendationBadge value={candidate.report.recommendation} />
      </footer>
    </Panel>
  );
}

function buildReplaySteps(candidate) {
  const timeline = (candidate.report?.timeline ?? []).map((event) => ({
    id: `event-${event.eventId}`,
    kind: event.type.replaceAll("_", " "),
    shortLabel: shortLabel(event.title),
    title: event.title,
    summary: event.summary,
    occurredAt: event.occurredAt,
    evidenceIds: event.evidenceIds ?? [],
    blockers: [],
    severity: event.severity ?? "info"
  }));

  const pipeline = (candidate.pipeline?.stages ?? [])
    .filter((stage) => stage.status !== "pending")
    .map((stage) => ({
      id: `stage-${stage.stage}`,
      kind: "pipeline stage",
      shortLabel: shortLabel(stageLabels[stage.stage] ?? stage.stage),
      title: stageLabels[stage.stage] ?? stage.stage.replaceAll("_", " "),
      summary: stageSummary(stage),
      occurredAt: stage.completedAt ?? null,
      evidenceIds: stage.evidenceIds ?? [],
      blockers: stage.blockers ?? [],
      severity: stage.status === "blocked" ? "blocking" : stage.status === "not_applicable" ? "attention" : "info"
    }));

  return [...timeline, ...pipeline].sort((a, b) => {
    if (!a.occurredAt && !b.occurredAt) return a.id.localeCompare(b.id);
    if (!a.occurredAt) return 1;
    if (!b.occurredAt) return -1;
    return Date.parse(a.occurredAt) - Date.parse(b.occurredAt);
  });
}

function stageSummary(stage) {
  if (stage.status === "blocked") return "Progression stopped because one or more blockers remain unresolved.";
  if (stage.status === "not_applicable") return "This stage was explicitly marked not applicable for the current bounded recommendation.";
  return stage.recordId
    ? `The stage completed with linked record ${stage.recordId}.`
    : "The stage completed with traceable local evidence.";
}

function shortLabel(value) {
  const words = value.replaceAll("_", " ").split(" ");
  return words.slice(0, 2).join(" ");
}
