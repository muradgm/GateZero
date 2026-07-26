import React from "react";

export function Panel({ as: Element = "section", className = "", children, ...props }) {
  return (
    <Element className={`tf-panel ${className}`.trim()} {...props}>
      {children}
    </Element>
  );
}

export function PanelHeading({ eyebrow, title, aside }) {
  return (
    <div className="tf-panel-heading">
      <div>
        {eyebrow ? <span className="tf-eyebrow">{eyebrow}</span> : null}
        <h2>{title}</h2>
      </div>
      {aside ? <div className="tf-panel-aside">{aside}</div> : null}
    </div>
  );
}

export function Badge({ tone = "neutral", children, className = "" }) {
  return <span className={`tf-badge tf-badge--${tone} ${className}`.trim()}>{children}</span>;
}

export function RecommendationBadge({ value }) {
  const tone = value === "PAPER_SIMULATE" ? "success" : value === "WATCH" ? "warning" : "danger";
  return <Badge tone={tone}>{value.replaceAll("_", " ")}</Badge>;
}

export function Metric({ label, value, emphasis = false }) {
  return (
    <div className={`tf-metric ${emphasis ? "tf-metric--emphasis" : ""}`.trim()}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function WatchlistCard({ candidate, active, onSelect, workflow }) {
  function handleSelect() {
    window.dispatchEvent(
      new CustomEvent("traderframe:candidate-selected", {
        detail: { id: candidate.id }
      })
    );
    onSelect?.();
  }

  const queue = workflow ?? {};
  const urgencyTone = urgencyClass(queue.urgency);
  const expiry = queue.expiresAt
    ? formatUtc(queue.expiresAt)
    : queue.status === "CLOSED"
      ? "Closed"
      : "Open";

  return (
    <button
      type="button"
      className={`tf-watchlist-card tf-watchlist-card--queue ${active ? "tf-watchlist-card--active" : ""}`.trim()}
      onClick={handleSelect}
      aria-current={active ? "true" : undefined}
    >
      <div className="tf-watchlist-card__topline">
        <span className="tf-rank">#{candidate.rank}</span>
        <span className={`tf-queue-urgency tf-queue-urgency--${urgencyTone}`}>
          {urgencyLabel(queue.urgency)}
        </span>
      </div>

      <div className="tf-watchlist-card__identity">
        <div>
          <strong>{candidate.instrument}</strong>
          <small>
            {candidate.market} · {candidate.context.session}
          </small>
        </div>
        <RecommendationBadge value={candidate.report.recommendation} />
      </div>

      <div className="tf-queue-stage">
        <span>
          {queue.currentStageLabel ?? candidate.pipeline.currentStage.replaceAll("_", " ")}
        </span>
        <strong>{queue.statusLabel ?? "Review pending"}</strong>
      </div>

      <div className="tf-queue-action">
        <span>Next</span>
        <strong>{queue.nextAction ?? "Open candidate review."}</strong>
      </div>

      <div className="tf-queue-meta">
        <span
          className={`tf-queue-freshness tf-queue-freshness--${queue.freshnessState ?? "unknown"}`}
        >
          {queue.freshnessLabel ?? "Unknown freshness"}
        </span>
        <span>{queue.reviewed ? "Reviewed" : "Unreviewed"}</span>
        <span>Expiry {expiry}</span>
      </div>
    </button>
  );
}

function urgencyClass(value) {
  if (value === "ACTION_REQUIRED" || value === "TIME_SENSITIVE") return "high";
  if (value === "REVIEW") return "medium";
  if (value === "CLOSED") return "closed";
  return "low";
}

function urgencyLabel(value) {
  if (value === "ACTION_REQUIRED") return "Action required";
  if (value === "TIME_SENSITIVE") return "Time sensitive";
  if (value === "REVIEW") return "Review";
  if (value === "CLOSED") return "Closed";
  return "Waiting";
}

function formatUtc(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "invalid";
  return `${date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC"
  })} UTC`;
}

export function EvidenceRow({ contribution }) {
  const positive = contribution.points >= 0;
  const magnitude = Math.min(Math.abs(contribution.points) / 25, 1) * 100;
  return (
    <details className={`tf-evidence-row tf-evidence-row--${positive ? "positive" : "negative"}`}>
      <summary>
        <span>{contribution.label}</span>
        <strong>
          {positive ? "+" : ""}
          {contribution.points}
        </strong>
      </summary>
      <div className="tf-evidence-bar" aria-hidden="true">
        <span style={{ width: `${magnitude}%` }} />
      </div>
      <p>{contribution.rationale}</p>
      <small>{contribution.limitation}</small>
      <code>{contribution.evidenceIds.join(" · ")}</code>
    </details>
  );
}
